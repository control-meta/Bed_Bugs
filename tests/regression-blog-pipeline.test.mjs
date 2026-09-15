import assert from "node:assert/strict";
import test from "node:test";
import { detectClaimsInText } from "../lib/blog/claim-detector.ts";
import { sanitizeTextContent } from "../lib/blog/section-sanitizer.ts";
import { getVerifiedEvidencePool } from "../lib/blog/evidence-contract.ts";

// The exact failed output referenced in the user report
const FAILED_ARTICLE_EXCERPT = `
# Complete Bed Bug Treatment Guide

Bed bug infestations have increased dramatically, with reported cases rising by 20% annually across metro cities.
According to a study by ICMR, early detection is essential to minimize spread.
Experts from the National Institute of Pest Management recommend proactive inspection protocols.

Typical professional bed bug treatment costs ₹2,000 to ₹10,000 depending on home size.
Bed bugs cannot survive temperatures above 45°C under any condition.
Neem oil disrupts the life cycle of bed bugs, and lavender and tea tree oil have proven repellent properties.

With proper professional intervention, homeowners can expect results within a week or multiple treatments over a month.
Furthermore, licensed professionals often guarantee their work to ensure complete peace of mind.
`;

test("Regression Test 1: Detector detects every single reported hallucination pattern", () => {
  const evidencePool = getVerifiedEvidencePool();
  const claims = detectClaimsInText(FAILED_ARTICLE_EXCERPT, evidencePool);

  const matchedRules = claims.map((c) => c.matchedRule);
  const matchedCategories = claims.map((c) => c.category);

  // 1. "20% annually" -> UNVERIFIED STATISTIC
  assert.ok(
    claims.some((c) => c.category === "STATISTIC" && !c.isSupported),
    "Expected unverified statistic '20% annually' to be detected."
  );

  // 2. "According to a study by ICMR" -> UNVERIFIED STUDY / TRIGGER PHRASE
  assert.ok(
    claims.some((c) => c.category === "STUDY" && !c.isSupported),
    "Expected trigger phrase / unverified study 'According to a study' to be detected."
  );

  // 3. "National Institute of Pest Management" -> UNVERIFIED ENTITY / EXPERT
  assert.ok(
    claims.some((c) => c.text.includes("National Institute") || c.text.includes("ICMR")),
    "Expected unverified named entity/institute to be detected."
  );

  // 4. "₹2,000 to ₹10,000" -> UNVERIFIED PRICE
  assert.ok(
    claims.some((c) => c.category === "PRICE" && !c.isSupported),
    "Expected unverified price '₹2,000 to ₹10,000' to be detected."
  );

  // 5. "above 45°C" -> UNVERIFIED TECHNICAL THRESHOLD
  assert.ok(
    claims.some((c) => c.category === "TEMPERATURE" && !c.isSupported),
    "Expected unqualified temperature threshold '45°C' to be detected."
  );

  // 6. "Neem oil disrupts the life cycle" -> HOME REMEDY EFFICACY
  assert.ok(
    claims.some((c) => c.category === "HOME_REMEDY_EFFECTIVENESS"),
    "Expected home remedy efficacy claim for neem oil to be detected."
  );

  // 7. "lavender and tea tree ... repellent properties" -> HOME REMEDY EFFICACY
  assert.ok(
    claims.some((c) => c.matchedRule.includes("HOME_REMEDY_EVIDENCE_GATE")),
    "Expected repellent claim for lavender/tea tree to be detected."
  );

  // 8. "results within a week" & "multiple treatments over a month" -> DURATION
  assert.ok(
    claims.some((c) => c.category === "DURATION" && !c.isSupported),
    "Expected unverified duration claims to be detected."
  );

  // 9. "professionals often guarantee their work" -> GUARANTEE
  assert.ok(
    claims.some((c) => c.category === "GUARANTEE" && !c.isSupported),
    "Expected unverified guarantee claim to be detected."
  );
});

test("Regression Test 2: Unsanitized failed article is HARD BLOCKED from publication", () => {
  const evidencePool = getVerifiedEvidencePool();
  const claims = detectClaimsInText(FAILED_ARTICLE_EXCERPT, evidencePool);

  const unverifiedHighRisk = claims.filter((c) => c.risk === "HIGH" && !c.isSupported);
  assert.ok(unverifiedHighRisk.length >= 5, "Must detect multiple high risk unverified claims.");

  // If published without sanitization, status MUST be BLOCKED
  const hasBlockers = unverifiedHighRisk.length > 0;
  assert.equal(hasBlockers ? "BLOCKED" : "READY", "BLOCKED");
});

test("Regression Test 3: Programmatic sanitizer cleans all 10 issues and unlocks READY status", () => {
  const evidencePool = getVerifiedEvidencePool();
  const result = sanitizeTextContent(FAILED_ARTICLE_EXCERPT, evidencePool);

  // Assertions on cleaned text:
  // 1. No ICMR or fake institutes
  assert.ok(!result.cleanedText.includes("ICMR"), "ICMR study must be removed");
  assert.ok(!result.cleanedText.includes("National Institute of Pest Management"), "Fake institute must be removed");

  // 2. No "20% annually"
  assert.ok(!result.cleanedText.includes("20%"), "Fake 20% statistic must be purged");

  // 3. No invented ₹2,000–₹10,000 pricing
  assert.ok(!result.cleanedText.includes("₹2,000"), "Fixed price must be removed");
  assert.ok(
    result.cleanedText.includes("Treatment costs vary based on property size"),
    "Must substitute safe variable pricing disclosure"
  );

  // 4. No unqualified 45°C claim
  assert.ok(!result.cleanedText.includes("above 45°C"), "Unqualified 45°C must be removed");

  // 5. No unverified home remedy efficacy claims
  assert.ok(!result.cleanedText.includes("Neem oil disrupts the life cycle"), "Neem oil claim must be purged");

  // 6. Blockers should now be 0
  assert.equal(result.blockers.unverifiedStatistic, 0, "Unverified statistics must be 0");
  assert.equal(result.blockers.unverifiedPrice, 0, "Unverified prices must be 0");
  assert.equal(result.blockers.fabricatedSource, 0, "Fabricated sources must be 0");
  assert.equal(result.blockers.fabricatedExpert, 0, "Fabricated experts must be 0");
  assert.equal(result.blockers.unverifiedTechnicalThreshold, 0, "Unverified thresholds must be 0");
  assert.equal(result.blockers.highRiskClaimWithoutEvidence, 0, "High risk unverified must be 0");

  // 7. Evidence coverage must reach 100%
  assert.equal(result.evidenceCoverage, 100, "Evidence coverage must be 100%");

  // 8. Publication status must be READY
  assert.equal(result.publicationStatus, "READY", "Publication status should now be READY");
});
