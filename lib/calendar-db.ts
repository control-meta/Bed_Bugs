import fs from "fs";
import path from "path";
import { getSupabase } from "./supabase";

export type BlogPlan = {
  date: string; // YYYY-MM-DD
  topic: string;
  keywords: string[];
  searchVolume: string;
  type: "how-to" | "guide" | "list" | "comparison" | "local" | "educational";
  status?: "planned" | "generated";
  id?: string;
  createdAt?: string;
  updatedAt?: string;
};

const LOCAL_CALENDAR_PATH = path.join(process.cwd(), ".local_content_calendar.json");

// Local JSON fallback helpers
function readLocalCalendar(): Record<string, BlogPlan> {
  try {
    if (fs.existsSync(LOCAL_CALENDAR_PATH)) {
      const data = fs.readFileSync(LOCAL_CALENDAR_PATH, "utf8");
      const parsed = JSON.parse(data);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        return parsed;
      }
      // Handle legacy array if stored as array
      if (Array.isArray(parsed)) {
        const dict: Record<string, BlogPlan> = {};
        for (const item of parsed) {
          if (item?.date) dict[item.date] = item;
        }
        return dict;
      }
    }
  } catch (err) {
    console.error("Failed to read local content calendar file:", err);
  }
  return {};
}

function saveLocalCalendar(calendarMap: Record<string, BlogPlan>): void {
  try {
    fs.writeFileSync(
      LOCAL_CALENDAR_PATH,
      JSON.stringify(calendarMap, null, 2),
      "utf8",
    );
  } catch (err) {
    console.error("Failed to save local content calendar file:", err);
  }
}

// Transform DB row to BlogPlan
function transformRowToPlan(row: any): BlogPlan {
  return {
    date: row.date,
    topic: row.topic,
    keywords: Array.isArray(row.keywords) ? row.keywords : [],
    searchVolume: row.search_volume || "",
    type: row.type || "guide",
    status: row.status || "planned",
    id: row.id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// Transform BlogPlan to DB row
function transformPlanToRow(plan: BlogPlan) {
  const parts = plan.date.split("-");
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);

  return {
    date: plan.date,
    topic: plan.topic,
    keywords: plan.keywords || [],
    search_volume: plan.searchVolume || "",
    type: plan.type || "guide",
    status: plan.status || "planned",
    month: isNaN(month) ? 1 : month,
    year: isNaN(year) ? 2026 : year,
    updated_at: new Date().toISOString(),
  };
}

/**
 * Fetch calendar plans for a specific month and year
 */
export async function getCalendarPlans(
  month: number,
  year: number,
): Promise<{ plan: BlogPlan[]; isSupabase: boolean }> {
  const client = getSupabase();

  if (client) {
    try {
      const { data, error } = await client
        .from("content_calendar")
        .select("*")
        .eq("year", year)
        .eq("month", month)
        .order("date", { ascending: true });

      if (!error && data) {
        const plans = data.map(transformRowToPlan);
        return { plan: plans, isSupabase: true };
      }

      if (error && error.code !== "42P01") {
        console.warn("Supabase query error for content_calendar:", error.message);
      }
    } catch (err) {
      console.warn("Failed to retrieve content_calendar from Supabase:", err);
    }
  }

  // Fallback to local storage
  const localMap = readLocalCalendar();
  const prefix = `${year}-${String(month).padStart(2, "0")}`;
  const filtered = Object.values(localMap)
    .filter((item) => item.date.startsWith(prefix))
    .sort((a, b) => a.date.localeCompare(b.date));

  return { plan: filtered, isSupabase: false };
}

/**
 * Upsert calendar plans to database and local store
 */
export async function saveCalendarPlans(
  newPlans: BlogPlan[],
  month: number,
  year: number,
): Promise<{ plan: BlogPlan[]; isSupabase: boolean }> {
  // 1. Update local storage
  const localMap = readLocalCalendar();
  for (const p of newPlans) {
    localMap[p.date] = {
      ...(localMap[p.date] || {}),
      ...p,
      status: p.status || "planned",
      updatedAt: new Date().toISOString(),
    };
  }
  saveLocalCalendar(localMap);

  // 2. Persist to Supabase if configured
  const client = getSupabase();
  let isSupabaseSuccess = false;

  if (client && newPlans.length > 0) {
    try {
      const rows = newPlans.map((p) => transformPlanToRow(p));
      const { error } = await client
        .from("content_calendar")
        .upsert(rows, { onConflict: "date" });

      if (error) {
        console.error("Supabase upsert error for content_calendar:", error.message);
      } else {
        isSupabaseSuccess = true;
      }
    } catch (err) {
      console.error("Failed to upsert calendar plans to Supabase:", err);
    }
  }

  // 3. Return the full month's plan (existing past days + newly updated days)
  return getCalendarPlans(month, year);
}

/**
 * Update the status of an existing planned date (e.g. from "planned" to "generated")
 */
export async function updateCalendarPlanStatus(
  date: string,
  status: "planned" | "generated",
): Promise<BlogPlan | null> {
  // 1. Local update
  const localMap = readLocalCalendar();
  if (localMap[date]) {
    localMap[date].status = status;
    localMap[date].updatedAt = new Date().toISOString();
    saveLocalCalendar(localMap);
  }

  // 2. Supabase update
  const client = getSupabase();
  if (client) {
    try {
      const { data, error } = await client
        .from("content_calendar")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("date", date)
        .select()
        .single();

      if (!error && data) {
        return transformRowToPlan(data);
      }
    } catch (err) {
      console.error("Failed to update status in Supabase:", err);
    }
  }

  return localMap[date] || null;
}
