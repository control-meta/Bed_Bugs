import { getSupabase } from "./lib/supabase";
import { getAllPagesSeo, getAllImagesSeo, savePageSeo, bulkSaveImagesSeo } from "./lib/seo-db";

async function main() {
  const supabase = getSupabase();
  if (!supabase) {
    console.error("Supabase client could not be initialized. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
    process.exit(1);
  }

  // Get local pages (which will have length > 0)
  // We need to temporarily force reading from local store by not using the DB query if it's empty, 
  // but `getAllPagesSeo` already falls back to local if DB is empty.
  const { pages } = await getAllPagesSeo();
  
  console.log(`Seeding ${pages.length} pages to Supabase...`);
  for (const page of pages) {
    const { isSupabase } = await savePageSeo(page);
    if (!isSupabase) {
      console.warn(`Failed to save page ${page.path} to Supabase`);
    } else {
      console.log(`Saved page: ${page.path}`);
    }
  }

  const { images } = await getAllImagesSeo();
  console.log(`Seeding ${images.length} images to Supabase...`);
  const { isSupabase, count } = await bulkSaveImagesSeo(images);
  if (isSupabase) {
    console.log(`Successfully saved ${count} images to Supabase.`);
  } else {
    console.warn(`Failed to bulk save images to Supabase.`);
  }
}

main().catch(console.error);
