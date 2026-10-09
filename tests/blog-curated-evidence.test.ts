import assert from "node:assert/strict";
import test from "node:test";
import { selectCuratedEvidence, supportsCuratedParaphrase } from "../lib/blog/curated-evidence";

test("cost articles get treatment evidence without invented Pune prices or business claims", () => {
  const facts = selectCuratedEvidence("Affordable Bed Bug Treatment Options in Pune");
  assert.ok(facts.some((fact) => fact.category === "PRICE_CLAIM"));
  assert.ok(facts.some((fact) => fact.claim.includes("multiple professional visits")));
  assert.ok(facts.length <= 10);
  assert.ok(facts.every((fact) => !/₹|\bINR\b|\bRs\.?\s*\d|Pune price|certified local/i.test(fact.claim)));
  assert.ok(facts.every((fact) => new URL(fact.sourceUrl).protocol === "https:"));
});

test("bite articles retain public-health evidence and never treat the source snapshot as a live search", () => {
  const facts = selectCuratedEvidence("How to identify bed bug bites");
  assert.ok(facts.some((fact) => fact.sourceUrl.includes("cdc.gov") && fact.category === "HEALTH_CLAIM"));
  assert.ok(facts.every((fact) => fact.verification.discoveredByWebSearch === false));
});

test("the trial's supported paraphrases pass without accepting an eradication promise", () => {
  const facts = selectCuratedEvidence("Affordable Bed Bug Treatment Options in Pune");
  const ipm = facts.find((fact) => fact.id === "C06");
  const alcohol = facts.find((fact) => fact.id === "C13");
  assert.ok(ipm && alcohol);
  assert.ok(supportsCuratedParaphrase("Integrated Pest Management combines both non-chemical and careful chemical approaches.", ipm));
  assert.ok(supportsCuratedParaphrase("Rubbing alcohol is flammable and poses a fire risk; its use is not a safe home treatment.", alcohol));
  assert.ok(!supportsCuratedParaphrase("Integrated Pest Management completely eradicates bed bugs.", ipm));
  assert.ok(!supportsCuratedParaphrase("Rubbing alcohol is safe for home use.", alcohol));
  const bites = selectCuratedEvidence("How to identify bed bug bites").find((fact) => fact.id === "C02");
  assert.ok(bites);
  assert.ok(supportsCuratedParaphrase("Bed bug bites may look similar to mosquito or flea bites.", bites));
});
