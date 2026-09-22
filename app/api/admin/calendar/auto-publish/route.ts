import { NextRequest, NextResponse } from "next/server";
import {
  getAutoPublishConfig,
  getAutoPublishConfigWithLiveLogs,
  saveAutoPublishConfig,
  calculateNextRunTime,
  getNextPlannedPost,
  AutoPublishConfig,
  startAutoPublishServerWorker,
  stopAutoPublishServerWorker,
} from "@/lib/auto-publish-service";

export async function GET() {
  try {
    const config = await getAutoPublishConfigWithLiveLogs();
    const nextPlanned = await getNextPlannedPost();

    let timeRemainingSeconds = 0;
    if (config.enabled && config.nextRunAt) {
      const remainingMs = new Date(config.nextRunAt).getTime() - Date.now();
      timeRemainingSeconds = Math.max(0, Math.floor(remainingMs / 1000));
    }

    return NextResponse.json({
      config,
      nextPlannedPost: nextPlanned,
      timeRemainingSeconds,
    });
  } catch (err: any) {
    console.error("[api/admin/calendar/auto-publish] GET error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to fetch auto-publish config" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const current = getAutoPublishConfig();

    const enabled = typeof body.enabled === "boolean" ? body.enabled : current.enabled;
    const frequency = body.frequency || current.frequency || "1min";
    const dailyTime = body.dailyTime || current.dailyTime || "09:00";

    // Recalculate next run time if enabled
    let nextRunAt = current.nextRunAt;
    if (enabled && (!current.enabled || frequency !== current.frequency || dailyTime !== current.dailyTime || !nextRunAt)) {
      nextRunAt = calculateNextRunTime(frequency, dailyTime);
    } else if (!enabled) {
      nextRunAt = undefined;
    }

    const updated: AutoPublishConfig = {
      ...current,
      enabled,
      frequency,
      dailyTime,
      nextRunAt,
    };

    saveAutoPublishConfig(updated);
    if (updated.enabled && updated.nextRunAt) {
      startAutoPublishServerWorker();
    } else {
      stopAutoPublishServerWorker();
    }
    const nextPlanned = await getNextPlannedPost();
    const liveConfig = await getAutoPublishConfigWithLiveLogs();

    let timeRemainingSeconds = 0;
    if (updated.enabled && updated.nextRunAt) {
      const remainingMs = new Date(updated.nextRunAt).getTime() - Date.now();
      timeRemainingSeconds = Math.max(0, Math.floor(remainingMs / 1000));
    }

    return NextResponse.json({
      success: true,
      config: liveConfig,
      nextPlannedPost: nextPlanned,
      timeRemainingSeconds,
    });
  } catch (err: any) {
    console.error("[api/admin/calendar/auto-publish] POST error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to update auto-publish config" },
      { status: 500 }
    );
  }
}
