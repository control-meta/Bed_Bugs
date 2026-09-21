import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { EDITOR_SYSTEM_PROMPT } from "../lib/blog/editor-prompt";
import { buildTopicEditorialRequirements } from "../lib/blog/editorial-standards";
import { buildInformationGainPlan } from "../lib/blog/information-gain-planner";

test("professional treatment preparation gets a dedicated actionable structure", () => {
  const requirements = buildTopicEditorialRequirements(
    "How to Prepare Your Home for Professional Bed Bug Treatment",
  );
  const plan = buildInformationGainPlan(
    "How to Prepare Your Home for Professional Bed Bug Treatment",
  );

  assert.match(requirements, /Before Bed Bug Treatment: Quick Checklist/);
  assert.match(requirements, /DO vs DON'T/);
  assert.match(requirements, /pets, aquariums, electronics/);
  assert.match(requirements, /provider's written preparation instructions/i);
  assert.match(requirements, /should not be moved from the infested room/i);
  assert.ok(plan.uniqueUsefulElements.includes("24 hours before treatment and treatment-day checklists"));
  assert.ok(plan.contentGaps.some((gap) => /prevent accidental spread/i.test(gap)));
});

test("unrelated topics are not forced into the preparation template", () => {
  const requirements = buildTopicEditorialRequirements("Bed Bug Bites vs Mosquito Bites");
  const plan = buildInformationGainPlan("Bed Bug Treatment Cost in India");

  assert.doesNotMatch(requirements, /24 hours before treatment/);
  assert.doesNotMatch(requirements, /room-by-room preparation/);
  assert.ok(plan.uniqueUsefulElements.some((element) => /Pricing variables breakdown/i.test(element)));
  assert.ok(!plan.uniqueUsefulElements.some((element) => /Mattress seam and tuft inspection/i.test(element)));
});

test("blog prompts optimize for information density instead of a word-count quota", () => {
  const routeSource = fs.readFileSync(
    path.join(process.cwd(), "app", "api", "admin", "blog", "generate", "route.ts"),
    "utf8",
  );

  assert.doesNotMatch(EDITOR_SYSTEM_PROMPT, /minimum 2,000 words/i);
  assert.doesNotMatch(routeSource, /MANDATORY\s*>?=\s*2,000 WORDS/i);
  assert.doesNotMatch(routeSource, /MINIMUM of 4 contextual markdown hyperlinks/i);
  assert.doesNotMatch(routeSource, /usedEvidenceIds\.add\("E001"\)/);
  assert.match(EDITOR_SYSTEM_PROMPT, /95\+ ACCEPTANCE RULE/);
  assert.match(routeSource, /Cite only URLs present in the evidence contract/);
  assert.match(routeSource, /item\.sourceUrl === source\.url/);
});
