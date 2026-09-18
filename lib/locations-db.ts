import fs from "fs";
import path from "path";
import { getSupabase } from "./supabase";
import { locations as defaultLocations, LocationInfo } from "./locations";

export interface CustomStyles {
  fontFamily?: string;
  heroTitleSize?: string;
  heroTitleWeight?: string;
  heroTitleColor?: string;
  accentColor?: string;
  [key: string]: any;
}

export type ExtendedLocationInfo = LocationInfo & {
  id?: string;
  heroHeading?: string;
  customStyles?: CustomStyles;
  status?: "published" | "draft";
  updatedAt?: string;
  createdAt?: string;
};

const LOCAL_LOCATIONS_PATH = path.join(process.cwd(), ".local_location_pages.json");

// Read local JSON fallback
function readLocalLocations(): ExtendedLocationInfo[] {
  try {
    if (fs.existsSync(LOCAL_LOCATIONS_PATH)) {
      const data = fs.readFileSync(LOCAL_LOCATIONS_PATH, "utf8");
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error("Failed to read local location pages file:", err);
  }
  return ensureInitialSeed([]);
}

// Save local JSON fallback
function saveLocalLocations(locations: ExtendedLocationInfo[]): void {
  try {
    fs.writeFileSync(
      LOCAL_LOCATIONS_PATH,
      JSON.stringify(locations, null, 2),
      "utf8",
    );
  } catch (err) {
    console.error("Failed to save local location pages file:", err);
  }
}

// Seed initial static locations into local storage
function ensureInitialSeed(list: ExtendedLocationInfo[]): ExtendedLocationInfo[] {
  if (list.length === 0) {
    const seeded: ExtendedLocationInfo[] = defaultLocations.map((loc) => ({
      ...loc,
      status: "published",
      customStyles: {
        fontFamily: "var(--font-poppins)",
        heroTitleSize: "text-4xl lg:text-[3rem]",
        heroTitleWeight: "font-extrabold",
        accentColor: "#1f8055",
      },
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    }));
    saveLocalLocations(seeded);
    return seeded;
  }
  return list;
}

// Transform database row (snake_case) to ExtendedLocationInfo (camelCase)
function transformDbRowToLocation(row: any): ExtendedLocationInfo {
  return {
    slug: row.slug,
    name: row.name,
    state: row.state,
    image: row.image,
    tagline: row.tagline,
    heroHeading: row.hero_heading || (row.custom_styles?.heroHeading) || undefined,
    title: row.title,
    metaDescription: row.meta_description,
    keywords: Array.isArray(row.keywords) ? row.keywords : [],
    heroDescription: row.hero_description,
    responseTime: row.response_time,
    activeTechnicians: row.active_technicians,
    homesTreated: row.homes_treated,
    rating: row.rating,
    reviewCount: row.review_count,
    phone: row.phone,
    phoneDisplay: row.phone_display,
    whatsappText: row.whatsapp_text,
    coverageAreas: Array.isArray(row.coverage_areas) ? row.coverage_areas : [],
    pricing: Array.isArray(row.pricing) ? row.pricing : [],
    localHighlights: Array.isArray(row.local_highlights) ? row.local_highlights : [],
    faqs: Array.isArray(row.faqs) ? row.faqs : [],
    reviews: Array.isArray(row.reviews) ? row.reviews : [],
    customStyles: row.custom_styles || {},
    status: row.status || "published",
    id: row.id,
    updatedAt: row.updated_at,
    createdAt: row.created_at,
  };
}

// Transform ExtendedLocationInfo to DB row (snake_case)
function transformLocationToDbRow(loc: Partial<ExtendedLocationInfo>) {
  const row: Record<string, any> = {};
  if (loc.slug !== undefined) row.slug = loc.slug.toLowerCase().trim();
  if (loc.name !== undefined) row.name = loc.name;
  if (loc.state !== undefined) row.state = loc.state;
  if (loc.image !== undefined) row.image = loc.image;
  if (loc.tagline !== undefined) row.tagline = loc.tagline;
  if (loc.title !== undefined) row.title = loc.title;
  if (loc.metaDescription !== undefined) row.meta_description = loc.metaDescription;
  if (loc.keywords !== undefined) row.keywords = loc.keywords;
  if (loc.heroDescription !== undefined) row.hero_description = loc.heroDescription;
  if (loc.responseTime !== undefined) row.response_time = loc.responseTime;
  if (loc.activeTechnicians !== undefined) row.active_technicians = loc.activeTechnicians;
  if (loc.homesTreated !== undefined) row.homes_treated = loc.homesTreated;
  if (loc.rating !== undefined) row.rating = loc.rating;
  if (loc.reviewCount !== undefined) row.review_count = loc.reviewCount;
  if (loc.phone !== undefined) row.phone = loc.phone;
  if (loc.phoneDisplay !== undefined) row.phone_display = loc.phoneDisplay;
  if (loc.whatsappText !== undefined) row.whatsapp_text = loc.whatsappText;
  if (loc.coverageAreas !== undefined) row.coverage_areas = loc.coverageAreas;
  if (loc.pricing !== undefined) row.pricing = loc.pricing;
  if (loc.localHighlights !== undefined) row.local_highlights = loc.localHighlights;
  if (loc.faqs !== undefined) row.faqs = loc.faqs;
  if (loc.reviews !== undefined) row.reviews = loc.reviews;
  if (loc.customStyles !== undefined || loc.heroHeading !== undefined) {
    row.custom_styles = {
      ...(loc.customStyles || {}),
      ...(loc.heroHeading ? { heroHeading: loc.heroHeading } : {}),
    };
  }
  if (loc.status !== undefined) row.status = loc.status;
  return row;
}

// Auto-seed Supabase if table is empty
let isSeedingSupabase = false;
async function seedSupabaseIfNeeded(client: any) {
  if (isSeedingSupabase) return;
  isSeedingSupabase = true;
  try {
    const { count, error } = await client
      .from("location_pages")
      .select("*", { count: "exact", head: true });

    if (!error && (count === 0 || count === null)) {
      console.log("Seeding location_pages to Supabase...");
      const seedRows = defaultLocations.map((loc) => ({
        ...transformLocationToDbRow(loc),
        status: "published",
        custom_styles: {
          fontFamily: "var(--font-poppins)",
          heroTitleSize: "text-4xl lg:text-[3rem]",
          heroTitleWeight: "font-extrabold",
          accentColor: "#1f8055",
        },
      }));
      await client.from("location_pages").upsert(seedRows, { onConflict: "slug" });
      console.log("Successfully seeded 5 location pages to Supabase.");
    }
  } catch (err) {
    console.warn("Supabase seed check warning:", err);
  } finally {
    isSeedingSupabase = false;
  }
}

/**
 * Get all location pages
 */
export async function getAllLocationPages(): Promise<ExtendedLocationInfo[]> {
  const client = getSupabase();

  if (client) {
    try {
      const { data, error } = await client
        .from("location_pages")
        .select("*")
        .order("name", { ascending: true });

      if (!error && data && data.length > 0) {
        return data.map(transformDbRowToLocation);
      }

      // If empty table, seed it
      if (!error && (!data || data.length === 0)) {
        seedSupabaseIfNeeded(client);
      }
    } catch (err) {
      console.warn("Error querying location_pages from Supabase:", err);
    }
  }

  // Local fallback
  return readLocalLocations();
}

/**
 * Get a specific location page by slug
 */
export async function getLocationPage(slug: string): Promise<ExtendedLocationInfo | null> {
  const normalizedSlug = slug.toLowerCase().trim();
  const client = getSupabase();

  if (client) {
    try {
      const { data, error } = await client
        .from("location_pages")
        .select("*")
        .eq("slug", normalizedSlug)
        .maybeSingle();

      if (!error && data) {
        return transformDbRowToLocation(data);
      }

      if (error && error.code !== "PGRST116") {
        console.warn(`Supabase error for location ${normalizedSlug}:`, error.message);
      }
    } catch (err) {
      console.warn(`Error querying location ${normalizedSlug} from Supabase:`, err);
    }
  }

  // Fallback: Check local storage
  const localList = readLocalLocations();
  const foundLocal = localList.find((l) => l.slug.toLowerCase() === normalizedSlug);
  if (foundLocal) {
    return foundLocal;
  }

  // Fallback: Check default static locations
  const foundStatic = defaultLocations.find((l) => l.slug.toLowerCase() === normalizedSlug);
  if (foundStatic) {
    const fallbackItem: ExtendedLocationInfo = {
      ...foundStatic,
      status: "published",
      customStyles: {
        fontFamily: "var(--font-poppins)",
        heroTitleSize: "text-4xl lg:text-[3rem]",
        heroTitleWeight: "font-extrabold",
        accentColor: "#1f8055",
      },
    };
    // Save to local file cache
    localList.push(fallbackItem);
    saveLocalLocations(localList);
    return fallbackItem;
  }

  return null;
}

/**
 * Save or update a location page
 */
export async function saveLocationPage(
  slug: string,
  payload: Partial<ExtendedLocationInfo>,
): Promise<ExtendedLocationInfo> {
  const normalizedSlug = slug.toLowerCase().trim();
  const client = getSupabase();

  // 1. Prepare merged local state first
  const localList = readLocalLocations();
  const existingIdx = localList.findIndex((l) => l.slug.toLowerCase() === normalizedSlug);
  const existingLoc = existingIdx >= 0 ? localList[existingIdx] : null;

  const mergedLocation: ExtendedLocationInfo = {
    ...(existingLoc || (defaultLocations.find((l) => l.slug.toLowerCase() === normalizedSlug) as any) || {}),
    ...payload,
    slug: normalizedSlug,
    updatedAt: new Date().toISOString(),
  };

  // Update local file storage
  if (existingIdx >= 0) {
    localList[existingIdx] = mergedLocation;
  } else {
    localList.push(mergedLocation);
  }
  saveLocalLocations(localList);

  // 2. Persist to Supabase if client is ready
  if (client) {
    try {
      const dbRow = {
        ...transformLocationToDbRow(mergedLocation),
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await client
        .from("location_pages")
        .upsert(dbRow, { onConflict: "slug" })
        .select()
        .single();

      if (error) {
        console.error("Supabase upsert error for location_pages:", error);
      } else if (data) {
        return transformDbRowToLocation(data);
      }
    } catch (err) {
      console.error("Failed to upsert location to Supabase:", err);
    }
  }

  return mergedLocation;
}
