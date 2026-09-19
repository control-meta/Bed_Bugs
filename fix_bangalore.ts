import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase.from("location_pages").select("slug, custom_styles").eq("slug", "bangalore").single();
  if (error) {
    console.error(error);
    return;
  }
  
  if (data.custom_styles && data.custom_styles.methodologyTitle) {
    console.log("OLD:", data.custom_styles.methodologyTitle);
    
    let newTitle = data.custom_styles.methodologyTitle;
    
    // Remove all HTML tags to be totally safe
    newTitle = newTitle.replace(/<[^>]*>?/gm, '');
    
    console.log("NEW:", newTitle);
    
    data.custom_styles.methodologyTitle = newTitle;
    
    const { error: updateError } = await supabase.from("location_pages").update({ custom_styles: data.custom_styles }).eq("slug", "bangalore");
    if (updateError) {
      console.error("Update error:", updateError);
    } else {
      console.log("Successfully fixed Bangalore methodologyTitle!");
    }
  } else {
    console.log("No custom methodologyTitle found for Bangalore in location_pages either!");
  }
}

run();
