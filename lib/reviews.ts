import fs from "fs";
import path from "path";
import { getSupabase } from "./supabase";

export type CustomerReview = {
  id: string;
  name: string;
  city?: string | null;
  service?: string | null;
  rating: number;
  quote: string;
  created_at: string;
  status: "pending" | "approved" | "denied";
  page_slug?: string | null;
};

const LOCAL_REVIEWS_PATH = path.join(process.cwd(), ".local_reviews.json");

function readLocalReviews(): CustomerReview[] {
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

function saveLocalReviews(reviews: CustomerReview[]): void {
  try {
    fs.writeFileSync(
      LOCAL_REVIEWS_PATH,
      JSON.stringify(reviews, null, 2),
      "utf8",
    );
  } catch (err) {
    console.error("Failed to save local reviews file:", err);
  }
}

// Seed with a few demo items if local store is completely empty
function ensureInitialSeed(reviews: CustomerReview[]): CustomerReview[] {
  if (reviews.length === 0) {
    const seed: CustomerReview[] = [
      {
        id: "demo-rev-1",
        name: "Rahul M.",
        city: "Mumbai",
        service: "Bed Bug Inspection",
        rating: 5,
        quote: "Very professional and thorough inspection. The technician explained everything clearly.",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
        status: "approved",
      },
      {
        id: "demo-rev-2",
        name: "Priya S.",
        city: "Pune",
        service: "Bed Bug Treatment",
        rating: 5,
        quote: "Finally got rid of the bed bugs! The treatment was effective and they provided great aftercare advice.",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
        status: "approved",
      },
    ];
    saveLocalReviews(seed);
    return seed;
  }
  return reviews;
}

export async function getReviews(options?: {
  limit?: number;
  status?: "pending" | "approved" | "denied" | "all";
  page_slug?: string;
}): Promise<{ reviews: CustomerReview[]; total: number; isSupabase: boolean }> {
  const client = getSupabase();

  if (client) {
    let query = client
      .from("reviews")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false });

    if (options?.limit) {
      query = query.limit(options.limit);
    }
    
    if (options?.status && options.status !== "all") {
      query = query.eq("status", options.status);
    }

    if (options?.page_slug) {
      query = query.eq("page_slug", options.page_slug);
    }

    const { data, error, count } = await query;
    if (error) {
      console.error("Supabase select error:", error);
      // Fallback to local if column is missing (e.g. migration not run yet)
      if (error.code === '42703' || error.message.includes('does not exist')) {
        console.log("Falling back to local data due to missing Supabase schema...");
      } else {
        throw new Error(error.message);
      }
    } else {
      return {
        reviews: (data || []) as CustomerReview[],
        total: count || (data?.length ?? 0),
        isSupabase: true,
      };
    }
  }

  // Fallback local querying
  let list = ensureInitialSeed(readLocalReviews());
  
  if (options?.status && options.status !== "all") {
    list = list.filter((r) => r.status === options.status);
  }

  if (options?.page_slug) {
    list = list.filter((r) => r.page_slug === options.page_slug);
  }

  const total = list.length;

  if (options?.limit) {
    list = list.slice(0, options.limit);
  }

  return {
    reviews: list,
    total,
    isSupabase: false,
  };
}

export async function createReview(
  payload: Omit<CustomerReview, "id" | "created_at" | "status"> & { status?: "pending" | "approved" | "denied" },
): Promise<CustomerReview> {
  const client = getSupabase();
  const status = payload.status || "pending";

  if (client) {
    const { data, error } = await client
      .from("reviews")
      .insert([{
        ...payload,
        city: payload.city || null,
        service: payload.service || null,
        page_slug: payload.page_slug || null,
        status,
      }])
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      throw new Error(error.message);
    }
    return data as CustomerReview;
  }

  // Fallback to local storage
  const newReview: CustomerReview = {
    ...payload,
    city: payload.city || null,
    service: payload.service || null,
    page_slug: payload.page_slug || null,
    status,
    id: `local-rev-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    created_at: new Date().toISOString(),
  };

  const list = ensureInitialSeed(readLocalReviews());
  list.unshift(newReview);
  saveLocalReviews(list);

  return newReview;
}

export async function updateReview(
  id: string,
  updates: Partial<Omit<CustomerReview, "id" | "created_at">>,
): Promise<CustomerReview | null> {
  const client = getSupabase();

  if (client) {
    const { data, error } = await client
      .from("reviews")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Supabase update error:", error);
      throw new Error(error.message);
    }
    return data as CustomerReview;
  }

  // Fallback local update
  const list = ensureInitialSeed(readLocalReviews());
  const index = list.findIndex((r) => r.id === id);
  if (index === -1) return null;

  list[index] = {
    ...list[index],
    ...updates,
  };

  saveLocalReviews(list);
  return list[index];
}

export async function deleteReview(id: string): Promise<boolean> {
  const client = getSupabase();

  if (client) {
    const { error } = await client.from("reviews").delete().eq("id", id);
    if (error) {
      console.error("Supabase delete error:", error);
      throw new Error(error.message);
    }
    return true;
  }

  // Fallback local delete
  let list = ensureInitialSeed(readLocalReviews());
  const beforeCount = list.length;
  list = list.filter((r) => r.id !== id);
  saveLocalReviews(list);
  return list.length < beforeCount;
}

// Keeping the original synchronous export for backwards compatibility if needed elsewhere
// But we should try to migrate consumers to async getReviews() where possible.
export function readLocalReviewsSync(): CustomerReview[] {
  return ensureInitialSeed(readLocalReviews());
}
