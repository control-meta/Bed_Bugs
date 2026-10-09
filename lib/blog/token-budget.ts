export const AUTO_BLOG_TOKEN_BUDGET = 19_999;

/** Leave room for the response and required later stages before making a paid call. */
export function completionAllowance(input: {
  usedTokens: number;
  serializedRequest: string;
  desiredCompletionTokens: number;
  minimumCompletionTokens: number;
  reserveAfterCall?: number;
}): number {
  const estimatedInputTokens = Math.ceil(input.serializedRequest.length / 3.2) + 300;
  const limit = Math.min(
    input.desiredCompletionTokens,
    AUTO_BLOG_TOKEN_BUDGET - input.usedTokens - estimatedInputTokens - (input.reserveAfterCall || 0),
  );
  if (limit < input.minimumCompletionTokens) {
    throw new Error(
      `Not enough of the ${AUTO_BLOG_TOKEN_BUDGET}-token budget remains for this stage and its required review ` +
      `(used=${input.usedTokens}, estimatedInput=${estimatedInputTokens}, reserved=${input.reserveAfterCall || 0}, availableCompletion=${Math.max(0, limit)}).`,
    );
  }
  return limit;
}

export function totalAfterUsage(current: number, usage?: { total_tokens?: number | null } | null): number {
  const tokens = usage?.total_tokens;
  if (typeof tokens !== "number" || !Number.isFinite(tokens) || tokens < 0) {
    throw new Error("The API did not return valid token usage; publication was blocked.");
  }
  return current + tokens;
}
