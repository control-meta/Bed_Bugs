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
    `A direct answer to the specific question: ${topic}`,
    "Practical steps or decision criteria they can use immediately",
    "Clear safety limits and an explanation of which instructions depend on the treatment method or provider",
    "A realistic next step without exaggerated sales claims"
  ];

  const commonCompetitorCoverage: string[] = [
    "Generic pest definitions and biological descriptions",
    "Vague claims that DIY sprays work instantly",
    "Unverified pricing tables designed to bait phone calls",
    "Superficial lists of home remedies without scientific context"
  ];

  const contentGaps: string[] = [
    "Scannable instructions or decision support near the beginning",
    "Clear separation between established facts, best practices, and treatment-dependent advice",
    "Common mistakes and the practical consequence of each mistake",
    "Specific guidance for the reader's likely property or living situation when relevant"
  ];

  // Tailor unique elements based on intent
  const uniqueUsefulElements: string[] = [];
  if (/prepar|before (?:professional )?bed bug treatment/.test(normTopic)) {
    readerNeeds.splice(1, 0, "A quick preparation checklist followed by steps in the order they should be completed");
    contentGaps.push(
      "What must stay in the infested room to prevent accidental spread",
      "Provider-specific rules for children, pets, aquariums, electronics, food, valuables, and re-entry",
    );
    uniqueUsefulElements.push(
      "Before Bed Bug Treatment: Quick Checklist",
      "DO vs DON'T preparation table",
      "24 hours before treatment and treatment-day checklists",
      "Room-by-room preparation covering wardrobes, drawers, beds, furniture, sensitive items, children, pets and aquariums",
      "Apartment, PG and shared-building coordination guidance",
      "Questions to ask the technician before treatment",
    );
  } else if (normTopic.includes("cost") || normTopic.includes("price")) {
    uniqueUsefulElements.push(
      "Pricing variables breakdown: Area size, room count, infestation grade, and follow-up visits",
      "Inspection checklist: What a legitimate pest inspector examines before quoting",
      "DIY vs Professional pest control decision matrix"
    );
  } else if (normTopic.includes("identify") || normTopic.includes("bite") || normTopic.includes("sign")) {
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
  } else if (/travel|hotel|luggage/.test(normTopic)) {
    uniqueUsefulElements.push(
      "Arrival, room-inspection, luggage-storage and return-home protocol",
      "What to do when suspicious evidence is found during a trip",
      "Steps that reduce the chance of moving bed bugs from luggage into sleeping areas",
    );
  } else if (/apartment|pg|hostel|shared|rented|landlord/.test(normTopic)) {
    uniqueUsefulElements.push(
      "Resident, landlord and property-manager coordination checklist",
      "Guidance for adjacent-unit inspection and shared belongings",
      "Actions that reduce accidental movement into untreated rooms or units",
    );
  } else {
    uniqueUsefulElements.push(
      "A concise direct-answer summary near the beginning",
      "Topic-specific checklist or decision workflow",
      "Common mistakes and realistic limitations",
      "Clear criteria for when professional inspection may be appropriate"
    );
  }

  return {
    readerNeeds,
    commonCompetitorCoverage,
    contentGaps,
    uniqueUsefulElements
  };
}
