import { createClient } from "@supabase/supabase-js";
import { testimonials, serviceReviews } from "./lib/site";
import { locations } from "./lib/locations";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createReview(payload: any) {
  const { data, error } = await supabase
    .from("reviews")
    .insert([{
      ...payload,
      status: "approved",
    }])
    .select()
    .single();

  if (error) {
    console.error("Error inserting review:", error.message);
  } else {
    console.log("Inserted:", data.name);
  }
}

async function main() {
  console.log("Seeding testimonials (Home)...");
  for (const t of testimonials) {
    await createReview({
      name: t.name,
      city: t.city,
      rating: 5,
      quote: t.quote,
      page_slug: "/",
    });
  }

  console.log("Seeding serviceReviews (Services)...");
  for (const r of serviceReviews) {
    await createReview({
      name: r.name,
      city: r.city,
      service: r.service,
      rating: r.rating || 5,
      quote: r.quote,
      page_slug: "/services",
    });
  }

  console.log("Seeding location reviews...");
  for (const loc of Object.values(locations)) {
    if (loc.reviews) {
      for (const r of loc.reviews) {
        await createReview({
          name: r.name,
          city: loc.name,
          rating: r.rating || 5,
          quote: r.quote,
          page_slug: loc.slug,
        });
      }
    }
  }

  console.log("All reviews seeded successfully!");
}

main().catch(console.error);
