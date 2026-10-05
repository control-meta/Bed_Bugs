import assert from "node:assert/strict";
import test from "node:test";
import { moveInternalLinksToRelatedGuides } from "../lib/blog/internal-linking";

test("internal guide links are collected above the references section", () => {
  const markdown = [
    "# Article",
    "",
    "Read the [inspection guide](/inspection) and [treatment guide](/services).",
    "",
    "## References & Verified Sources",
    "",
    "- Verified source",
  ].join("\n");

  const result = moveInternalLinksToRelatedGuides(markdown);
  assert.match(result, /## Related Guides/);
  assert.ok(result.indexOf("## Related Guides") < result.indexOf("## References & Verified Sources"));
  assert.doesNotMatch(result.slice(0, result.indexOf("## Related Guides")), /\]\(\/inspection\)/);
  assert.match(result, /- \[inspection guide\]\(\/inspection\)/);
});
