import { createReview, getReviews } from "./lib/reviews";
import { testimonials, serviceReviews } from "./lib/site";

async function main() {
  const { reviews } = await getReviews({ status: "all" });
  if (reviews.length > 0) {
    console.log(`Database already has ${reviews.length} reviews.`);
    if (reviews.length > 5) return;
  }

  console.log("Seeding testimonials...");
  for (const t of testimonials) {
    await createReview({
      name: t.name,
      city: t.city,
      rating: 5,
      quote: t.quote,
      status: "approved",
      page_slug: "/",
    });
  }

  console.log("Seeding serviceReviews...");
  for (const r of serviceReviews) {
    await createReview({
      name: r.name,
      city: r.city,
      service: r.service,
      rating: r.rating || 5,
      quote: r.quote,
      status: "approved",
      page_slug: "/services",
    });
  }
  console.log("Reviews seeded successfully!");
}

main().catch(console.error);
