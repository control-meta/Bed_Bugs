import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Allowed tags (for line breaks and bold/italic)
const stripUnwantedHtml = (html: string) => {
  if (typeof html !== 'string') return html;
  
  // If it's a huge block of pasted element like <h2 class="...">text</h2>, 
  // we want to extract just the text.
  // Actually, standard regex replace is fine.
  
  // First, check if it starts with <h1, <h2, <h3, <h4, <h5, <h6, <div, <p, <span
  // and has a lot of style/classes.
  // A simple way is to strip ALL attributes from ALL tags, EXCEPT for our own tags.
  // But since the user only pastes simple text or uses the toolbar, the toolbar ONLY generates <span style="color/font-size"> or <b>/<i>/<u>.
  
  // Let's just find anything with 'outline-emerald-600' and strip it.
  if (html.includes("outline-emerald-600") || html.includes("cursor-text") || html.includes("oklab")) {
     // Strip all tags completely.
     return html.replace(/<[^>]*>?/gm, '');
  }
  
  return html;
};

async function run() {
  const { data, error } = await supabase.from("location_pages").select("*");
  if (error) {
    console.error(error);
    return;
  }
  
  for (const row of data) {
    let updated = false;
    const styles = row.custom_styles;
    
    if (styles) {
      for (const [key, value] of Object.entries(styles)) {
        if (typeof value === 'string') {
          const cleaned = stripUnwantedHtml(value);
          if (cleaned !== value) {
            console.log(`[${row.slug}] Fixed field: ${key}`);
            styles[key] = cleaned;
            updated = true;
          }
        }
      }
    }
    
    // Also check hero_heading, title, tagline etc in the row itself!
    const fieldsToCheck = ["hero_heading", "tagline", "hero_description"];
    const updates: any = {};
    
    for (const field of fieldsToCheck) {
      if (typeof row[field] === 'string') {
        const cleaned = stripUnwantedHtml(row[field]);
        if (cleaned !== row[field]) {
          console.log(`[${row.slug}] Fixed root field: ${field}`);
          updates[field] = cleaned;
          updated = true;
        }
      }
    }
    
    if (updated) {
      if (styles) updates.custom_styles = styles;
      const { error: updateError } = await supabase.from("location_pages").update(updates).eq("slug", row.slug);
      if (updateError) {
        console.error(`Error updating ${row.slug}:`, updateError);
      } else {
        console.log(`Successfully updated ${row.slug}`);
      }
    }
  }
  console.log("Done sanitizing DB!");
}

run();
