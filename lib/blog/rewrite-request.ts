import type { DraftPackage, VerifiedFact } from "./schemas";

type InternalPage = { url: string; title: string };

/** Keep the rewrite brief within the same budget as its mandatory independent review. */
export function buildEditorialRewritePayload(input: {
  topic: string;
  readerProblem: string;
  expectedAnswer: string;
  researchGaps: string[];
  facts: VerifiedFact[];
  internalPages: InternalPage[];
  draft: DraftPackage;
}) {
  const sourceByUrl = new Map<string, { id: string; title: string; url: string }>();
  for (const fact of input.facts) {
    if (!sourceByUrl.has(fact.sourceUrl)) {
      sourceByUrl.set(fact.sourceUrl, {
        id: `S${sourceByUrl.size + 1}`,
        title: fact.sourceTitle,
        url: fact.sourceUrl,
      });
    }
  }
  const preferredPages = input.internalPages.filter((page) =>
    ["/services", "/contact", "/faq"].includes(page.url),
  );
  const relatedPages = input.internalPages.filter((page) =>
    !["/", "/services", "/contact", "/faq", "/about"].includes(page.url),
  ).slice(0, 3);
  const draftBody = input.draft.markdown
    .replace(/\n##\s+(?:FAQs?|Frequently Asked Questions|References|Sources)\s*\n[\s\S]*$/i, "")
    .replace(/\[([^\]]+)\]\(https?:\/\/[^)]+\)/g, "$1")
    .trim();
  const excerpt = draftBody.slice(0, 4_500);
  const paragraphBoundary = excerpt.lastIndexOf("\n\n");
  const shortDraft = draftBody.length > 4_500 && paragraphBoundary > 3_500
    ? excerpt.slice(0, paragraphBoundary)
    : excerpt;

  return {
    topic: input.topic.slice(0, 180),
    readerProblem: input.readerProblem.slice(0, 400),
    expectedAnswer: input.expectedAnswer.slice(0, 400),
    unavailableEvidence: input.researchGaps.slice(0, 6).map((gap) => gap.slice(0, 200)),
    facts: input.facts.map((fact) => ({
      id: fact.id,
      claim: fact.claim,
      source: sourceByUrl.get(fact.sourceUrl)?.id,
    })),
    sources: [...sourceByUrl.values()],
    allowedInternalPages: [...preferredPages, ...relatedPages].map((page) => ({
      url: page.url,
      title: page.title.slice(0, 120),
    })),
    h1: input.draft.metadata.h1.slice(0, 180),
    shortDraft,
  };
}
