import crypto from "crypto";
import fs from "fs";
import path from "path";
import type OpenAI from "openai";
import type { ImageGenerateParamsNonStreaming } from "openai/resources/images";
import type { BlogImage } from "./image-selector";
import {
  DEFAULT_BLOG_IMAGE_MODEL,
  DEFAULT_BLOG_IMAGE_QUALITY,
} from "./image-model-config";

export { DEFAULT_BLOG_IMAGE_MODEL, DEFAULT_BLOG_IMAGE_QUALITY } from "./image-model-config";

const SUPPORTED_GPT_IMAGE_MODELS = new Set([
  "gpt-image-1",
  "gpt-image-1-mini",
  "gpt-image-1.5",
  "gpt-image-2",
  "gpt-image-2-2026-04-21",
  "gpt-image-2.5-sunburst",
  "gpt-image-2.5-sunburst-2026-09-08",
  "gpt-image-2.5-flare",
  "gpt-image-2.5-flare-2026-09-08",
]);

type RecommendedVisual = {
  visualDescription?: string;
  altText?: string;
};

export type BlogImageSpec = {
  role: "top" | "middle";
  label: string;
  visualFocus: string;
  alt: string;
  caption: string;
};

type BlogImagePlanInput = {
  topic: string;
  keywords?: string[];
  articleMarkdown?: string;
  recommendedVisuals?: RecommendedVisual[];
};

type GenerateImageInput = {
  openai: OpenAI;
  model?: string;
  topic: string;
  keywords?: string[];
  spec: BlogImageSpec;
  signal?: AbortSignal;
  requestNonce?: string;
};

type GenerateImagesInput = Omit<GenerateImageInput, "spec" | "requestNonce"> & BlogImagePlanInput;

function cleanInlineText(value: string, maxLength: number): string {
  const cleaned = value
    .replace(/[#*_`[\]()]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (cleaned.length <= maxLength) return cleaned;
  const shortened = cleaned.slice(0, maxLength + 1);
  const lastSpace = shortened.lastIndexOf(" ");
  return `${shortened.slice(0, lastSpace > 30 ? lastSpace : maxLength).trim()}…`;
}

function extractUsefulHeadings(markdown: string): string[] {
  const excluded = /^(references|sources|frequently asked questions|faqs?|conclusion)$/i;

  return Array.from(markdown.matchAll(/^##\s+(.+)$/gm))
    .map((match) => cleanInlineText(match[1], 90))
    .filter((heading) => heading && !excluded.test(heading));
}

export function buildBlogImagePlan({
  topic,
  keywords = [],
  articleMarkdown = "",
  recommendedVisuals = [],
}: BlogImagePlanInput): { top: BlogImageSpec; middle: BlogImageSpec } {
  const cleanTopic = cleanInlineText(topic || "Bed Bug Treatment Guide", 105);
  const headings = extractUsefulHeadings(articleMarkdown);
  const middleHeading = headings.length
    ? headings[Math.min(headings.length - 1, Math.floor(headings.length / 2))]
    : "Bed Bug Inspection and Treatment Steps";
  const keywordContext = keywords.map((keyword) => cleanInlineText(keyword, 50)).filter(Boolean).join(", ");
  const topRecommendation = cleanInlineText(recommendedVisuals[0]?.visualDescription || "", 240);
  const middleRecommendation = cleanInlineText(recommendedVisuals[1]?.visualDescription || "", 240);

  return {
    top: {
      role: "top",
      label: cleanTopic,
      visualFocus: topRecommendation || [
        `Create the lead editorial visual for the article topic: "${cleanTopic}".`,
        keywordContext ? `The visual must clearly reflect these concepts: ${keywordContext}.` : "",
        "Choose the people, room, tools, evidence, and action that most directly explain this exact topic in an Indian residential setting.",
      ].filter(Boolean).join(" "),
      alt: cleanInlineText(recommendedVisuals[0]?.altText || `${cleanTopic} illustrated guide`, 160),
      caption: `AI-generated visual created specifically for ${cleanTopic}`,
    },
    middle: {
      role: "middle",
      label: middleHeading,
      visualFocus: middleRecommendation || [
        `Create an explanatory editorial visual for the article section: "${middleHeading}".`,
        `Keep it specifically connected to the main topic: "${cleanTopic}".`,
        "Show a different scene and camera angle from the lead image, with useful inspection evidence, treatment equipment, or prevention actions appropriate to this section.",
      ].join(" "),
      alt: cleanInlineText(recommendedVisuals[1]?.altText || `${middleHeading} — ${cleanTopic}`, 160),
      caption: `AI-generated visual for ${middleHeading}`,
    },
  };
}

export function normalizeBlogImageModel(model?: string): string {
  return model && SUPPORTED_GPT_IMAGE_MODELS.has(model)
    ? model
    : DEFAULT_BLOG_IMAGE_MODEL;
}

export function buildOpenAIImageRequest(
  topic: string,
  keywords: string[],
  spec: BlogImageSpec,
  model = DEFAULT_BLOG_IMAGE_MODEL,
  requestNonce: string = crypto.randomUUID(),
): ImageGenerateParamsNonStreaming {
  const exactLabel = cleanInlineText(spec.label, 105);
  const keywordContext = keywords.map((keyword) => cleanInlineText(keyword, 50)).filter(Boolean).join(", ");

  return {
    model: normalizeBlogImageModel(model),
    prompt: [
      "Create a new, original, professional landscape editorial image for a bed bug education article.",
      `Article topic: "${cleanInlineText(topic, 140)}".`,
      keywordContext ? `Relevant article keywords: ${keywordContext}.` : "",
      `Visual direction: ${spec.visualFocus}`,
      `This is the ${spec.role === "top" ? "lead hero" : "in-article section"} image, so make the scene immediately useful and specific to the quoted content.`,
      "Use a realistic modern Indian home or apartment where relevant. Keep bed bugs anatomically plausible and small; avoid giant insects, gore, fear imagery, logos, watermarks, or unrelated pests.",
      "Compose the photograph with a naturally uncluttered upper third, such as a plain wall or softly out-of-focus room background, so a headline can be placed directly over the photo. Keep the main people, insects, tools, and evidence below or to the right of that space.",
      "The photograph must remain continuous from edge to edge. Do not create a banner, title card, white strip, solid panel, frame, border, or divider anywhere in the image.",
      `The application will add the exact headline "${exactLabel}" after generation. Do not render letters, words, numbers, signs, labels, logos, captions, or watermarks anywhere in the image.`,
      `Fresh-composition request ID: ${requestNonce}. Do not imitate or reuse a previously published blog image.`,
    ].filter(Boolean).join("\n"),
    n: 1,
    size: "1536x1024",
    quality: DEFAULT_BLOG_IMAGE_QUALITY,
    output_format: "webp",
    output_compression: 80,
  };
}

function wrapText(text: string, maxChars: number, maxLines: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length > maxChars && current) {
      lines.push(current);
      current = word;
      if (lines.length === maxLines - 1) break;
    } else {
      current = candidate;
    }
  }

  if (current && lines.length < maxLines) lines.push(current);
  const consumedWords = lines.join(" ").split(/\s+/).length;
  if (consumedWords < words.length && lines.length) {
    lines[lines.length - 1] = `${lines[lines.length - 1].replace(/[.,;:!?…-]+$/, "")}…`;
  }
  return lines;
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function buildTextOverlaySvg(label: string, imageWidth: number, imageHeight: number): string {
  const horizontalPadding = Math.round(imageWidth * 0.052);
  const availableTextWidth = imageWidth - horizontalPadding * 2;
  const maxFontSize = Math.round(imageWidth * 0.041);
  const minFontSize = Math.round(imageWidth * 0.03);
  let fontSize = maxFontSize;
  let lines: string[] = [];

  while (fontSize >= minFontSize) {
    const maxCharsPerLine = Math.max(24, Math.floor(availableTextWidth / (fontSize * 0.56)));
    lines = wrapText(label, maxCharsPerLine, 3);
    if (lines.length <= 2 || fontSize === minFontSize) break;
    fontSize -= 2;
  }

  const lineHeight = Math.round(fontSize * 1.16);
  const firstBaseline = Math.round(imageHeight * 0.075 + fontSize);
  const strokeWidth = Math.max(3, Math.round(imageWidth * 0.0026));
  const textElements = lines.map((line, index) => (
    `<text x="${horizontalPadding}" y="${firstBaseline + index * lineHeight}" ` +
    `font-family="DejaVu Sans,Liberation Sans,Arial,Helvetica,sans-serif" ` +
    `font-size="${fontSize}" font-weight="700" letter-spacing="-1" ` +
    `fill="#ffffff" stroke="#102a43" stroke-width="${strokeWidth}" ` +
    `stroke-linejoin="round" paint-order="stroke fill" filter="url(#title-shadow)">${escapeXml(line)}</text>`
  )).join("\n");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${imageWidth}" height="${imageHeight}">
  <defs>
    <filter id="title-shadow" x="-20%" y="-20%" width="140%" height="150%">
      <feDropShadow dx="0" dy="4" stdDeviation="5" flood-color="#000000" flood-opacity="0.58"/>
    </filter>
  </defs>
  ${textElements}
</svg>`;
}

export async function applyBlogImageTextOverlay(original: Buffer, label: string): Promise<Buffer> {
  const sharp = (await import("sharp")).default;
  const metadata = await sharp(original).metadata();
  const imageWidth = metadata.width;
  const imageHeight = metadata.height;

  if (!imageWidth || !imageHeight) {
    throw new Error("OpenAI returned image data with invalid dimensions.");
  }

  const overlay = Buffer.from(buildTextOverlaySvg(label, imageWidth, imageHeight));
  return sharp(original)
    .composite([{ input: overlay, top: 0, left: 0 }])
    .webp({ quality: 82, effort: 4, smartSubsample: true })
    .toBuffer();
}

async function getGeneratedImageBuffer(response: Awaited<ReturnType<OpenAI["images"]["generate"]>>): Promise<Buffer> {
  if (!("data" in response)) {
    throw new Error("OpenAI returned an image stream instead of a completed image.");
  }

  const generated = response.data?.[0];
  if (generated?.b64_json) {
    const buffer = Buffer.from(generated.b64_json, "base64");
    if (buffer.length > 0) return buffer;
  }

  if (generated?.url) {
    const fetched = await fetch(generated.url, { cache: "no-store" });
    if (!fetched.ok) {
      throw new Error(`OpenAI image download failed with HTTP ${fetched.status}.`);
    }
    return Buffer.from(await fetched.arrayBuffer());
  }

  throw new Error("OpenAI returned no image data.");
}

export async function generateFreshBlogImage({
  openai,
  model,
  topic,
  keywords = [],
  spec,
  signal,
  requestNonce,
}: GenerateImageInput): Promise<BlogImage> {
  const request = buildOpenAIImageRequest(topic, keywords, spec, model, requestNonce);
  const response = await openai.images.generate(request, signal ? { signal } : undefined);
  const original = await getGeneratedImageBuffer(response);
  const composited = await applyBlogImageTextOverlay(original, spec.label);

  const prefix = spec.role === "top" ? "ai-top" : "ai-mid";
  const fileName = `${prefix}-${crypto.randomUUID()}.webp`;
  const outputDirectory = path.join(process.cwd(), "public", "images", "blogs", "ai");
  const outputPath = path.join(outputDirectory, fileName);
  await fs.promises.mkdir(outputDirectory, { recursive: true });
  await fs.promises.writeFile(outputPath, composited, { flag: "wx" });

  return {
    url: `/images/blogs/ai/${fileName}`,
    alt: spec.alt,
    caption: spec.caption,
    role: spec.role,
  };
}

export async function generateFreshBlogImages({
  openai,
  model,
  topic,
  keywords = [],
  articleMarkdown = "",
  recommendedVisuals = [],
  signal,
}: GenerateImagesInput): Promise<{ topImage: BlogImage; midImage: BlogImage }> {
  const plan = buildBlogImagePlan({ topic, keywords, articleMarkdown, recommendedVisuals });
  const requestNonce = crypto.randomUUID();

  try {
    const [topImage, midImage] = await Promise.all([
      generateFreshBlogImage({
        openai,
        model,
        topic,
        keywords,
        spec: plan.top,
        signal,
        requestNonce: `${requestNonce}-hero`,
      }),
      generateFreshBlogImage({
        openai,
        model,
        topic,
        keywords,
        spec: plan.middle,
        signal,
        requestNonce: `${requestNonce}-section`,
      }),
    ]);

    return { topImage, midImage };
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Unknown OpenAI image error";
    throw new Error(
      `Fresh OpenAI image generation failed. The blog was not completed because reusing an existing image is disabled. ${detail}`,
    );
  }
}
