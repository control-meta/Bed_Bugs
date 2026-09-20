import { NextRequest, NextResponse } from "next/server";
import { getCalendarPlans, updateCalendarPlan } from "@/lib/calendar-db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const today = new Date();
    const month = parseInt(searchParams.get("month") || String(today.getMonth() + 1), 10);
    const year = parseInt(searchParams.get("year") || String(today.getFullYear()), 10);

    if (isNaN(month) || month < 1 || month > 12 || isNaN(year) || year < 2000 || year > 2100) {
      return NextResponse.json(
        { error: "Invalid month or year parameters" },
        { status: 400 }
      );
    }

    const { plan, isSupabase } = await getCalendarPlans(month, year);
    return NextResponse.json({ plan, isSupabase });
  } catch (error: any) {
    console.error("Error in GET /api/admin/calendar:", error);
    return NextResponse.json(
      { error: error.message || "Failed to retrieve calendar plans" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { date, status, keywords, topic } = body;

    if (!date) {
      return NextResponse.json(
        { error: "Invalid date provided" },
        { status: 400 }
      );
    }
    
    if (status && status !== "planned" && status !== "generated") {
      return NextResponse.json(
        { error: "Invalid status provided" },
        { status: 400 }
      );
    }

    const updates: any = {};
    if (status !== undefined) updates.status = status;
    if (keywords !== undefined) updates.keywords = keywords;
    if (topic !== undefined) updates.topic = topic;

    const updated = await updateCalendarPlan(date, updates);
    return NextResponse.json({ success: true, plan: updated });
  } catch (error: any) {
    console.error("Error in PATCH /api/admin/calendar:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update calendar status" },
      { status: 500 }
    );
  }
}
