export const CORE_BLOG_EDITORIAL_STANDARDS = `
EDITORIAL STANDARD:
- Improve and refine useful material instead of blindly expanding or rewriting it.
- Answer the primary search intent immediately. Put the most useful answer, checklist, decision aid, or definition near the beginning.
- Let usefulness determine length. Never add sections, FAQs, city references, biology, or examples merely to reach a word count.
- Preserve strong material; remove repetition, generic introductions, keyword stuffing, vague transitions, exaggerated claims, and AI-sounding language.
- Write in clear, natural Indian English, as an experienced pest-control professional explaining the subject to a homeowner.
- Use H2 and H3 headings in a logical order. Use tables and lists only when they make a task or comparison easier to follow.
- Separate established facts, general best practices, and instructions that depend on the treatment method, product label, property, or provider.
- Never invent statistics, experts, research, URLs, temperatures, exposure times, re-entry periods, prices, guarantees, or treatment-success percentages.
- Important technical and safety claims must use the supplied evidence contract. If the evidence does not support the exact claim, qualify or remove it.
- Use the primary keyword naturally. Do not force exact-match wording into headings or repeat it unnecessarily.
- In the interlinks step of the blog generator: Strictly instruct and add 4 to 5 contextual internal links (interlinks) and strictly ONLY ONE (1) high-authority external link across the entire article. All other evidence sources and citations must be plain text without external hyperlinks. Add one educational-first CTA near the end using: problem -> professional inspection/treatment -> clear next action.
- FAQs must answer useful questions not already answered in the body.
- Recommend only schema types whose content is visibly present on the page.
`;

const PREPARATION_GUIDE_REQUIREMENTS = `
TOPIC PROFILE — PROFESSIONAL BED BUG TREATMENT PREPARATION:
- Use this progression where it serves the topic: concise introduction -> "Before Bed Bug Treatment: Quick Checklist" -> detailed preparation steps -> DO vs DON'T table -> room-by-room preparation -> children, pets, aquariums, electronics, food, sensitive items and valuables -> apartment/PG/shared-building considerations -> 24 hours before treatment -> treatment-day instructions -> what to expect after treatment -> FAQs -> one final CTA.
- Cover decluttering; provider-approved laundering/drying; isolating cleaned items; vacuuming; mattress and bed preparation; wardrobes and drawers; access to walls and furniture; and what residents should do before leaving.
- Clearly explain what should not be moved from the infested room, how to avoid carrying bed bugs into untreated rooms, and why furniture or mattresses should not automatically be discarded.
- Include common preparation mistakes and practical questions to ask the technician before treatment.
- Never present one preparation method as universal. The pest-control provider's written preparation instructions and the product label take precedence when they differ.
- Do not invent universal laundering temperatures, heat-treatment temperatures, re-entry periods, pesticide instructions, treatment frequency, or electronics-handling rules.
- Keep biology and treatment-method background only when it directly helps the reader prepare safely.
- Remove unnatural phrases such as "wanderlust bed bugs", "often vocalized solutions", "defensive tactic", "treatment can immerse", or "convey controlled temperatures".
`;

const PROCEDURAL_GUIDE_REQUIREMENTS = `
TOPIC PROFILE — PROCEDURAL GUIDE:
- Give readers a concise scannable checklist near the beginning, followed by steps in the order they should perform them.
- Include common mistakes, stop conditions, safety qualifications, and a short "what to do next" section when relevant.
- Do not force unrelated treatment comparisons or room-by-room sections into the article.
`;

const COMPARISON_GUIDE_REQUIREMENTS = `
TOPIC PROFILE — COMPARISON OR DECISION GUIDE:
- State the decision criteria early and use a concise comparison table when it improves clarity.
- Explain suitability, limitations, safety dependencies, and when professional assessment is needed.
- Do not declare a universal winner when the correct choice depends on inspection findings or treatment constraints.
`;

export function buildTopicEditorialRequirements(topic: string): string {
  const normalized = topic.toLowerCase();
  let profile = "";

  if (/prepar|before (?:professional )?bed bug treatment/.test(normalized)) {
    profile = PREPARATION_GUIDE_REQUIREMENTS;
  } else if (/\b(?:how to|checklist|steps?|guide|protocol)\b/.test(normalized)) {
    profile = PROCEDURAL_GUIDE_REQUIREMENTS;
  } else if (/\b(?:vs\.?|versus|compare|comparison|which|pros? and cons?)\b/.test(normalized)) {
    profile = COMPARISON_GUIDE_REQUIREMENTS;
  }

  return `${CORE_BLOG_EDITORIAL_STANDARDS}\n${profile}`.trim();
}
