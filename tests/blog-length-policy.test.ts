import assert from "node:assert/strict";
import test from "node:test";
import {
  BLOG_LENGTH_POLICY,
  countBlogWords,
  isPublishableBlogLength,
} from "../lib/blog/length-policy";

test("word counter measures reader-visible Markdown words", () => {
  assert.equal(
    countBlogWords("# Heading\n\nA useful [guide](/services) with ![diagram](/image.webp)."),
    5,
  );
});

test("blog length policy accepts requested long-form range and rejects short or padded output", () => {
  assert.equal(BLOG_LENGTH_POLICY.minimumWords, 1500);
  assert.ok(isPublishableBlogLength(1780));
  assert.ok(isPublishableBlogLength(2034));
  assert.ok(!isPublishableBlogLength(1499));
  assert.ok(!isPublishableBlogLength(2101));
});
