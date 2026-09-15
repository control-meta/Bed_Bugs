import { createClient, SupabaseClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

export type Enquiry = {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  city?: string | null;
  property_type?: string | null;
  message?: string | null;
  source: string;
  source_url?: string | null;
  status: "new" | "contacted" | "scheduled" | "completed" | "cancelled";
  notes?: string | null;
  created_at: string;
  updated_at: string;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function isSupabaseConfigured(): boolean {
  return Boolean(
    supabaseUrl &&
      supabaseUrl.startsWith("https://") &&
      !supabaseUrl.includes("your-project-id") &&
      supabaseServiceKey &&
      supabaseServiceKey.length > 20 &&
      !supabaseServiceKey.startsWith("change_"),
  );
}

let supabaseInstance: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured()) {
    return null;
  }
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl!, supabaseServiceKey!, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }
  return supabaseInstance;
}

// ==============================================================================
// Local Fallback Storage
// Persists to .local_enquiries.json if Supabase keys haven't been added yet.
// ==============================================================================
const LOCAL_STORAGE_PATH = path.join(process.cwd(), ".local_enquiries.json");

function readLocalEnquiries(): Enquiry[] {
  try {
    if (fs.existsSync(LOCAL_STORAGE_PATH)) {
      const data = fs.readFileSync(LOCAL_STORAGE_PATH, "utf8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Failed to read local enquiries file:", err);
  }
  return [];
}

function saveLocalEnquiries(enquiries: Enquiry[]): void {
  try {
    fs.writeFileSync(
      LOCAL_STORAGE_PATH,
      JSON.stringify(enquiries, null, 2),
      "utf8",
    );
  } catch (err) {
    console.error("Failed to save local enquiries file:", err);
  }
}

// Seed with a few demo items if local store is completely empty
function ensureInitialSeed(enquiries: Enquiry[]): Enquiry[] {
  if (enquiries.length === 0) {
    const seed: Enquiry[] = [
      {
        id: "demo-enquiry-1",
        name: "Rahul Verma",
        phone: "9820123456",
        email: "rahul.v@example.com",
        city: "Mumbai",
        property_type: "2 BHK Flat",
        message: "Found active bed bugs under master bedroom mattress seam.",
        source: "contact_page",
        source_url: "/contact",
        status: "new",
        notes: "Called once, asked for morning inspection.",
        created_at: new Date(Date.now() - 1000 * 60 * 25).toISOString(), // 25 mins ago
        updated_at: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
      },
      {
        id: "demo-enquiry-2",
        name: "Pooja Sharma",
        phone: "9988776655",
        city: "Pune",
        source: "hero_quick_connect",
        source_url: "/",
        status: "contacted",
        notes: "Shared WhatsApp quote for 1 BHK treatment.",
        created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hrs ago
        updated_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      },
      {
        id: "demo-enquiry-3",
        name: "Anand Kulkarni",
        phone: "9123456789",
        city: "Bangalore",
        property_type: "3 BHK Apartment",
        message: "Need urgent inspection before weekend.",
        source: "floating_widget",
        source_url: "/bangalore",
        status: "scheduled",
        notes: "Technician booked for Saturday 11:00 AM.",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
        updated_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
      },
    ];
    saveLocalEnquiries(seed);
    return seed;
  }
  return enquiries;
}

// ==============================================================================
// Unified Data Access Layer (Supabase with Local Fallback)
// ==============================================================================

export async function createEnquiry(
  payload: Omit<Enquiry, "id" | "created_at" | "updated_at">,
): Promise<Enquiry> {
  const client = getSupabase();

  if (client) {
    const { data, error } = await client
      .from("enquiries")
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      throw new Error(error.message);
    }
    return data as Enquiry;
  }

  // Fallback to local storage
  const now = new Date().toISOString();
  const newEnquiry: Enquiry = {
    ...payload,
    id: `local-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    created_at: now,
    updated_at: now,
  };

  const list = ensureInitialSeed(readLocalEnquiries());
  list.unshift(newEnquiry);
  saveLocalEnquiries(list);

  return newEnquiry;
}

export async function getEnquiries(options?: {
  search?: string;
  status?: string;
  source?: string;
  limit?: number;
}): Promise<{ enquiries: Enquiry[]; total: number; isSupabase: boolean }> {
  const client = getSupabase();

  if (client) {
    let query = client
      .from("enquiries")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false });

    if (options?.status && options.status !== "all") {
      query = query.eq("status", options.status);
    }

    if (options?.source && options.source !== "all") {
      query = query.eq("source", options.source);
    }

    if (options?.search) {
      const s = `%${options.search}%`;
      query = query.or(
        `name.ilike.${s},phone.ilike.${s},city.ilike.${s},message.ilike.${s}`,
      );
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    const { data, error, count } = await query;
    if (error) {
      console.error("Supabase select error:", error);
      throw new Error(error.message);
    }

    return {
      enquiries: (data || []) as Enquiry[],
      total: count || (data?.length ?? 0),
      isSupabase: true,
    };
  }

  // Fallback local querying
  let list = ensureInitialSeed(readLocalEnquiries());

  if (options?.status && options.status !== "all") {
    list = list.filter((item) => item.status === options.status);
  }

  if (options?.source && options.source !== "all") {
    list = list.filter((item) => item.source === options.source);
  }

  if (options?.search) {
    const q = options.search.toLowerCase();
    list = list.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.phone.includes(q) ||
        (item.city && item.city.toLowerCase().includes(q)) ||
        (item.message && item.message.toLowerCase().includes(q)),
    );
  }

  const total = list.length;
  if (options?.limit) {
    list = list.slice(0, options.limit);
  }

  return {
    enquiries: list,
    total,
    isSupabase: false,
  };
}

export async function updateEnquiry(
  id: string,
  updates: Partial<Pick<Enquiry, "status" | "notes">>,
): Promise<Enquiry | null> {
  const client = getSupabase();

  if (client) {
    const { data, error } = await client
      .from("enquiries")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Supabase update error:", error);
      throw new Error(error.message);
    }
    return data as Enquiry;
  }

  // Fallback local update
  const list = ensureInitialSeed(readLocalEnquiries());
  const index = list.findIndex((e) => e.id === id);
  if (index === -1) return null;

  list[index] = {
    ...list[index],
    ...updates,
    updated_at: new Date().toISOString(),
  };

  saveLocalEnquiries(list);
  return list[index];
}

export async function deleteEnquiry(id: string): Promise<boolean> {
  const client = getSupabase();

  if (client) {
    const { error } = await client.from("enquiries").delete().eq("id", id);
    if (error) {
      console.error("Supabase delete error:", error);
      throw new Error(error.message);
    }
    return true;
  }

  // Fallback local delete
  let list = ensureInitialSeed(readLocalEnquiries());
  const beforeCount = list.length;
  list = list.filter((e) => e.id !== id);
  saveLocalEnquiries(list);
  return list.length < beforeCount;
}
