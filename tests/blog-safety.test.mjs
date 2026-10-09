import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import safetyModule from "../lib/blog/safety.js";

const {
  calculateCannibalization,
  removeUnsupportedProse,
  scanHallucinations,
} = safetyModule;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const failedArticle = fs.readFileSync(
  path.join(__dirname, "fixtures", "failed-bed-bug-article.md"),
  "utf8",
);

test("failed article is blocked for every reported hallucination class", () => {
  const warningCodes = new Set(scanHallucinations(failedArticle, [], []).map((warning) => warning.code));
  for (const requiredCode of [
    "UNVERIFIED_PRICE",
    "UNVERIFIED_TECHNICAL_CLAIM",
    "UNVERIFIED_EXPERT",
    "UNVERIFIED_SOURCE",
    "UNSUPPORTED_LOCAL_CLAIM",
    "FEAR_BASED_CTA",
    "GENERIC_AI_LANGUAGE",
    "MISSING_FAQ",
    "MISSING_INTERNAL_LINKS",
  ]) {
    assert.ok(warningCodes.has(requiredCode), `expected ${requiredCode}`);
  }
});

test("a sensitive claim is accepted only when a matching verified source is cited", () => {
  const sourceUrl = "https://example.gov/verified-price";
  const evidence = [{
    sourceUrl,
    claim: "The configured inspection price is ₹1,500.",
  }];
  const markdown = `# Pricing\n\nThe configured inspection price is ₹1,500 ([official price](${sourceUrl})).\n\n## FAQ\n\n### Is this current?\n\nRequest confirmation before booking.\n\nSee our [contact page](/contact).`;
  const warningCodes = scanHallucinations(markdown, evidence, ["/contact"]).map((warning) => warning.code);
  assert.ok(!warningCodes.includes("UNVERIFIED_PRICE"));
  assert.ok(!warningCodes.includes("UNSUPPORTED_URL"));
});

test("an invented external URL is rejected even when it looks plausible", () => {
  const markdown = "# Article\n\nRead [the guideline](https://health.gov.example/bed-bugs).\n\n## FAQ\n\n### What next?\n\nSee our [contact page](/contact).";
  const warningCodes = scanHallucinations(markdown, [], ["/contact"]).map((warning) => warning.code);
  assert.ok(warningCodes.includes("UNSUPPORTED_URL"));
});

test("INR pricing and unsupported efficacy language are high-risk warnings", () => {
  const markdown = "# Treatment\n\nNeem oil kills bed bugs. Treatment costs INR 2,000–INR 5,000.\n\n## FAQ\n\n### What next?\n\nSee our [contact page](/contact).";
  const warnings = scanHallucinations(markdown, [], ["/contact"]);
  assert.ok(warnings.some((warning) => warning.code === "UNVERIFIED_PRICE" && warning.risk === "HIGH"));
  assert.ok(warnings.some((warning) => warning.code === "UNVERIFIED_TECHNICAL_CLAIM" && warning.risk === "HIGH"));
});

test("descriptive use of 'effective' does not create a false efficacy warning", () => {
  const markdown = "# Effective Bed Bug Treatment\n\nUse this checklist for effective planning.\n\n## FAQ\n\n### What next?\n\nSee our [contact page](/contact).";
  const warnings = scanHallucinations(markdown, [], ["/contact"]);
  assert.ok(!warnings.some((warning) => warning.code === "UNVERIFIED_TECHNICAL_CLAIM"));
});

test("a long cited treatment sentence maps to its verified evidence URL", () => {
  const sourceUrl = "https://extension.example.edu/bed-bug-steam-research";
  const evidence = [{
    sourceUrl,
    claim: "University research supports steam as an effective bed bug management method.",
  }];
  const markdown = `# Steam treatment\n\nA detailed explanation with several qualifying words says steam treatment is an effective method for bed bug management when it is used as part of a suitable plan [university bed bug research](${sourceUrl}).\n\n## FAQ\n\n### What next?\n\nSee our [contact page](/contact).`;
  const warnings = scanHallucinations(markdown, evidence, ["/contact"]);
  assert.ok(!warnings.some((warning) => warning.code === "UNVERIFIED_TECHNICAL_CLAIM"));
});

test("a technical claim keeps its cited URL when the domain contains periods", () => {
  const sourceUrl = "https://www.epa.gov/bedbugs/controlling-bed-bugs-using-integrated-pest-management";
  const evidence = [{
    sourceUrl,
    claim: "Steam may control bed bug infestations when used correctly.",
  }];
  const markdown = `# Treatment\n\nSteam is effective against bed bugs according to [EPA guidance](${sourceUrl}).\n\n## FAQ\n\n### What next?\n\nSee our [contact page](/contact).`;
  const warnings = scanHallucinations(markdown, evidence, ["/contact"]);
  assert.ok(!warnings.some((warning) => warning.code === "UNVERIFIED_TECHNICAL_CLAIM"));
});

test("a cited source cannot justify a different treatment or an invented temperature", () => {
  const sourceUrl = "https://www.epa.gov/bedbugs/example";
  const evidence = [{
    sourceUrl,
    claim: "A high-temperature clothes dryer run for 30 minutes can kill bed bugs on suitable bedding and clothing.",
  }];
  const markdown = `# Treatment\n\nSteam at 130°F kills bed bugs ([EPA guidance](${sourceUrl})).\n\n## FAQ\n\n### What next?\n\nSee our [contact page](/contact).`;
  const warnings = scanHallucinations(markdown, evidence, ["/contact"]);
  assert.ok(warnings.some((warning) => warning.code === "UNVERIFIED_TECHNICAL_CLAIM"));
});

test("a source about controlling an infestation does not support an eradication guarantee", () => {
  const sourceUrl = "https://www.epa.gov/bedbugs/example";
  const evidence = [{ sourceUrl, claim: "Heat treatment can control bed bugs but leaves no residual protection." }];
  const markdown = `# Treatment\n\nHeat treatment completely eradicates bed bugs ([EPA guidance](${sourceUrl})).\n\n## FAQ\n\n### What next?\n\nSee our [contact page](/contact).`;
  const warnings = scanHallucinations(markdown, evidence, ["/contact"]);
  assert.ok(warnings.some((warning) => warning.code === "UNVERIFIED_TECHNICAL_CLAIM"));
});

test("unsupported complete prose is removed without deleting table or heading content", () => {
  const prose = "# Treatment\n\nHeat treatment completely eradicates bed bugs.\n\n| Method | Claim |\n| --- | --- |\n| Heat | Completely eradicates bed bugs |";
  const warnings = [{ risk: "HIGH", excerpt: "Heat treatment completely eradicates bed bugs." }, { risk: "HIGH", excerpt: "| Heat | Completely eradicates bed bugs |" }];
  const cleaned = removeUnsupportedProse(prose, warnings);
  assert.ok(!cleaned.includes("Heat treatment completely eradicates bed bugs."));
  assert.ok(cleaned.includes("| Heat | Completely eradicates bed bugs |"));
});

test("unsupported FAQ text stays visible to the publication gate", () => {
  const markdown = "# Treatment\n\nA useful planning step.\n\n## FAQs\n\n### What signs matter?\n\nA musty odor confirms bed bugs.";
  const warnings = scanHallucinations(markdown, [], []);
  assert.ok(warnings.some((warning) => warning.code === "UNVERIFIED_TECHNICAL_CLAIM"));
  assert.equal(removeUnsupportedProse(markdown, warnings), markdown);
});

test("unsupported natural remedy efficacy is flagged without explicit bed-bug words in its sentence", () => {
  const markdown = "# Bed bugs\n\nDiatomaceous earth can help with control.\n\n## FAQ\n\n### What next?\n\nSee [contact](/contact).";
  const warnings = scanHallucinations(markdown, [], ["/contact"]);
  assert.ok(warnings.some((warning) => warning.code === "UNVERIFIED_TECHNICAL_CLAIM"));
});

test("near-duplicate topics receive a high cannibalization risk", () => {
  const result = calculateCannibalization("Bed Bug Treatment in Pune", [{
    url: "/pune",
    title: "Bed Bug Treatment in Pune",
    topic: "bed bug treatment in Pune Maharashtra",
    source: "location",
  }]);
  assert.equal(result.risk, "HIGH");
  assert.equal(result.recommendedAction, "UPDATE_EXISTING");
});
