import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase.from("page_seo").select("page_name, custom_styles");
  if (error) {
    console.error(error);
    return;
  }
  
  data.forEach((row) => {
    if (row.custom_styles && row.custom_styles.methodologyTitle) {
      console.log(`[${row.page_name}] methodologyTitle:`, row.custom_styles.methodologyTitle);
    }
  });
  console.log("Done checking all rows.");
}

run();
