import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import type OpenAI from "openai";
import sharp from "sharp";
import {
  buildBlogImagePlan,
  buildOpenAIImageRequest,
  DEFAULT_BLOG_IMAGE_MODEL,
  DEFAULT_BLOG_IMAGE_QUALITY,
  generateFreshBlogImage,
  normalizeBlogImageModel,
} from "../lib/blog/ai-image-generator";
import {
  findLocalAiImageUrls,
  replaceBlogAssetUrls,
} from "../lib/blog/image-storage";

test("image plan uses the article topic for the hero and a real article section for the middle image", () => {
  const topic = "How Bed Bugs Spread in High-Rise Apartment Buildings";
  const articleMarkdown = `
# ${topic}

Introduction.

## Shared Walls and Utility Shafts

Details.

## Lifts, Luggage, and Common Areas

Details.

## A Room-by-Room Inspection Protocol

Details.

## Frequently Asked Questions
`;

  const plan = buildBlogImagePlan({
    topic,
    keywords: ["high-rise bed bugs", "apartment inspection"],
    articleMarkdown,
  });

  assert.equal(plan.top.label, topic);
  assert.equal(plan.middle.label, "Lifts, Luggage, and Common Areas");
  assert.match(plan.top.visualFocus, /high-rise bed bugs/i);
  assert.match(plan.middle.visualFocus, /main topic/i);
  assert.notEqual(plan.top.visualFocus, plan.middle.visualFocus);
});

test("GPT Image request reserves natural photo space, forbids banners and lettering, and omits unsupported response_format", () => {
  const topic = "Bed Bug Mattress Encasements: Do They Really Work?";
  const plan = buildBlogImagePlan({ topic });
  const request = buildOpenAIImageRequest(
    topic,
    ["mattress encasements"],
    plan.top,
    DEFAULT_BLOG_IMAGE_MODEL,
    "regression-test-request",
  );

  assert.equal(request.model, DEFAULT_BLOG_IMAGE_MODEL);
  assert.equal(request.quality, DEFAULT_BLOG_IMAGE_QUALITY);
  assert.equal(request.size, "1536x1024");
  assert.equal(request.output_format, "webp");
  assert.equal(request.output_compression, 80);
  assert.ok(!("response_format" in request));
  assert.match(request.prompt, /naturally uncluttered upper third/i);
  assert.match(request.prompt, /Do not create a banner, title card, white strip/i);
  assert.match(request.prompt, /application will add the exact headline/i);
  assert.match(request.prompt, /Do not render letters, words, numbers/i);
  assert.match(request.prompt, /Do not imitate or reuse a previously published blog image/i);
  assert.match(request.prompt, new RegExp(topic.replace(/[?]/g, "\\?")));
});

test("unknown client-supplied image models cannot bypass the supported GPT Image list", () => {
  assert.equal(DEFAULT_BLOG_IMAGE_MODEL, "gpt-image-2.5-flare");
  assert.equal(DEFAULT_BLOG_IMAGE_QUALITY, "low");
  assert.equal(normalizeBlogImageModel("made-up-image-model"), DEFAULT_BLOG_IMAGE_MODEL);
  assert.equal(normalizeBlogImageModel("gpt-image-2.5-flare"), "gpt-image-2.5-flare");
});

test("generated base64 image receives a text overlay and a unique local AI asset path", async () => {
  const sourceImage = await sharp({
    create: {
      width: 1536,
      height: 1024,
      channels: 3,
      background: { r: 210, g: 225, b: 215 },
    },
  }).png().toBuffer();
  const requests: Record<string, unknown>[] = [];
  const openai = {
    images: {
      generate: async (request: Record<string, unknown>) => {
        requests.push(request);
        return {
          created: Math.floor(Date.now() / 1000),
          data: [{ b64_json: sourceImage.toString("base64") }],
        };
      },
    },
  } as unknown as OpenAI;
  const topic = "Bed Bug Inspection Checklist for Apartments";
  const plan = buildBlogImagePlan({ topic });
  let savedPath = "";

  try {
    const image = await generateFreshBlogImage({
      openai,
      topic,
      spec: plan.top,
      requestNonce: "mock-image-request",
    });
    savedPath = path.join(process.cwd(), "public", image.url);
    const metadata = await sharp(savedPath).metadata();

    assert.match(image.url, /^\/images\/blogs\/ai\/ai-top-[a-f0-9-]+\.webp$/);
    assert.equal(metadata.width, 1536);
    assert.equal(metadata.height, 1024);
    assert.equal(metadata.format, "webp");
    assert.equal(requests.length, 1);
    assert.ok(!("response_format" in requests[0]));
    assert.notDeepEqual(await fs.promises.readFile(savedPath), sourceImage);
  } finally {
    if (savedPath) await fs.promises.unlink(savedPath).catch(() => {});
  }
});

test("published blog asset references are consistently replaced with durable URLs", () => {
  const hero = "/images/blogs/ai/ai-top-test.png";
  const middle = "/images/blogs/ai/ai-mid-test.webp";
  const references = {
    markdown: `![Hero](${hero})\n\nArticle copy.\n\n![Middle](${middle})`,
    imageUrl: hero,
    images: [
      { url: hero, alt: "Hero" },
      { url: middle, alt: "Middle" },
    ],
  };

  assert.deepEqual(findLocalAiImageUrls(references), [hero, middle]);

  const durableHero = "https://example.supabase.co/storage/v1/object/public/blog-images/generated/hero.png";
  const durableMiddle = "https://example.supabase.co/storage/v1/object/public/blog-images/generated/middle.webp";
  const replaced = replaceBlogAssetUrls(
    references,
    new Map([
      [hero, durableHero],
      [middle, durableMiddle],
    ]),
  );

  assert.equal(replaced.imageUrl, durableHero);
  assert.deepEqual(replaced.images.map((image) => image.url), [durableHero, durableMiddle]);
  assert.match(replaced.markdown, new RegExp(durableHero.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(replaced.markdown, new RegExp(durableMiddle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.doesNotMatch(replaced.markdown, /\/images\/blogs\/ai\//);
});
