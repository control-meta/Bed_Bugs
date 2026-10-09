export const BLOG_LENGTH_POLICY = {
  minimumWords: 1500,
  /** Aim a bit above the minimum: the sanitizer/link passes can trim some words. */
  targetMinimumWords: 1700,
  targetMaximumWords: 1950,
  maximumWords: 2400,
  /** Run a repair/expansion pass only if the edited article is below this. */
  expandBelowWords: 1700,
  /** Hard cap on total tokens (prompt + completion) across all calls. */
  tokenBudget: 22000,
} as const;

/** Count words visible to a reader, excluding Markdown syntax and URLs. */
export function countBlogWords(markdown: string): number {
  const visibleText = markdown
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/^\s{0,3}(?:#{1,6}|[-*+] |\d+[.)] )/gm, " ")
    .replace(/\|/g, " ")
    .replace(/[*_~`]/g, "")
    .replace(/https?:\/\/\S+/g, " ");

  return visibleText.match(/[\p{L}\p{N}]+(?:['’.-][\p{L}\p{N}]+)*/gu)?.length || 0;
}

export function isPublishableBlogLength(wordCount: number): boolean {
  return wordCount >= BLOG_LENGTH_POLICY.minimumWords && wordCount <= BLOG_LENGTH_POLICY.maximumWords;
}
