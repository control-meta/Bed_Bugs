/**
 * Intelligent Image Selection & Placement Engine for Blog Generation
 * 
 * Matches blog topic and keywords against the curated 82-asset local image library
 * in /images/blogs/ and selects 2 contextually relevant, distinct images:
 * - Top Image: Featured hero image placed right below title/intro
 * - Middle Image: Contextual inspection/action image placed at ~50% article midpoint
 */

export interface BlogImage {
  url: string;
  alt: string;
  caption?: string;
  role: "top" | "middle";
}

interface ImageGroup {
  keywords: string[];
  top: string;
  middle: string;
  defaultTopAlt: string;
  defaultMidAlt: string;
}

const IMAGE_GROUPS: ImageGroup[] = [
  {
    keywords: ["mattress", "dispose", "bedding", "sheets", "box spring", "frame"],
    top: "/images/blogs/mattress-with-bed-bugs.png",
    middle: "/images/blogs/mattress-with-bed-bugs-content-1.png",
    defaultTopAlt: "Inspecting bed seams and mattress piping for signs of bed bug infestation",
    defaultMidAlt: "Detailed inspection of mattress folds and wooden bed frame crevices",
  },
  {
    keywords: ["spray", "killer", "chemical", "pesticide", "aerosol", "knockdown"],
    top: "/images/blogs/best-bed-bugs-spray.png",
    middle: "/images/blogs/bug-spray-for-bed-bugs-content-1.png",
    defaultTopAlt: "Bed bug eradication spray application in hidden cracks and joints",
    defaultMidAlt: "Targeted precision spray treatment along baseboards and hiding spots",
  },
  {
    keywords: ["herbal", "natural", "home remedies", "neem", "baking soda", "diy", "remedy"],
    top: "/images/blogs/bed-bug-home-remedies.png",
    middle: "/images/blogs/bed-bug-home-remedies-content-1.png",
    defaultTopAlt: "Common home remedies and herbal solutions evaluated for bed bugs",
    defaultMidAlt: "Scientific comparison of DIY home remedies versus professional extermination",
  },
  {
    keywords: ["diatomaceous", "earth", "powder", "dust", "silica"],
    top: "/images/blogs/diatomaceous-earth-for-bed-bugs.png",
    middle: "/images/blogs/diatomaceous-earth-for-bed-bugs-content-1.png",
    defaultTopAlt: "Diatomaceous earth and desiccant dust application for bed bug control",
    defaultMidAlt: "Applying protective desiccant powder barriers around bed posts and baseboards",
  },
  {
    keywords: ["cost", "price", "charges", "rate", "affordable", "quote", "budget", "inr"],
    top: "/images/blogs/pest-control-cost-bed-bugs.png",
    middle: "/images/blogs/pest-control-cost-bed-bugs-content-1.png",
    defaultTopAlt: "Professional bed bug pest control pricing and cost factors in India",
    defaultMidAlt: "Service cost breakdown based on room count, severity, and warranty visits",
  },
  {
    keywords: ["cycle", "life cycle", "egg", "nymph", "biology", "reproduction", "stages"],
    top: "/images/blogs/bed-bug-life-cycle.png",
    middle: "/images/blogs/bed-bug-life-cycle-content-1.png",
    defaultTopAlt: "The complete biological life cycle of bed bugs from egg to adult",
    defaultMidAlt: "Bed bug nymphs molting stages and microscopic egg clusters",
  },
  {
    keywords: ["tick", "flea", "bug vs", "difference", "comparison", "similar"],
    top: "/images/blogs/bed-bug-vs-tick.png",
    middle: "/images/blogs/pics-bed-bugs-content-1.png",
    defaultTopAlt: "Visual comparison between bed bugs, ticks, and common household insects",
    defaultMidAlt: "High-magnification identification guide for Cimex lectularius versus ticks",
  },
  {
    keywords: ["book", "paper", "bookshelf", "library", "study", "spine", "binding"],
    top: "/images/blogs/signs-of-bed-bugs-in-books.png",
    middle: "/images/blogs/signs-of-bed-bugs-in-books-content-1.png",
    defaultTopAlt: "Signs of bed bugs in books, bindings, and paper shelves",
    defaultMidAlt: "Inspecting spine folds and page margins for telltale fecal stains and nymphs",
  },
  {
    keywords: ["pics", "pictures", "photos", "images", "macro", "signs", "spots", "fecal", "bites"],
    top: "/images/blogs/bed-bugs-in-bed-images.png",
    middle: "/images/blogs/pics-bed-bugs-content-1.png",
    defaultTopAlt: "Visible signs of active bed bug infestations on bed linens and frames",
    defaultMidAlt: "Close-up macro photography of adult bed bugs and shed nymph skins",
  },
  {
    keywords: ["whitefield", "it corridor", "kadugodi", "hoodi"],
    top: "/images/blogs/bed-bug-treatment-whitefield.png",
    middle: "/images/blogs/bed-bug-treatment-whitefield-content-1.png",
    defaultTopAlt: "Professional bed bug treatment services in Whitefield, Bangalore",
    defaultMidAlt: "Pest control technician treating an apartment bedroom in Whitefield",
  },
  {
    keywords: ["hsr", "hsr layout", "bommanahalli", "sarjapur"],
    top: "/images/blogs/bed-bug-treatment-hsr-layout.png",
    middle: "/images/blogs/bed-bug-treatment-hsr-layout-content-1.png",
    defaultTopAlt: "Bed bug extermination and inspection services in HSR Layout, Bangalore",
    defaultMidAlt: "Inspection and odorless odorless treatment in HSR Layout residences",
  },
  {
    keywords: ["koramangala", "dairy circle", "ejipura"],
    top: "/images/blogs/bed-bug-treatment-koramangala.png",
    middle: "/images/blogs/bed-bug-treatment-koramangala-content-1.png",
    defaultTopAlt: "Advanced bed bug eradication solutions in Koramangala, Bangalore",
    defaultMidAlt: "Bed bug treatment in apartments and PG accommodations in Koramangala",
  },
  {
    keywords: ["indiranagar", "hal", "domlur", "old airport"],
    top: "/images/blogs/bed-bug-treatment-indiranagar.png",
    middle: "/images/blogs/bed-bug-treatment-indiranagar-content-1.png",
    defaultTopAlt: "Expert bed bug treatment and prevention in Indiranagar, Bangalore",
    defaultMidAlt: "Deep steam and chemical extermination protocol in Indiranagar homes",
  },
  {
    keywords: ["dhekun", "khatmal", "khatmal marne", "dhekun spray"],
    top: "/images/blogs/dhekun-pest-control.png",
    middle: "/images/blogs/dhekun-pest-control-content-1.png",
    defaultTopAlt: "Dhekun (khatmal) pest control treatment in Indian households",
    defaultMidAlt: "Effective khatmal eradication methods for Indian furniture and beds",
  },
  {
    // General treatment / pest control fallback
    keywords: ["treatment", "pest control", "inspection", "extermination", "prevention", "eradication", "professional"],
    top: "/images/blogs/bed-bugs-pest-control.png",
    middle: "/images/blogs/bed-bugs-pest-control-content-1.png",
    defaultTopAlt: "Certified bed bug pest control treatment and home inspection in India",
    defaultMidAlt: "Pest control specialist conducting thorough crack-and-crevice bed bug eradication",
  },
];

/**
 * Intelligently select 2 distinct, context-relevant images for a given blog topic and keywords.
 */
export function selectBlogImages(
  topic: string,
  keywords: string[] = []
): { topImage: BlogImage; midImage: BlogImage } {
  const normalizedQuery = `${topic} ${keywords.join(" ")}`.toLowerCase();

  let bestGroup: ImageGroup = IMAGE_GROUPS[IMAGE_GROUPS.length - 1]; // Default to general treatment
  let maxScore = -1;

  for (const group of IMAGE_GROUPS) {
    let score = 0;
    for (const kw of group.keywords) {
      if (normalizedQuery.includes(kw.toLowerCase())) {
        score += kw.length > 5 ? 3 : 2;
      }
    }
    if (score > maxScore) {
      maxScore = score;
      bestGroup = group;
    }
  }

  const cleanTitle = topic
    .replace(/^#\s*/, "")
    .replace(/[^\w\s-]/g, "")
    .trim();

  return {
    topImage: {
      url: bestGroup.top,
      alt: `${cleanTitle} - ${bestGroup.defaultTopAlt}`,
      caption: bestGroup.defaultTopAlt,
      role: "top",
    },
    midImage: {
      url: bestGroup.middle,
      alt: `${cleanTitle} - ${bestGroup.defaultMidAlt}`,
      caption: bestGroup.defaultMidAlt,
      role: "middle",
    },
  };
}

/**
 * Injects 2 context-relevant images into the blog markdown:
 * - One at the top (right after the introductory diagnostic paragraph / H1)
 * - One in the middle (around the 40-55% midpoint between major H2 sections)
 */
export function injectBlogImages(
  markdown: string,
  topic: string,
  keywords: string[] = [],
  skipImages: boolean = false,
  customTopImage?: BlogImage | null,
  customMidImage?: BlogImage | null
): {
  markdownWithImages: string;
  topImage: BlogImage | null;
  midImage: BlogImage | null;
} {
  if (skipImages) {
    return { markdownWithImages: markdown, topImage: null, midImage: null };
  }

  let { topImage, midImage } = selectBlogImages(topic, keywords);

  if (customTopImage) topImage = customTopImage;
  if (customMidImage) midImage = customMidImage;

  // If the markdown already has these images embedded, avoid re-inserting
  if (markdown.includes(topImage.url) && markdown.includes(midImage.url)) {
    return { markdownWithImages: markdown, topImage, midImage };
  }

  let text = markdown;

  function cleanAlt(alt: string | undefined, fallback: string): string {
    if (!alt) return fallback;
    const lower = alt.toLowerCase();
    if (
      lower.includes("cast skins") ||
      lower.includes("fecal spots") ||
      lower.includes("close-up image") ||
      lower.startsWith("infographic showing") ||
      lower.startsWith("photo of")
    ) {
      return fallback;
    }
    return alt.trim();
  }

  // 1. INJECT TOP IMAGE
  // Place right after the H1 or first introductory paragraph
  if (!text.includes(topImage.url)) {
    const topAlt = cleanAlt(topImage.alt, topic.replace(/^#\s*/, "").trim());
    const topTag = `\n\n![${topAlt}](${topImage.url})\n\n`;

    // Match after # Heading and optional first paragraph
    const h1Match = text.match(/^(#[^\n]+(?:\r?\n)+)([\s\S]*?)(\n\n##|\n\n###|$)/);
    if (h1Match) {
      const h1 = h1Match[1];
      const intro = h1Match[2];
      const rest = text.slice(h1Match[0].length - (h1Match[3] ? h1Match[3].length : 0));
      text = `${h1}${intro}${topTag}${rest}`;
    } else {
      const firstDoubleNewline = text.indexOf("\n\n");
      if (firstDoubleNewline !== -1) {
        text = text.slice(0, firstDoubleNewline) + topTag + text.slice(firstDoubleNewline + 2);
      } else {
        text = topTag + text;
      }
    }
  }

  // 2. INJECT MIDDLE IMAGE
  // Locate all H2 headings ("## ") and place the middle image right before the middle section
  if (!text.includes(midImage.url)) {
    const midAlt = cleanAlt(midImage.alt, `${topic.replace(/^#\s*/, "").trim()} Guide`);
    const midTag = `\n\n![${midAlt}](${midImage.url})\n\n`;
    const h2Matches = Array.from(text.matchAll(/\n##\s+([^\n]+)/g));

    if (h2Matches.length >= 3) {
      // Pick middle H2 (e.g. 3rd of 6, or 4th of 8)
      const targetIndex = Math.floor(h2Matches.length / 2);
      const targetMatch = h2Matches[targetIndex];
      const insertPos = targetMatch.index || 0;
      text = text.slice(0, insertPos) + midTag + text.slice(insertPos);
    } else {
      const midPoint = Math.floor(text.length / 2);
      const nextParagraph = text.indexOf("\n\n", midPoint);
      if (nextParagraph !== -1) {
        text = text.slice(0, nextParagraph) + midTag + text.slice(nextParagraph + 2);
      } else {
        text = text + midTag;
      }
    }
  }

  return {
    markdownWithImages: text,
    topImage,
    midImage,
  };
}
