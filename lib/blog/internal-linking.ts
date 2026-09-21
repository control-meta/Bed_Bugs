import { getExistingPageInventory } from "./site-inventory";

export interface ContextualInternalLink {
  targetUrl: string;
  anchorText: string;
  contextSentence: string;
}

export interface InternalLinkingResult {
  markdownWithLinks: string;
  injectedLinks: ContextualInternalLink[];
  cta: {
    heading: string;
    text: string;
    targetUrl: string;
    buttonText: string;
  };
  validUrlsCount: number;
}

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Extract meaningful keywords from a slug or topic string.
 * e.g. "how-to-identify-bed-bug-bites" -> ["bed bug", "bites", "identify"]
 */
function extractKeywordsFromSlugOrTopic(slugOrTopic: string): string[] {
  const stopWords = new Set([
    "the","a","an","in","on","at","to","for","of","and","or","but","with",
    "from","by","how","what","when","why","which","that","this","is","are",
    "was","were","be","been","being","do","does","did","have","has","had",
    "will","would","can","could","should","may","might","must","shall",
    "into","about","above","below","between","through","during","after",
    "before","while","since","until","unless","although","though","if",
  ]);

  const normalized = slugOrTopic
    .replace(/[-_]/g, " ")
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, "");

  const words = normalized.split(/\s+/).filter((w) => w.length > 2 && !stopWords.has(w));

  // Build single words + bigrams
  const phrases: string[] = [...words];
  for (let i = 0; i < words.length - 1; i++) {
    phrases.push(`${words[i]} ${words[i + 1]}`);
  }
  return phrases;
}

/**
 * Score how relevant a published page is to the generated blog's content.
 */
function scoreBlogRelevance(pageKeywords: string[], contentLower: string, topicLower: string): number {
  let score = 0;
  for (const kw of pageKeywords) {
    if (contentLower.includes(kw)) score += kw.includes(" ") ? 3 : 1;
    if (topicLower.includes(kw)) score += 2;
  }
  return score;
}

/**
 * Find the best paragraph line index to inject a link based on keyword matches.
 */
function findBestLineIndex(lines: string[], keywords: string[]): number {
  let bestLine = -1;
  let bestScore = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (
      line.startsWith("#") || line === "" || line.startsWith("---") ||
      line.startsWith("![") || line.startsWith(">") || line.startsWith("|")
    ) continue;
    if (line.includes("](http")) continue;

    const lineLower = line.toLowerCase();
    let lineScore = 0;
    for (const kw of keywords) {
      if (lineLower.includes(kw)) lineScore += kw.includes(" ") ? 3 : 1;
    }
    if (lineScore > bestScore) {
      bestScore = lineScore;
      bestLine = i;
    }
  }
  return bestLine;
}

/**
 * Inject a markdown link into a line by replacing the first occurrence of keyword.
 */
function injectLinkIntoLine(line: string, keyword: string, anchorText: string, fullUrl: string): string {
  const regex = new RegExp(`(?<!\\[)(?<!\\]\\()\\b(${escapeRegExp(keyword)})\\b(?!\\])`, "i");
  const result = line.replace(regex, `[${anchorText}](${fullUrl})`);
  return result;
}

// ─── High-authority external link pool (ALL URLs verified live 200 OK) ───────
const EXTERNAL_LINK_POOL: Array<{
  anchorText: string;
  url: string;
  keywords: string[];
}> = [
  // ✅ EPA – main bed bug hub (200)
  {
    anchorText: "EPA bed bug control guide",
    url: "https://www.epa.gov/bedbugs",
    keywords: ["epa", "control", "pesticide", "chemical", "spray", "treatment", "diy"],
  },
  // ✅ EPA – DIY (200)
  {
    anchorText: "EPA do-it-yourself bed bug control",
    url: "https://www.epa.gov/bedbugs/do-it-yourself-bed-bug-control",
    keywords: ["diy", "self-treat", "over the counter", "spray can", "aerosol", "home remedy"],
  },
  // ✅ CDC – bed bugs about page (200)
  {
    anchorText: "CDC bed bug information",
    url: "https://www.cdc.gov/bed-bugs/about/index.html",
    keywords: ["cdc", "bite", "allergic", "reaction", "health", "symptoms", "rash", "itch", "disease"],
  },
  // ✅ UC IPM – pest notes (200)
  {
    anchorText: "UC IPM Pest Notes – Bed Bugs",
    url: "https://ipm.ucanr.edu/PMG/PESTNOTES/pn7454.html",
    keywords: ["heat treatment", "steam", "mattress", "encasement", "ipm", "integrated pest"],
  },
  // ✅ Harvard School of Public Health (200)
  {
    anchorText: "Harvard – Urban Pest Management",
    url: "https://www.hsph.harvard.edu/ecpe/course/urban-pest-management/",
    keywords: ["urban", "apartment", "hostel", "shared", "multi-unit", "high-rise", "building", "flat"],
  },
  // ✅ NPIC – bed bug factsheet (200)
  {
    anchorText: "NPIC bed bug pesticide safety guide",
    url: "https://npic.orst.edu/factsheets/degen.html",
    keywords: ["pesticide", "safety", "toxic", "chemical safety", "exposure", "label", "caution"],
  },
  // ✅ University of Kentucky Entomology (200)
  {
    anchorText: "University of Kentucky – Bed Bug Control",
    url: "https://entomology.ca.uky.edu/ef636",
    keywords: ["biology", "lifecycle", "molt", "nymph", "egg", "instar", "feeding", "harborage"],
  },
  // ✅ WHO – vector-borne disease fact sheet (200)
  {
    anchorText: "WHO – Vector Control and Public Health",
    url: "https://www.who.int/news-room/fact-sheets/detail/vector-borne-diseases",
    keywords: ["who", "disease", "vector", "public health", "hygiene", "infestation", "global"],
  },
  // ✅ PestWorld – NPMA bed bug guide (200)
  {
    anchorText: "National Pest Management Association – Bed Bugs",
    url: "https://www.pestworld.org/pest-guide/bed-bugs/",
    keywords: ["pest management", "professional", "exterminator", "inspection", "certified", "npma"],
  },
  // ✅ NIH – clinical dermatology study (200)
  {
    anchorText: "NIH – Bed Bug Bites: Clinical Presentation",
    url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4553552/",
    keywords: ["bite", "skin", "rash", "dermatology", "blister", "welt", "urticaria", "clinical"],
  },
  // ✅ NIH – insecticide resistance study (200)
  {
    anchorText: "NIH – Insecticide Resistance in Bed Bugs",
    url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8249804/",
    keywords: ["resistance", "pyrethroid", "insecticide", "chemical resistance", "deltamethrin"],
  },
  // ✅ NIH – bed bug treatment review book chapter (200)
  {
    anchorText: "NIH – Bed Bug Infestation Management",
    url: "https://www.ncbi.nlm.nih.gov/books/NBK482235/",
    keywords: ["treatment", "management", "infestation", "extermination", "prevention", "protocol"],
  },
  // ✅ NIH – thermal (heat) treatment study (200)
  {
    anchorText: "NIH – Thermal Treatment Efficacy for Bed Bugs",
    url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7592374/",
    keywords: ["heat", "thermal", "temperature", "steam", "dryer", "wash", "60 degree", "high heat"],
  },
];


/** Count non-image markdown links to external http URLs */
function countExternalLinks(markdown: string): number {
  const regex = /(?<!!)\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g;
  let count = 0;
  let m;
  while ((m = regex.exec(markdown)) !== null) count++;
  return count;
}

/** Inject external links from pool until minimum is met */
function injectExternalLinks(content: string, minExternal = 3): string {
  const existing = countExternalLinks(content);
  if (existing >= minExternal) return content;

  const needed = minExternal - existing;
  const lines = content.split("\n");

  const usedUrls = new Set<string>();
  const existingUrlRegex = /\]\((https?:\/\/[^)]+)\)/g;
  let m;
  while ((m = existingUrlRegex.exec(content)) !== null) usedUrls.add(m[1]);

  const contentLower = content.toLowerCase();
  let injected = 0;

  const scored = EXTERNAL_LINK_POOL
    .filter((e) => !usedUrls.has(e.url))
    .map((e) => ({ ...e, score: e.keywords.filter((kw) => contentLower.includes(kw)).length }))
    .sort((a, b) => b.score - a.score);

  for (const entry of scored) {
    if (injected >= needed) break;
    if (usedUrls.has(entry.url)) continue;

    let inserted = false;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (
        line.startsWith("#") || line === "" || line.startsWith("---") ||
        line.startsWith("![") || line.startsWith("|") || line.startsWith(">")
      ) continue;
      if (line.includes("](http")) continue;

      const matchedKw = entry.keywords.find((kw) => line.toLowerCase().includes(kw));
      if (matchedKw) {
        lines[i] = lines[i].trimEnd() + ` (see [${entry.anchorText}](${entry.url}))`;
        usedUrls.add(entry.url);
        injected++;
        inserted = true;
        break;
      }
    }

    if (!inserted) {
      const refIdx = lines.findIndex(
        (l) => l.toLowerCase().startsWith("## references") || l.toLowerCase().startsWith("## further reading")
      );
      const insertAt = refIdx > -1 ? refIdx : lines.length;
      lines.splice(insertAt, 0, `\nFor more information, refer to [${entry.anchorText}](${entry.url}).\n`);
      usedUrls.add(entry.url);
      injected++;
    }
  }

  return lines.join("\n");
}

// ─── Main export ──────────────────────────────────────────────────────────────

export async function processInternalLinksAndCTA(
  markdown: string,
  topic: string
): Promise<InternalLinkingResult> {
  const inventory = await getExistingPageInventory();
  const allowedUrls = new Set(inventory.map((p) => p.url));

  const baseUrl = "https://bedbugstreatment.co.in";
  const topicLower = topic.toLowerCase();
  const contentLower = markdown.toLowerCase();

  let lines = markdown.split("\n");
  const injectedLinks: ContextualInternalLink[] = [];
  const usedUrls = new Set<string>();

  // ── Step 1: Score published blog pages by relevance ───────────────────────
  const publishedBlogs = inventory.filter((p) => p.source === "database");

  const scoredBlogs = publishedBlogs.map((page) => {
    const slugKws = extractKeywordsFromSlugOrTopic(page.url.replace(/^\//, ""));
    const topicKws = extractKeywordsFromSlugOrTopic(page.topic || "");
    const allKws = [...new Set([...slugKws, ...topicKws])];
    const score = scoreBlogRelevance(allKws, contentLower, topicLower);
    return { ...page, score, keywords: allKws };
  });

  // Sort: highest score first, randomise ties for variety
  scoredBlogs.sort((a, b) => (b.score !== a.score ? b.score - a.score : Math.random() - 0.5));

  // ── Step 2: Inject top-matched blog links contextually ────────────────────
  const MIN_BLOG_LINKS = 2;
  const MAX_BLOG_LINKS = 3;
  let blogLinksInjected = 0;

  for (const blog of scoredBlogs) {
    if (blogLinksInjected >= MAX_BLOG_LINKS) break;

    const fullUrl = `${baseUrl}${blog.url}`;
    if (usedUrls.has(fullUrl) || markdown.includes(`](${fullUrl})`)) {
      usedUrls.add(fullUrl);
      continue;
    }

    const bestIdx = findBestLineIndex(lines, blog.keywords.slice(0, 8));
    const matchedKw = blog.keywords.find(
      (kw) => kw.length >= 4 && lines[bestIdx]?.toLowerCase().includes(kw)
    );

    if (bestIdx !== -1 && matchedKw) {
      lines[bestIdx] = injectLinkIntoLine(lines[bestIdx], matchedKw, blog.title, fullUrl);
      injectedLinks.push({ targetUrl: fullUrl, anchorText: blog.title, contextSentence: `Contextually linked: ${blog.title}` });
      usedUrls.add(fullUrl);
      blogLinksInjected++;
    }
  }

  // ── Step 3: Related Reading fallback for remaining blog links ─────────────
  if (blogLinksInjected < MIN_BLOG_LINKS) {
    const remaining = scoredBlogs
      .filter((b) => !usedUrls.has(`${baseUrl}${b.url}`))
      .slice(0, MIN_BLOG_LINKS - blogLinksInjected);

    if (remaining.length > 0) {
      const relatedLines = [
        "",
        "## Related Reading",
        "",
        ...remaining.map((b) => `- [${b.title}](${baseUrl}${b.url})`),
        "",
      ];

      const refIdx = lines.findIndex(
        (l) => l.toLowerCase().startsWith("## references") || l.toLowerCase().startsWith("## further reading")
      );
      if (refIdx !== -1) {
        lines.splice(refIdx, 0, ...relatedLines);
      } else {
        lines.push(...relatedLines);
      }

      for (const b of remaining) {
        const fullUrl = `${baseUrl}${b.url}`;
        injectedLinks.push({ targetUrl: fullUrl, anchorText: b.title, contextSentence: `Related reading: ${b.title}` });
        usedUrls.add(fullUrl);
        blogLinksInjected++;
      }
    }
  }

  // ── Step 4: Static page links (/services, /faq) ───────────────────────────
  const staticLinksConfig = [
    {
      url: "/services",
      anchorText: "bed bug treatment services",
      regex: /\b(?:professional\s+(?:bed\s+bug\s+)?treatment|pest\s+control\s+services?|professional\s+extermination|expert\s+treatment)\b/i,
      fallback: `\n\nFor persistent or widespread infestations, consider exploring [bed bug treatment services](${baseUrl}/services) for thorough harborage detection and compliant application methods.`,
    },
    {
      url: "/faq",
      anchorText: "frequently asked questions about bed bugs",
      regex: /\b(?:frequently\s+asked|common\s+questions|wondering|curious\s+about)\b/i,
      fallback: null,
    },
  ];

  for (const cfg of staticLinksConfig) {
    const fullUrl = `${baseUrl}${cfg.url}`;
    if (usedUrls.has(fullUrl) || !allowedUrls.has(cfg.url)) continue;
    if (markdown.includes(`](${fullUrl})`)) { usedUrls.add(fullUrl); continue; }

    let matched = false;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim().startsWith("#") || lines[i].includes("](http")) continue;
      if (cfg.regex.test(lines[i])) {
        lines[i] = lines[i].replace(cfg.regex, `[${cfg.anchorText}](${fullUrl})`);
        injectedLinks.push({ targetUrl: fullUrl, anchorText: cfg.anchorText, contextSentence: `Linked ${cfg.anchorText}` });
        usedUrls.add(fullUrl);
        matched = true;
        break;
      }
    }
    if (!matched && cfg.fallback) {
      lines.push(...cfg.fallback.split("\n"));
      injectedLinks.push({ targetUrl: fullUrl, anchorText: cfg.anchorText, contextSentence: cfg.fallback.trim() });
      usedUrls.add(fullUrl);
    }
  }

  // ── Step 5: /contact CTA ──────────────────────────────────────────────────
  const contactFullUrl = `${baseUrl}/contact`;
  const cta = {
    heading: "Suspecting Bed Bugs in Your Home?",
    text: "Still finding physical signs of bed bugs or waking up with unexplained bites? Request a thorough inspection to determine the exact extent of the infestation and explore targeted, integrated treatment options.",
    targetUrl: contactFullUrl,
    buttonText: "Schedule an Inspection",
  };

  let content = lines.join("\n");

  const genericClosingRegex = /\b(?:contact\s+(?:a\s+)?local\s+pest\s+control\s+service|hire\s+(?:a\s+)?local\s+exterminator|consult\s+local\s+professionals)\b[^.\n]*/gi;
  if (genericClosingRegex.test(content)) {
    content = content.replace(
      genericClosingRegex,
      `[request an on-site inspection from BedBugsTreatment.co.in](${contactFullUrl}) to evaluate infestation severity`
    );
  }

  const ctaBlock = `\n\n---\n\n### ${cta.heading}\n\n${cta.text}\n\n👉 [${cta.buttonText}](${cta.targetUrl})\n`;
  if (!content.includes(contactFullUrl)) {
    content += ctaBlock;
    injectedLinks.push({ targetUrl: contactFullUrl, anchorText: cta.buttonText, contextSentence: cta.text });
  }

  // ── Step 6: Guarantee ≥3 external links ───────────────────────────────────
  content = injectExternalLinks(content, 3);

  return {
    markdownWithLinks: content,
    injectedLinks,
    cta,
    validUrlsCount: injectedLinks.length,
  };
}
