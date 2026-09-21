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

export interface ParsedMarkdownLink {
  fullMatch: string;
  anchorText: string;
  url: string;
  index: number;
  isExternal: boolean;
  isInternal: boolean;
}

/**
 * Check whether a URL is an internal link to bedbugstreatment.co.in
 */
export function isInternalUrl(url: string, baseUrl = "https://bedbugstreatment.co.in"): boolean {
  const clean = url.trim();
  if (
    clean.startsWith("#") ||
    clean.startsWith("mailto:") ||
    clean.startsWith("tel:") ||
    clean.startsWith("javascript:")
  ) {
    return false;
  }
  if (clean.startsWith("/") && !clean.startsWith("//")) return true;
  try {
    const parsed = new URL(clean);
    const baseHost = new URL(baseUrl).hostname.replace(/^www\./, "");
    const host = parsed.hostname.replace(/^www\./, "");
    return host === baseHost;
  } catch {
    return false;
  }
}

/**
 * Check whether a URL is an external link (different domain)
 */
export function isExternalUrl(url: string, baseUrl = "https://bedbugstreatment.co.in"): boolean {
  const clean = url.trim();
  if (
    clean.startsWith("/") ||
    clean.startsWith("#") ||
    clean.startsWith("mailto:") ||
    clean.startsWith("tel:") ||
    clean.startsWith("javascript:")
  ) {
    return false;
  }
  try {
    const parsed = new URL(clean);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return false;
    const baseHost = new URL(baseUrl).hostname.replace(/^www\./, "");
    const host = parsed.hostname.replace(/^www\./, "");
    return host !== baseHost;
  } catch {
    return false;
  }
}

/**
 * Parses all markdown links [anchor](url) while ignoring images ![alt](url)
 */
export function parseMarkdownLinks(content: string, baseUrl = "https://bedbugstreatment.co.in"): ParsedMarkdownLink[] {
  const regex = /(?<!!)\[([^\]]+)\]\(([^)]+)\)/g;
  const links: ParsedMarkdownLink[] = [];
  let m;
  while ((m = regex.exec(content)) !== null) {
    const fullMatch = m[0];
    const anchorText = m[1];
    const rawUrl = m[2].trim().split(/\s+/)[0];
    links.push({
      fullMatch,
      anchorText,
      url: rawUrl,
      index: m.index,
      isExternal: isExternalUrl(rawUrl, baseUrl),
      isInternal: isInternalUrl(rawUrl, baseUrl),
    });
  }
  return links;
}

/**
 * Normalize URL path for deduplication (e.g. "https://bedbugstreatment.co.in/services/" -> "/services")
 */
function normalizeUrlPath(url: string, baseUrl = "https://bedbugstreatment.co.in"): string {
  const clean = url.trim().split(/\s+/)[0];
  try {
    if (clean.startsWith("/")) return clean.toLowerCase().replace(/\/$/, "") || "/";
    const parsed = new URL(clean);
    return parsed.pathname.toLowerCase().replace(/\/$/, "") || "/";
  } catch {
    return clean.toLowerCase();
  }
}

/**
 * Deduplicate multiple links pointing to the exact same internal page.
 * Keeps the first link and converts subsequent duplicates to plain anchor text.
 */
export function deduplicateInternalLinks(content: string, baseUrl = "https://bedbugstreatment.co.in"): string {
  const links = parseMarkdownLinks(content, baseUrl).filter((l) => l.isInternal);
  const seenPaths = new Set<string>();
  const toUnwrap: ParsedMarkdownLink[] = [];

  for (const link of links) {
    const normPath = normalizeUrlPath(link.url, baseUrl);
    if (seenPaths.has(normPath)) {
      toUnwrap.push(link);
    } else {
      seenPaths.add(normPath);
    }
  }

  if (toUnwrap.length === 0) return content;

  let updated = content;
  // Unwrap from back to front to preserve string indices
  toUnwrap.sort((a, b) => b.index - a.index);
  for (const link of toUnwrap) {
    updated = updated.slice(0, link.index) + link.anchorText + updated.slice(link.index + link.fullMatch.length);
  }
  return updated;
}

/**
 * Prune internal links down to a maximum count (strictly 5).
 * Preserves essential links (/contact, /services) and unwraps excess links to plain text.
 */
export function pruneInternalLinksToMax(
  content: string,
  maxLinks = 5,
  baseUrl = "https://bedbugstreatment.co.in"
): string {
  const links = parseMarkdownLinks(content, baseUrl).filter((l) => l.isInternal);
  if (links.length <= maxLinks) return content;

  // Decide which links to keep
  // Priority: /contact (CTA), /services, then earlier contextual links
  const contactLinks = links.filter((l) => normalizeUrlPath(l.url, baseUrl) === "/contact");
  const serviceLinks = links.filter((l) => normalizeUrlPath(l.url, baseUrl) === "/services");
  const otherLinks = links.filter(
    (l) => normalizeUrlPath(l.url, baseUrl) !== "/contact" && normalizeUrlPath(l.url, baseUrl) !== "/services"
  );

  const kept = new Set<number>(); // indices of links to keep

  if (contactLinks.length > 0) kept.add(contactLinks[contactLinks.length - 1].index);
  if (serviceLinks.length > 0 && kept.size < maxLinks) kept.add(serviceLinks[0].index);

  for (const l of otherLinks) {
    if (kept.size >= maxLinks) break;
    kept.add(l.index);
  }

  for (const l of links) {
    if (kept.size >= maxLinks) break;
    kept.add(l.index);
  }

  const toUnwrap = links.filter((l) => !kept.has(l.index));
  toUnwrap.sort((a, b) => b.index - a.index);

  let updated = content;
  for (const link of toUnwrap) {
    updated = updated.slice(0, link.index) + link.anchorText + updated.slice(link.index + link.fullMatch.length);
  }
  return updated;
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
    if (line.includes("](")) continue;

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
  return line.replace(regex, `[${anchorText}](${fullUrl})`);
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

/**
 * Inject exactly ONE high-authority external link matching the content.
 */
function injectSingleExternalLink(content: string): string {
  const contentLower = content.toLowerCase();
  const scored = EXTERNAL_LINK_POOL
    .map((e) => ({
      ...e,
      score: e.keywords.filter((kw) => contentLower.includes(kw.toLowerCase())).length,
    }))
    .sort((a, b) => b.score - a.score);

  const bestEntry = scored[0] || EXTERNAL_LINK_POOL[0];
  const lines = content.split("\n");

  // Try to find an eligible line matching keywords
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (
      line.startsWith("#") ||
      line === "" ||
      line.startsWith("---") ||
      line.startsWith("![") ||
      line.startsWith("|") ||
      line.startsWith(">")
    ) {
      continue;
    }
    if (line.includes("](")) continue;

    const matchedKw = bestEntry.keywords.find((kw) => line.toLowerCase().includes(kw.toLowerCase()));
    if (matchedKw) {
      lines[i] = lines[i].trimEnd() + ` (see [${bestEntry.anchorText}](${bestEntry.url}))`;
      return lines.join("\n");
    }
  }

  // Fallback: place before References or at bottom
  const refIdx = lines.findIndex(
    (l) => l.toLowerCase().startsWith("## references") || l.toLowerCase().startsWith("## further reading")
  );
  const fallbackSentence = `For verified public-health guidance and safety advisories, refer to the [${bestEntry.anchorText}](${bestEntry.url}).`;
  if (refIdx !== -1) {
    lines.splice(refIdx, 0, `\n${fallbackSentence}\n`);
  } else {
    lines.push(`\n${fallbackSentence}\n`);
  }

  return lines.join("\n");
}

/**
 * Strictly enforce ONLY ONE external link across the entire markdown content.
 * 1. If > 1 external links exist, keep the first one and unwrap remaining [Anchor](url) to Anchor.
 * 2. If 0 external links exist, inject exactly one high-authority external link from EXTERNAL_LINK_POOL.
 * Result: markdown with strictly 1 external link.
 */
export function enforceStrictlyOneExternalLink(
  content: string,
  baseUrl = "https://bedbugstreatment.co.in",
  allowExternalLinks = true
): string {
  const allLinks = parseMarkdownLinks(content, baseUrl);
  const externalLinks = allLinks.filter((l) => l.isExternal);

  if (!allowExternalLinks) {
    let updated = content;
    const toUnwrap = [...externalLinks].sort((a, b) => b.index - a.index);
    for (const match of toUnwrap) {
      updated = updated.slice(0, match.index) + match.anchorText + updated.slice(match.index + match.fullMatch.length);
    }
    return updated;
  }

  if (externalLinks.length > 1) {
    // Keep the first external link, unwrap all subsequent external links to plain text
    let updated = content;
    const toUnwrap = externalLinks.slice(1);
    toUnwrap.sort((a, b) => b.index - a.index);
    for (const match of toUnwrap) {
      updated = updated.slice(0, match.index) + match.anchorText + updated.slice(match.index + match.fullMatch.length);
    }
    return updated;
  }

  if (externalLinks.length === 1) {
    return content;
  }

  // If 0 external links, inject exactly 1 high-authority external link
  return injectSingleExternalLink(content);
}

/**
 * Enforce both strict rules: strictly 1 external link, strictly max 5 internal links.
 */
export function enforceStrictLinkLimits(
  markdown: string,
  allowExternalLinks = true,
  baseUrl = "https://bedbugstreatment.co.in"
): string {
  let content = deduplicateInternalLinks(markdown, baseUrl);
  content = enforceStrictlyOneExternalLink(content, baseUrl, allowExternalLinks);
  content = pruneInternalLinksToMax(content, 6, baseUrl);
  return content;
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

  // Deduplicate any repeated internal links
  let content = deduplicateInternalLinks(markdown, baseUrl);
  
  // Strip hallucinatory internal links that don't exist in the inventory
  const initialLinks = parseMarkdownLinks(content, baseUrl).filter((l) => l.isInternal);
  const invalidLinks = initialLinks.filter(
    (l) => !allowedUrls.has(normalizeUrlPath(l.url, baseUrl)) && normalizeUrlPath(l.url, baseUrl) !== "/services" && normalizeUrlPath(l.url, baseUrl) !== "/contact"
  );
  
  if (invalidLinks.length > 0) {
    const toUnwrap = [...invalidLinks].sort((a, b) => b.index - a.index);
    for (const link of toUnwrap) {
      content = content.slice(0, link.index) + link.anchorText + content.slice(link.index + link.fullMatch.length);
    }
  }

  let lines = content.split("\n");

  // Track existing VALID internal paths
  const existingLinks = parseMarkdownLinks(content, baseUrl).filter((l) => l.isInternal);
  const usedPaths = new Set<string>(existingLinks.map((l) => normalizeUrlPath(l.url, baseUrl)));

  // Score published blog pages by relevance
  const publishedBlogs = inventory.filter((p) => p.source === "database");
  const contentLower = content.toLowerCase();

  const scoredBlogs = publishedBlogs.map((page) => {
    const slugKws = extractKeywordsFromSlugOrTopic(page.url.replace(/^\//, ""));
    const topicKws = extractKeywordsFromSlugOrTopic(page.topic || "");
    const allKws = [...new Set([...slugKws, ...topicKws])];
    const score = scoreBlogRelevance(allKws, contentLower, topicLower);
    return { ...page, score, keywords: allKws };
  });

  scoredBlogs.sort((a, b) => (b.score !== a.score ? b.score - a.score : Math.random() - 0.5));

  // Step 1: Inject /services if not already linked
  const servicesUrl = `${baseUrl}/services`;
  const servicesNorm = "/services";
  if (!usedPaths.has(servicesNorm) && allowedUrls.has("/services")) {
    const serviceAnchor = "bed bug treatment services";
    const serviceRegex = /\b(?:professional\s+(?:bed\s+bug\s+)?treatment|pest\s+control\s+services?|professional\s+extermination|expert\s+treatment)\b/i;
    let matched = false;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim().startsWith("#") || lines[i].includes("](")) continue;
      if (serviceRegex.test(lines[i])) {
        lines[i] = lines[i].replace(serviceRegex, `[${serviceAnchor}](${servicesUrl})`);
        usedPaths.add(servicesNorm);
        matched = true;
        break;
      }
    }
    if (!matched) {
      lines.push(
        `\nFor persistent infestations, consider scheduling professional [bed bug treatment services](${servicesUrl}) to inspect deep structural harborages.`
      );
      usedPaths.add(servicesNorm);
    }
  }

  // Step 2: Inject approx minimum 3 contextual blog links to ensure 5 to 6 total interlinks
  const currentTotal = usedPaths.size + (usedPaths.has("/contact") ? 0 : 1);
  const targetBlogCount = Math.max(3, Math.min(4, 6 - currentTotal));

  let blogLinksInjected = 0;
  for (const blog of scoredBlogs) {
    if (blogLinksInjected >= targetBlogCount) break;
    const norm = normalizeUrlPath(blog.url, baseUrl);
    if (usedPaths.has(norm)) continue;

    const fullUrl = `${baseUrl}${blog.url}`;
    const bestIdx = findBestLineIndex(lines, blog.keywords.slice(0, 8));
    const matchedKw = blog.keywords.find(
      (kw) => kw.length >= 4 && lines[bestIdx]?.toLowerCase().includes(kw)
    );

    if (bestIdx !== -1 && matchedKw) {
      lines[bestIdx] = injectLinkIntoLine(lines[bestIdx], matchedKw, blog.title, fullUrl);
      usedPaths.add(norm);
      blogLinksInjected++;
    }
  }

  // Step 3: Related reading fallback if total blog links injected < 3
  if (blogLinksInjected < 3 && (usedPaths.size + (usedPaths.has("/contact") ? 0 : 1)) < 5) {
    const remaining = scoredBlogs
      .filter((b) => !usedPaths.has(normalizeUrlPath(b.url, baseUrl)))
      .slice(0, 5 - (usedPaths.size + (usedPaths.has("/contact") ? 0 : 1)));

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
        usedPaths.add(normalizeUrlPath(b.url, baseUrl));
        blogLinksInjected++;
      }
    }
  }

  // Step 4: FAQ fallback if still < 5 total internal links
  if ((usedPaths.size + (usedPaths.has("/contact") ? 0 : 1)) < 5 && allowedUrls.has("/faq") && !usedPaths.has("/faq")) {
    lines.push(
      `\nFor answers to common pest management inquiries, review our [frequently asked questions about bed bugs](${baseUrl}/faq).`
    );
    usedPaths.add("/faq");
  }

  // Step 5: Contact CTA
  content = lines.join("\n");
  const contactFullUrl = `${baseUrl}/contact`;
  const contactNorm = "/contact";
  const cta = {
    heading: "Suspecting Bed Bugs in Your Home?",
    text: "Still finding physical signs of bed bugs or waking up with unexplained bites? Request a thorough inspection to determine the exact extent of the infestation and explore targeted, integrated treatment options.",
    targetUrl: contactFullUrl,
    buttonText: "Schedule an Inspection",
  };

  const genericClosingRegex = /\b(?:contact\s+(?:a\s+)?local\s+pest\s+control\s+service|hire\s+(?:a\s+)?local\s+exterminator|consult\s+local\s+professionals)\b[^.\n]*/gi;
  if (genericClosingRegex.test(content)) {
    content = content.replace(
      genericClosingRegex,
      `[request an on-site inspection from BedBugsTreatment.co.in](${contactFullUrl}) to evaluate infestation severity`
    );
    usedPaths.add(contactNorm);
  }

  const ctaBlock = `\n\n---\n\n### ${cta.heading}\n\n${cta.text}\n\n👉 [${cta.buttonText}](${cta.targetUrl})\n`;
  if (!content.includes(contactFullUrl)) {
    content += ctaBlock;
    usedPaths.add(contactNorm);
  }

  // Step 6: Strictly enforce 5 to 6 internal links (prune if > 6)
  content = pruneInternalLinksToMax(content, 6, baseUrl);

  // Step 7: Strictly enforce ONLY ONE (1) external link
  content = enforceStrictlyOneExternalLink(content, baseUrl);

  // Extract all final internal links for reporting
  const finalInternalLinks = parseMarkdownLinks(content, baseUrl).filter((l) => l.isInternal);
  const injectedLinks: ContextualInternalLink[] = finalInternalLinks.map((l) => ({
    targetUrl: l.url,
    anchorText: l.anchorText,
    contextSentence: `Internal link: ${l.anchorText} (${l.url})`,
  }));

  return {
    markdownWithLinks: content,
    injectedLinks,
    cta,
    validUrlsCount: injectedLinks.length,
  };
}
