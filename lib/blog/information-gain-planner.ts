export interface InformationGainPlan {
  readerNeeds: string[];
  commonCompetitorCoverage: string[];
  contentGaps: string[];
  uniqueUsefulElements: string[];
}

export const PRACTICAL_TOOL_REPERTOIRE = [
  "Mattress seam and tuft inspection checklist",
  "Bed-frame, headboard, and baseboard inspection steps",
  "Physical evidence vs bite marks differentiation guide",
  "DIY vs Professional pest control decision matrix",
  "Pre-treatment room preparation checklist (laundering, decluttering, vacuuming)",
  "What NOT to do: Common mistakes that spread infestations (e.g. bug bombs, discarding unbagged mattresses)",
  "Travel and luggage inspection and quarantine protocol",
  "High-density urban considerations: Shared walls in apartments and PG accommodations",
  "Post-treatment monitoring and prevention strategy",
  "Questions homeowners should ask before hiring a pest control service"
];

export function buildInformationGainPlan(topic: string): InformationGainPlan {
  const normTopic = topic.toLowerCase();

  const readerNeeds: string[] = [
    "Immediate guidance to determine if they actually have bed bugs or another pest",
    "Realistic, actionable steps to stop bugs from biting without dangerous chemicals",
    "Understanding why home remedies fail and when professional intervention is required",
    "Clear expectation of treatment timelines, preparation steps, and pricing variables"
  ];

  const commonCompetitorCoverage: string[] = [
    "Generic pest definitions and biological descriptions",
    "Vague claims that DIY sprays work instantly",
    "Unverified pricing tables designed to bait phone calls",
    "Superficial lists of home remedies without scientific context"
  ];

  const contentGaps: string[] = [
    "Clear distinction between bite symptoms (unreliable) and physical evidence (reliable)",
    "Practical guidance for shared accommodations, hostels, and PGs in Indian cities",
    "Actionable room prep checklist that protects neighboring units from dispersal",
    "Honest explanation of the multi-treatment IPM life-cycle (egg hatching intervals)"
  ];

  // Tailor unique elements based on intent
  const uniqueUsefulElements: string[] = [];
  if (normTopic.includes("cost") || normTopic.includes("price")) {
    uniqueUsefulElements.push(
      "Pricing variables breakdown: Area size, room count, infestation grade, and follow-up visits",
      "Inspection checklist: What a legitimate pest inspector examines before quoting",
      "DIY vs Professional pest control decision matrix"
    );
  } else if (normTopic.includes("identify") || normTopic.includes("bite")) {
    uniqueUsefulElements.push(
      "Physical evidence vs bite marks differentiation guide",
      "Mattress seam and tuft inspection checklist",
      "Bed-frame, headboard, and baseboard inspection steps"
    );
  } else if (normTopic.includes("diy") || normTopic.includes("remedy")) {
    uniqueUsefulElements.push(
      "DIY vs Professional pest control decision matrix",
      "What NOT to do: Common mistakes that spread infestations (e.g. bug bombs, discarding unbagged mattresses)",
      "Pre-treatment room preparation checklist (laundering, decluttering, vacuuming)"
    );
  } else {
    uniqueUsefulElements.push(
      "Mattress seam and tuft inspection checklist",
      "Physical evidence vs bite marks differentiation guide",
      "Pre-treatment room preparation checklist (laundering, decluttering, vacuuming)",
      "High-density urban considerations: Shared walls in apartments and PG accommodations"
    );
  }

  return {
    readerNeeds,
    commonCompetitorCoverage,
    contentGaps,
    uniqueUsefulElements
  };
}
