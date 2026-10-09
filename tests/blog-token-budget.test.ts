import assert from "node:assert/strict";
import test from "node:test";
import { AUTO_BLOG_TOKEN_BUDGET, completionAllowance, totalAfterUsage } from "../lib/blog/token-budget";

test("scheduled blog reserves room for its independent review before requesting a draft", () => {
  const request = "x".repeat(6_400);
  const limit = completionAllowance({
    usedTokens: 8_000,
    serializedRequest: request,
    desiredCompletionTokens: 5_500,
    minimumCompletionTokens: 3_000,
    reserveAfterCall: 6_200,
  });
  assert.equal(limit, 3_499);
  assert.ok(limit <= 5_500);
  assert.ok(8_000 + Math.ceil(request.length / 3.2) + 300 + limit + 6_200 <= AUTO_BLOG_TOKEN_BUDGET);
});

test("scheduled blog blocks a paid stage when the required review cannot fit", () => {
  assert.throws(() => completionAllowance({
    usedTokens: 15_000,
    serializedRequest: "x".repeat(6_400),
    desiredCompletionTokens: 5_500,
    minimumCompletionTokens: 3_000,
    reserveAfterCall: 6_200,
  }), /Not enough/);
});

test("usage includes both input and output tokens returned by the API", () => {
  assert.equal(totalAfterUsage(12_000, { total_tokens: 3_750 }), 15_750);
  assert.throws(() => totalAfterUsage(12_000, null), /valid token usage/);
});
