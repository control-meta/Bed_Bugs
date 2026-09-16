import fs from "fs";
import path from "path";

export type CustomerReview = {
  id: string;
  name: string;
  city?: string;
  service?: string;
  rating: number;
  quote: string;
  created_at: string;
};

const LOCAL_REVIEWS_PATH = path.join(process.cwd(), ".local_reviews.json");

export function readLocalReviews(): CustomerReview[] {
  try {
    if (fs.existsSync(LOCAL_REVIEWS_PATH)) {
      const data = fs.readFileSync(LOCAL_REVIEWS_PATH, "utf8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Failed to read local reviews file:", err);
  }
  return [];
}

export function saveLocalReview(
  reviewData: Omit<CustomerReview, "id" | "created_at">,
): CustomerReview {
  const reviews = readLocalReviews();
  const newReview: CustomerReview = {
    id: `rev-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    ...reviewData,
    created_at: new Date().toISOString(),
  };

  reviews.unshift(newReview);

  try {
    fs.writeFileSync(
      LOCAL_REVIEWS_PATH,
      JSON.stringify(reviews, null, 2),
      "utf8",
    );
  } catch (err) {
    console.error("Failed to save local reviews file:", err);
  }

  return newReview;
}
