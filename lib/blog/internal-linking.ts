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

export async function processInternalLinksAndCTA(
  markdown: string,
  topic: string
): Promise<InternalLinkingResult> {
  const inventory = await getExistingPageInventory();
  const allowedUrls = new Set(inventory.map((page) => page.url));

  let content = markdown;
  const injectedLinks: ContextualInternalLink[] = [];

  // Match high-relevance pages deterministically
  const linkCandidates = [
    {
      keywordRegex: /\b(?:professional\s+bed\s+bug\s+treatment|pest\s+control\s+services?|professional\s+extermination)\b/i,
      targetUrl: "/services",
      anchorText: "professional bed bug treatment services"
    },
    {
      keywordRegex: /\b(?:schedule\s+an\s+inspection|request\s+an\s+inspection|contact\s+a\s+technician|contact\s+us)\b/i,
      targetUrl: "/contact",
      anchorText: "request a professional inspection"
    },
    {
      keywordRegex: /\b(?:in\s+Mumbai|Mumbai\s+homes|properties\s+in\s+Mumbai)\b/i,
      targetUrl: "/mumbai",
      anchorText: "bed bug treatment in Mumbai"
    },
    {
      keywordRegex: /\b(?:in\s+Delhi|Delhi\s+NCR|properties\s+in\s+Delhi)\b/i,
      targetUrl: "/delhi",
      anchorText: "bed bug treatment in Delhi"
    },
    {
      keywordRegex: /\b(?:in\s+Bangalore|Bengaluru\s+homes|properties\s+in\s+Bangalore)\b/i,
      targetUrl: "/bangalore",
      anchorText: "bed bug treatment in Bangalore"
    }
  ];

  const baseUrl = "https://bedbugstreatment.co.in";
  let lines = content.split("\n");

  for (const candidate of linkCandidates) {
    const fullUrl = `${baseUrl}${candidate.targetUrl}`;
    if (allowedUrls.has(candidate.targetUrl) && !content.includes(`](${fullUrl})`)) {
      for (let i = 0; i < lines.length; i++) {
        if (!lines[i].trim().startsWith("#") && candidate.keywordRegex.test(lines[i])) {
          lines[i] = lines[i].replace(
            candidate.keywordRegex,
            `[${candidate.anchorText}](${fullUrl})`
          );
          injectedLinks.push({
            targetUrl: fullUrl,
            anchorText: candidate.anchorText,
            contextSentence: `Contextually linked ${candidate.anchorText} to ${fullUrl}`
          });
          break;
        }
      }
    }
  }
  
  content = lines.join("\n");

  // Ensure at least /services and /contact are linked if missing
  const servicesFullUrl = `${baseUrl}/services`;
  if (!content.includes(`](${servicesFullUrl})`) && allowedUrls.has("/services")) {
    const servicesSentence = `\n\nFor persistent or widespread infestations, exploring [professional bed bug treatment services](${servicesFullUrl}) ensures thorough harborage detection and compliant application methods.`;
    content += servicesSentence;
    injectedLinks.push({
      targetUrl: servicesFullUrl,
      anchorText: "professional bed bug treatment services",
      contextSentence: servicesSentence.trim()
    });
  }

  // Our Company's Verified Contextual CTA
  const contactFullUrl = `${baseUrl}/contact`;
  const cta = {
    heading: "Suspecting Bed Bugs in Your Home?",
    text: "Still finding physical signs of bed bugs or waking up with unexplained bites? Request a thorough inspection to determine the exact extent of the infestation and explore targeted, integrated treatment options.",
    targetUrl: contactFullUrl,
    buttonText: "Schedule an Inspection"
  };

  // Replace any generic "contact a local pest control service" closing with our specific CTA
  const genericClosingRegex = /\b(?:contact\s+(?:a\s+)?local\s+pest\s+control\s+service|hire\s+(?:a\s+)?local\s+exterminator|consult\s+local\s+professionals)\b[^.\n]*/gi;
  if (genericClosingRegex.test(content)) {
    content = content.replace(
      genericClosingRegex,
      `[request an on-site inspection from BedBugsTreatment.co.in](${contactFullUrl}) to evaluate infestation severity`
    );
  }

  // Append standardized CTA box at the end before FAQ/References
  const ctaBlock = `\n\n---\n\n### ${cta.heading}\n\n${cta.text}\n\n👉 [${cta.buttonText}](${cta.targetUrl})\n`;
  if (!content.includes(cta.targetUrl)) {
    content += ctaBlock;
  }

  return {
    markdownWithLinks: content,
    injectedLinks,
    cta,
    validUrlsCount: injectedLinks.length
  };
}
