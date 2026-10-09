import assert from "node:assert/strict";
import test from "node:test";
import { selectCuratedEvidence } from "../lib/blog/curated-evidence";
import { buildEditorialRewritePayload } from "../lib/blog/rewrite-request";
import { completionAllowance } from "../lib/blog/token-budget";
import type { DraftPackage } from "../lib/blog/schemas";

test("the rewrite request fits after a 6225-token draft and reserves the independent review", () => {
  const sourceUrl = "https://www.epa.gov/bedbugs/controlling-bed-bugs-using-integrated-pest-management-ipm";
  const draft = {
    markdown: Array.from({ length: 100 }, () =>
      `Ask providers what the quote includes and how follow-up visits are handled [EPA guidance](${sourceUrl}).`,
    ).join("\n\n") + "\n\n## FAQs\n\n### Is there a fixed price?\n\nRequest a written quote.",
    metadata: { h1: "Affordable Bed Bug Treatment Options in Pune" },
  } as DraftPackage;
  const payload = buildEditorialRewritePayload({
    topic: "Affordable Bed Bug Treatment Options in Pune",
    readerProblem: "Compare treatment options on a budget.",
    expectedAnswer: "A source-backed comparison without invented prices.",
    researchGaps: ["No verified Pune price list"],
    facts: selectCuratedEvidence("Affordable Bed Bug Treatment Options in Pune"),
    internalPages: [
      { url: "/", title: "Home" },
      { url: "/services", title: "Treatment services" },
      { url: "/contact", title: "Request inspection" },
      { url: "/faq", title: "FAQs" },
      { url: "/pune", title: "Pune services" },
    ],
    draft,
  });
  assert.ok(payload.shortDraft.length <= 4_500);
  assert.ok(!payload.shortDraft.includes(sourceUrl));
  assert.ok(!payload.shortDraft.includes("## FAQs"));
  assert.ok(payload.sources.length < payload.facts.length);
  const serializedRequest = JSON.stringify({
    messages: [{ role: "system", content: "x".repeat(2_500) }, { role: "user", content: JSON.stringify(payload) }],
    responseFormat: "x".repeat(800),
  });
  const allowance = completionAllowance({
    usedTokens: 6_225,
    serializedRequest,
    desiredCompletionTokens: 4_700,
    minimumCompletionTokens: 3_000,
    reserveAfterCall: 6_200,
  });
  assert.ok(allowance >= 3_500, `expected rewrite headroom, received ${allowance}`);
});
