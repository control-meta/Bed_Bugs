import { getSupabase } from "./lib/supabase";
import { getCalendarPlans, saveCalendarPlans } from "./lib/calendar-db";
import fs from "fs";
import path from "path";

async function main() {
  const supabase = getSupabase();
  if (!supabase) {
    console.error("Supabase not configured");
    return;
  }

  const LOCAL_CALENDAR_PATH = path.join(process.cwd(), ".local_content_calendar.json");
  if (!fs.existsSync(LOCAL_CALENDAR_PATH)) {
    console.log("No local calendar data found to seed.");
    return;
  }

  const data = fs.readFileSync(LOCAL_CALENDAR_PATH, "utf8");
  const parsed = JSON.parse(data);
  const plans = Object.values(parsed) as any[];

  if (plans.length === 0) {
    console.log("Local calendar is empty.");
    return;
  }

  console.log(`Found ${plans.length} calendar items locally. Pushing to Supabase...`);
  
  // We can push them by grouping them by month/year or just save them using saveCalendarPlans
  // Since saveCalendarPlans requires a month and year, we can just pick any since the upsert works for all passed plans.
  const { isSupabase } = await saveCalendarPlans(plans, 9, 2026);
  
  if (isSupabase) {
    console.log("Successfully seeded calendar data to Supabase database!");
  } else {
    console.log("Failed to seed to Supabase. Make sure you ran the SQL migration.");
  }
}

main().catch(console.error);
