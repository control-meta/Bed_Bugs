import fs from "fs";
import path from "path";
import { getSupabase } from "./supabase";
import { locations } from "./locations";

export interface PageSeoItem {
  path: string; // e.g. "/", "/about", "/services", "/pune"
  pageName: string; // e.g. "Home Page", "About Us", "Pune Location Page"
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  canonical?: string;
  updatedAt?: string;
}

export interface ImageSeoItem {
  id: string; // src path normalized as ID
  src: string; // e.g. "/images/hero.webp"
  altText: string;
  locationHint: string; // e.g. "Homepage Hero", "Pune Location Card"
  pages?: string[];
  updatedAt?: string;
}

interface SeoStoreFile {
  pages: Record<string, PageSeoItem>;
  images: Record<string, ImageSeoItem>;
}

const LOCAL_SEO_PATH = path.join(process.cwd(), ".local_seo_metadata.json");

// Default initial pages seed
function getDefaultPagesSeed(): Record<string, PageSeoItem> {
  const seed: Record<string, PageSeoItem> = {
    "/": {
      path: "/",
      pageName: "Home Page",
      title: "Bed Bug Treatment & Pest Control Services in India | 100% Odorless",
      description:
        "Professional odorless bed bug treatment for homes & hotels across India. Same-day inspection, safe methods & 12-month warranty. Call +91 97693 21234.",
      keywords: ["bed bug treatment", "bed bug control", "pest control india", "odorless bed bug treatment"],
      ogImage: "/images/og-share.jpg",
      canonical: "https://bedbugstreatment.co.in/",
      updatedAt: new Date().toISOString(),
    },
    "/about": {
      path: "/about",
      pageName: "About Us",
      title: "About Us | Certified Bed Bug Treatment Specialists Across India",
      description:
        "India's trusted bed bug control specialists. Learn about our mission and the certified team behind 50,000+ bug-free homes in Pune, Mumbai & Bangalore.",
      keywords: ["about bed bug treatment", "certified pest control specialists", "eco-friendly pest control"],
      ogImage: "/images/our-story.jpg",
      canonical: "https://bedbugstreatment.co.in/about",
      updatedAt: new Date().toISOString(),
    },
    "/services": {
      path: "/services",
      pageName: "Services",
      title: "Bed Bug Pest Control Services | Chemical & Odorless Treatment",
      description:
        "Comprehensive bed bug elimination services: odorless treatment, targeted spray, AMC contracts, and eco-friendly solutions with 12-month warranty.",
      keywords: ["bed bug pest control", "chemical bed bug treatment", "bed bug amc contract"],
      ogImage: "/images/hero-tech-bed.webp",
      canonical: "https://bedbugstreatment.co.in/services",
      updatedAt: new Date().toISOString(),
    },
    "/contact": {
      path: "/contact",
      pageName: "Contact Us",
      title: "Contact Us | Book Bed Bug Pest Control & Free Inspection",
      description:
        "Book your same-day bed bug inspection. Call +91 97693 21234, chat on WhatsApp or request a quote for fast service in Pune, Mumbai, Bangalore & Delhi.",
      keywords: ["contact pest control", "book bed bug inspection", "pest control customer support"],
      ogImage: "/images/og-share.jpg",
      canonical: "https://bedbugstreatment.co.in/contact",
      updatedAt: new Date().toISOString(),
    },
    "/faq": {
      path: "/faq",
      pageName: "Frequently Asked Questions",
      title: "Bed Bug Treatment FAQs | Expert Solutions, Preparation & Pricing",
      description:
        "Find answers to common bed bug questions: treatment cost, safety, preparation and 12-month warranty. For immediate expert help, call +91 97693 21234.",
      keywords: ["bed bug faq", "bed bug treatment cost", "is bed bug spray safe"],
      ogImage: "/images/bedbug-closeup.jpg",
      canonical: "https://bedbugstreatment.co.in/faq",
      updatedAt: new Date().toISOString(),
    },
    "/blog": {
      path: "/blog",
      pageName: "Blog & Guides",
      title: "Bed Bug Eradication Guides, Signs & Prevention Tips | Blog",
      description:
        "Expert guides, DIY identification, prevention tips, and scientific insights on bed bug eradication and home pest protection.",
      keywords: ["bed bug blog", "how to identify bed bugs", "bed bug prevention tips"],
      ogImage: "/images/bedbug.png",
      canonical: "https://bedbugstreatment.co.in/blog",
      updatedAt: new Date().toISOString(),
    },
  };

  // Seed all location pages
  for (const loc of locations) {
    const p = `/${loc.slug}`;
    seed[p] = {
      path: p,
      pageName: `${loc.name}, ${loc.state} Location Page`,
      title: loc.title || `Bed Bug Treatment in ${loc.name} | Same-Day Service & Warranty`,
      description:
        loc.metaDescription ||
        `Bed bug treatment in ${loc.name}. 100% odorless & pet-safe solutions. Free same-day inspection with 12-month warranty.`,
      keywords: loc.keywords || [`bed bug treatment ${loc.name.toLowerCase()}`],
      ogImage: loc.image || `/images/cities/${loc.slug}.jpg`,
      canonical: `https://bedbugstreatment.co.in/${loc.slug}`,
      updatedAt: new Date().toISOString(),
    };
  }

  return seed;
}

// Default initial image registry seed
function getDefaultImagesSeed(): Record<string, ImageSeoItem> {
  const defaults: Omit<ImageSeoItem, "id" | "updatedAt">[] = [
    {
      src: "/images/hero.webp",
      altText: "Certified pest control technician treating bed bugs in home bedroom",
      locationHint: "Homepage Hero Section Banner",
      pages: ["/"],
    },
    {
      src: "/images/hero-tech-bed.webp",
      altText: "Specialist technician carefully inspecting mattress seams for bed bugs",
      locationHint: "Services Page Hero Banner",
      pages: ["/services"],
    },
    {
      src: "/images/bedbug-closeup.jpg",
      altText: "Macro close-up photograph of adult bed bug on fabric",
      locationHint: "FAQ Page & Identification Section",
      pages: ["/faq", "/blog"],
    },
    {
      src: "/images/bedbug.png",
      altText: "High-resolution macro view of bed bug showing anatomy and coloration",
      locationHint: "Treatment Options & Identification Card",
      pages: ["/", "/about", "/blog"],
    },
    {
      src: "/images/real-bedbug-macro.png",
      altText: "Detailed microscopic inspection view of bed bug pest",
      locationHint: "Scientific Bed Bug Information Section",
      pages: ["/blog"],
    },
    {
      src: "/images/why-choose-us.webp",
      altText: "Professional pest control team with modern odorless spraying equipment",
      locationHint: "Why Choose Us Section",
      pages: ["/", "/about"],
    },
    {
      src: "/images/our-story.jpg",
      altText: "Bed bug treatment founders and customer support facility",
      locationHint: "About Us Company Story Card",
      pages: ["/about"],
    },
    {
      src: "/images/treatment-1.png",
      altText: "Comprehensive chemical spray treatment with odorless chemicals",
      locationHint: "Treatment Method Card 1 (Chemical Spray)",
      pages: ["/", "/services"],
    },
    {
      src: "/images/treatment-2.png",
      altText: "Eco-friendly organic herbal bed bug extermination method",
      locationHint: "Treatment Method Card 2 (Organic/Eco)",
      pages: ["/", "/services"],
    },
    {
      src: "/images/treatment-3.png",
      altText: "Targeted advanced treatment eliminating bed bugs at all life stages",
      locationHint: "Treatment Method Card 3",
      pages: ["/", "/services"],
    },
    {
      src: "/images/logo.jpg",
      altText: "BedBug Treatment India - Official Pest Control Brand Logo",
      locationHint: "Header Brand Logo & Trust Badges",
      pages: ["*"],
    },
    // Cities
    {
      src: "/images/cities/pune.jpg",
      altText: "Pune skyline and local bed bug pest control service area",
      locationHint: "Pune City Page Hero & Hub Card",
      pages: ["/pune", "/"],
    },
    {
      src: "/images/cities/mumbai.jpg",
      altText: "Mumbai city landmarks covered by same-day bed bug treatment",
      locationHint: "Mumbai City Page Hero & Hub Card",
      pages: ["/mumbai", "/"],
    },
    {
      src: "/images/cities/bangalore.jpg",
      altText: "Bangalore tech corridor residential bed bug treatment service",
      locationHint: "Bangalore City Page Hero & Hub Card",
      pages: ["/bangalore", "/"],
    },
    {
      src: "/images/cities/delhi.jpg",
      altText: "Delhi NCR licensed bed bug extermination branch",
      locationHint: "Delhi City Page Hero & Hub Card",
      pages: ["/delhi", "/"],
    },
    {
      src: "/images/cities/noida.jpg",
      altText: "Noida residential high-rise bed bug control service",
      locationHint: "Noida City Page Hero & Hub Card",
      pages: ["/noida", "/"],
    },
    // Services
    {
      src: "/images/services/service-inspection.jpg",
      altText: "Thorough visual bed bug inspection with specialized UV detection lights",
      locationHint: "Inspection Service Card",
      pages: ["/services"],
    },
    {
      src: "/images/services/service-deep-treatment.jpg",
      altText: "Intensive targeted eradication treatment destroying bed bug eggs",
      locationHint: "Intensive Treatment Service Card",
      pages: ["/services"],
    },
    {
      src: "/images/services/service-crevice.jpg",
      altText: "Deep crevice and baseboard crack injection bed bug treatment",
      locationHint: "Deep Crevice Treatment Card",
      pages: ["/services"],
    },
    {
      src: "/images/services/service-spray.jpg",
      altText: "Advanced misting spray targeting concealed bed bugs",
      locationHint: "Residual Spraying Card",
      pages: ["/services"],
    },
    {
      src: "/images/services/service-eco.jpg",
      altText: "Pet-safe child-safe eco-friendly organic bed bug formula",
      locationHint: "Eco-Friendly Safe Treatment Card",
      pages: ["/services"],
    },
    {
      src: "/images/services/service-warranty.jpg",
      altText: "12-month service warranty certificate and guarantee badge",
      locationHint: "Service Warranty Card",
      pages: ["/services", "/"],
    },
    {
      src: "/images/services/fully-equipped.jpg",
      altText: "Fully equipped mobile pest control van ready for same-day dispatch",
      locationHint: "Technician Equipment Showcase",
      pages: ["/services", "/about"],
    },
    // React Services WebP
    {
      src: "/images/services-react/amc-hd.webp",
      altText: "Annual Maintenance Contract AMC for complete year-round bed bug protection",
      locationHint: "AMC Service Plan Card",
      pages: ["/services"],
    },
    {
      src: "/images/services-react/bed-treatment-hd.webp",
      altText: "Targeted mattress and bed frame steam sanitization treatment",
      locationHint: "Bed Frame Sanitization Card",
      pages: ["/services"],
    },
    {
      src: "/images/services-react/cta-bedroom-hd.webp",
      altText: "Clean peaceful bedroom free from bed bug bites and infestations",
      locationHint: "Bottom CTA Bedroom Banner",
      pages: ["/services", "/"],
    },
    {
      src: "/images/services-react/homes-hd.webp",
      altText: "Residential apartment and villa bed bug treatment package",
      locationHint: "Home Pest Control Package Card",
      pages: ["/services"],
    },
    {
      src: "/images/services-react/hotels-hd.webp",
      altText: "Hotel and hospitality discreet bed bug eradication protocol",
      locationHint: "Hospitality Industry Card",
      pages: ["/services"],
    },
    {
      src: "/images/services-react/hostels-hd.webp",
      altText: "Hostel and PG dormitory large-scale bed bug extermination",
      locationHint: "Student Hostels & PG Card",
      pages: ["/services"],
    },
    {
      src: "/images/services-react/offices-hd.webp",
      altText: "Commercial office chairs and couch upholstery bed bug treatment",
      locationHint: "Commercial Offices Card",
      pages: ["/services"],
    },
    {
      src: "/images/services-react/rentals-hd.webp",
      altText: "Move-in move-out tenant rental home bed bug clearance certificate",
      locationHint: "Rental Properties Card",
      pages: ["/services"],
    },
    {
      src: "/images/services-react/one-time-hd.webp",
      altText: "One-time intensive emergency bed bug knockdown service",
      locationHint: "One-Time Emergency Service Card",
      pages: ["/services"],
    },
  ];

  const map: Record<string, ImageSeoItem> = {};
  for (const item of defaults) {
    map[item.src] = {
      ...item,
      id: item.src,
      updatedAt: new Date().toISOString(),
    };
  }
  return map;
}

// Read local JSON file store
function readLocalSeoStore(): SeoStoreFile {
  try {
    if (fs.existsSync(LOCAL_SEO_PATH)) {
      const content = fs.readFileSync(LOCAL_SEO_PATH, "utf8");
      if (content.trim()) {
        const parsed = JSON.parse(content);
        if (parsed && typeof parsed === "object") {
          return {
            pages: parsed.pages || getDefaultPagesSeed(),
            images: parsed.images || getDefaultImagesSeed(),
          };
        }
      }
    }
  } catch (err) {
    console.error("Failed to read local SEO metadata store:", err);
  }

  const initialSeed: SeoStoreFile = {
    pages: getDefaultPagesSeed(),
    images: getDefaultImagesSeed(),
  };
  saveLocalSeoStore(initialSeed);
  return initialSeed;
}

// Save local JSON file store
function saveLocalSeoStore(data: SeoStoreFile): void {
  try {
    fs.writeFileSync(LOCAL_SEO_PATH, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.error("Failed to save local SEO metadata store:", err);
  }
}

// ============================================================================
// 1. PAGE SEO METHODS
// ============================================================================

export async function getAllPagesSeo(): Promise<{ pages: PageSeoItem[]; isSupabase: boolean }> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("page_seo")
        .select("*")
        .order("path", { ascending: true });

      if (!error && data && data.length > 0) {
        const pages: PageSeoItem[] = data.map((row) => ({
          path: row.path,
          pageName: row.page_name || row.path,
          title: row.title,
          description: row.description,
          keywords: Array.isArray(row.keywords) ? row.keywords : [],
          ogImage: row.og_image,
          canonical: row.canonical,
          updatedAt: row.updated_at,
        }));
        return { pages, isSupabase: true };
      }
    } catch (err) {
      console.warn("Supabase page_seo table query failed, using local store:", err);
    }
  }

  const local = readLocalSeoStore();
  const pagesList = Object.values(local.pages);
  return { pages: pagesList, isSupabase: false };
}

export async function getPageSeo(pagePath: string): Promise<PageSeoItem> {
  const normalizedPath = pagePath.startsWith("/") ? pagePath : `/${pagePath}`;
  const supabase = getSupabase();

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("page_seo")
        .select("*")
        .eq("path", normalizedPath)
        .single();

      if (!error && data) {
        return {
          path: data.path,
          pageName: data.page_name || data.path,
          title: data.title,
          description: data.description,
          keywords: Array.isArray(data.keywords) ? data.keywords : [],
          ogImage: data.og_image,
          canonical: data.canonical,
          updatedAt: data.updated_at,
        };
      }
    } catch (err) {
      // Fallback
    }
  }

  const local = readLocalSeoStore();
  if (local.pages[normalizedPath]) {
    return local.pages[normalizedPath];
  }

  // If path is a city page like /pune, check locations
  const slug = normalizedPath.replace(/^\//, "");
  const loc = locations.find((l) => l.slug === slug);
  if (loc) {
    return {
      path: normalizedPath,
      pageName: `${loc.name}, ${loc.state} Location Page`,
      title: loc.title || `Bed Bug Treatment in ${loc.name}`,
      description: loc.metaDescription || `Professional bed bug treatment in ${loc.name}.`,
      keywords: loc.keywords,
      ogImage: loc.image,
      canonical: `https://bedbugstreatment.co.in/${loc.slug}`,
      updatedAt: new Date().toISOString(),
    };
  }

  // General default fallback
  return {
    path: normalizedPath,
    pageName: normalizedPath,
    title: "Bed Bug Treatment & Pest Control Services in India",
    description:
      "Professional odorless bed bug treatment for homes & hotels across India. Same-day service & 12-month warranty.",
    updatedAt: new Date().toISOString(),
  };
}

export async function savePageSeo(item: PageSeoItem): Promise<{ page: PageSeoItem; isSupabase: boolean }> {
  const normalizedPath = item.path.startsWith("/") ? item.path : `/${item.path}`;
  const pageRecord: PageSeoItem = {
    ...item,
    path: normalizedPath,
    updatedAt: new Date().toISOString(),
  };

  let savedInSupabase = false;
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { error } = await supabase.from("page_seo").upsert(
        {
          path: pageRecord.path,
          page_name: pageRecord.pageName,
          title: pageRecord.title,
          description: pageRecord.description,
          keywords: pageRecord.keywords || [],
          og_image: pageRecord.ogImage,
          canonical: pageRecord.canonical,
          updated_at: pageRecord.updatedAt,
        },
        { onConflict: "path" },
      );
      if (!error) {
        savedInSupabase = true;
      } else {
        console.warn("Supabase page_seo upsert warning:", error);
      }
    } catch (err) {
      console.warn("Supabase page_seo upsert failed:", err);
    }
  }

  // Always keep local store in sync
  const local = readLocalSeoStore();
  local.pages[normalizedPath] = pageRecord;
  saveLocalSeoStore(local);

  return { page: pageRecord, isSupabase: savedInSupabase };
}

// ============================================================================
// 2. IMAGE ALT TEXT METHODS
// ============================================================================

export async function getAllImagesSeo(): Promise<{ images: ImageSeoItem[]; isSupabase: boolean }> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("image_seo")
        .select("*")
        .order("src", { ascending: true });

      if (!error && data && data.length > 0) {
        const images: ImageSeoItem[] = data.map((row) => ({
          id: row.src,
          src: row.src,
          altText: row.alt_text,
          locationHint: row.location_hint || "Website Image",
          pages: Array.isArray(row.pages) ? row.pages : [],
          updatedAt: row.updated_at,
        }));
        return { images, isSupabase: true };
      }
    } catch (err) {
      console.warn("Supabase image_seo table query failed, using local store:", err);
    }
  }

  const local = readLocalSeoStore();
  const imagesList = Object.values(local.images);
  return { images: imagesList, isSupabase: false };
}

export async function getImageSeo(src: string): Promise<ImageSeoItem | null> {
  const normalizedSrc = src.startsWith("/") ? src : `/${src}`;
  const supabase = getSupabase();

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("image_seo")
        .select("*")
        .eq("src", normalizedSrc)
        .single();

      if (!error && data) {
        return {
          id: data.src,
          src: data.src,
          altText: data.alt_text,
          locationHint: data.location_hint,
          pages: Array.isArray(data.pages) ? data.pages : [],
          updatedAt: data.updated_at,
        };
      }
    } catch (err) {
      // Fallback
    }
  }

  const local = readLocalSeoStore();
  return local.images[normalizedSrc] || null;
}

export async function getImageAlt(src: string, fallbackAlt?: string): Promise<string> {
  const item = await getImageSeo(src);
  if (item && item.altText) {
    return item.altText;
  }
  return fallbackAlt || "Bed bug treatment and pest control";
}

export async function getAllImageAltMap(): Promise<Record<string, string>> {
  const res = await getAllImagesSeo();
  const map: Record<string, string> = {};
  for (const img of res.images) {
    if (img.src && img.altText) {
      map[img.src] = img.altText;
    }
  }
  return map;
}

export async function saveImageSeo(item: ImageSeoItem): Promise<{ image: ImageSeoItem; isSupabase: boolean }> {
  const normalizedSrc = item.src.startsWith("/") ? item.src : `/${item.src}`;
  const imageRecord: ImageSeoItem = {
    ...item,
    id: normalizedSrc,
    src: normalizedSrc,
    updatedAt: new Date().toISOString(),
  };

  let savedInSupabase = false;
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { error } = await supabase.from("image_seo").upsert(
        {
          src: imageRecord.src,
          alt_text: imageRecord.altText,
          location_hint: imageRecord.locationHint,
          pages: imageRecord.pages || [],
          updated_at: imageRecord.updatedAt,
        },
        { onConflict: "src" },
      );
      if (!error) {
        savedInSupabase = true;
      }
    } catch (err) {
      console.warn("Supabase image_seo upsert failed:", err);
    }
  }

  const local = readLocalSeoStore();
  local.images[normalizedSrc] = imageRecord;
  saveLocalSeoStore(local);

  return { image: imageRecord, isSupabase: savedInSupabase };
}

export async function bulkSaveImagesSeo(items: ImageSeoItem[]): Promise<{ count: number; isSupabase: boolean }> {
  let savedInSupabase = false;
  const now = new Date().toISOString();
  const local = readLocalSeoStore();

  const formattedItems = items.map((item) => {
    const normalizedSrc = item.src.startsWith("/") ? item.src : `/${item.src}`;
    return {
      ...item,
      id: normalizedSrc,
      src: normalizedSrc,
      updatedAt: now,
    };
  });

  const supabase = getSupabase();
  if (supabase && formattedItems.length > 0) {
    try {
      const rows = formattedItems.map((img) => ({
        src: img.src,
        alt_text: img.altText,
        location_hint: img.locationHint,
        pages: img.pages || [],
        updated_at: img.updatedAt,
      }));
      const { error } = await supabase.from("image_seo").upsert(rows, { onConflict: "src" });
      if (!error) savedInSupabase = true;
    } catch (err) {
      console.warn("Supabase bulk image_seo upsert failed:", err);
    }
  }

  for (const img of formattedItems) {
    local.images[img.src] = img;
  }
  saveLocalSeoStore(local);

  return { count: formattedItems.length, isSupabase: savedInSupabase };
}

// Scans public/images folder recursively and syncs with registry
export async function scanAndSyncImages(): Promise<{ added: number; total: number }> {
  const imagesDir = path.join(process.cwd(), "public", "images");
  const local = readLocalSeoStore();
  let addedCount = 0;

  function scanFolder(currentDir: string, relativePrefix: string) {
    if (!fs.existsSync(currentDir)) return;
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isDirectory()) {
        scanFolder(path.join(currentDir, entry.name), `${relativePrefix}/${entry.name}`);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if ([".jpg", ".jpeg", ".png", ".webp", ".svg", ".avif"].includes(ext)) {
          const webPath = `${relativePrefix}/${entry.name}`;
          if (!local.images[webPath]) {
            // Generate clean readable default alt text from filename
            const baseName = path.basename(entry.name, ext).replace(/[-_]+/g, " ");
            const readableAlt = `${baseName.charAt(0).toUpperCase() + baseName.slice(1)} - Bed Bug Pest Control`;

            let hint = "General Website Image";
            if (webPath.includes("/cities/")) hint = "City Location Card Image";
            else if (webPath.includes("/services/")) hint = "Service Detail Image";
            else if (webPath.includes("/services-react/")) hint = "Interactive Service Package Card";

            local.images[webPath] = {
              id: webPath,
              src: webPath,
              altText: readableAlt,
              locationHint: hint,
              pages: webPath.includes("/cities/") ? [webPath.replace("/images/cities/", "/").replace(/\.[^.]+$/, "")] : ["/services"],
              updatedAt: new Date().toISOString(),
            };
            addedCount++;
          }
        }
      }
    }
  }

  scanFolder(imagesDir, "/images");

  if (addedCount > 0) {
    saveLocalSeoStore(local);
  }

  return { added: addedCount, total: Object.keys(local.images).length };
}
