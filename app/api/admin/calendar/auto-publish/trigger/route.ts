import { NextResponse } from "next/server";
import { executeAutoPublish, getAutoPublishConfig, getNextPlannedPost } from "@/lib/auto-publish-service";

export const maxDuration = 300; // Allow 5 minutes for OpenAI blog generation

export async function POST() {
  try {
    const result = await executeAutoPublish();
    const config = getAutoPublishConfig();
    const nextPlanned = await getNextPlannedPost();

    return NextResponse.json({
      ...result,
      config,
      nextPlannedPost: nextPlanned,
    });
  } catch (err: any) {
    console.error("[api/admin/calendar/auto-publish/trigger] Error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to trigger auto-publish" },
      { status: 500 }
    );
  }
}
