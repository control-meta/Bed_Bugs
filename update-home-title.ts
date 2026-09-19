import { getSupabase } from "./lib/supabase";
import { getPageSeo, savePageSeo } from "./lib/seo-db";

async function main() {
  const supabase = getSupabase();
  if (!supabase) {
    console.error("Supabase not configured");
    return;
  }

  const pagePath = "/";
  const seoData = await getPageSeo(pagePath);
  
  // Set a professional meta title
  seoData.title = "Bed Bug Treatment & Pest Control Services in India | 100% Odorless";
  
  const { isSupabase } = await savePageSeo(seoData);
  
  if (isSupabase) {
    console.log("Successfully updated home page meta title in Supabase!");
  } else {
    console.log("Failed to update in Supabase. Check permissions.");
  }
}

main().catch(console.error);
