import fs from "node:fs/promises";
import path from "node:path";
import { getSupabase } from "../supabase";

const DEFAULT_BUCKET = "blog-images";
const LOCAL_AI_IMAGE_PATTERN = /\/images\/blogs\/ai\/[A-Za-z0-9][A-Za-z0-9._-]*\.(?:png|jpe?g|webp)/gi;

export type BlogImageReference = {
  url: string;
  alt?: string;
  title?: string;
};

export type BlogAssetReferences = {
  markdown: string;
  imageUrl: string;
  images: BlogImageReference[];
};

function storageBucketName(): string {
  return process.env.SUPABASE_BLOG_IMAGES_BUCKET?.trim() || DEFAULT_BUCKET;
}

function contentTypeFor(fileName: string): string {
  const extension = path.extname(fileName).toLowerCase();
  if (extension === ".jpg" || extension === ".jpeg") return "image/jpeg";
  if (extension === ".webp") return "image/webp";
  return "image/png";
}

export function findLocalAiImageUrls(references: BlogAssetReferences): string[] {
  const candidates = [
    references.markdown,
    references.imageUrl,
    ...references.images.map((image) => image.url),
  ];

  return Array.from(
    new Set(
      candidates.flatMap((value) => value.match(LOCAL_AI_IMAGE_PATTERN) || []),
    ),
  );
}

export function replaceBlogAssetUrls(
  references: BlogAssetReferences,
  replacements: ReadonlyMap<string, string>,
): BlogAssetReferences {
  const replace = (value: string): string => {
    let result = value;
    for (const [localUrl, publicUrl] of replacements) {
      result = result.split(localUrl).join(publicUrl);
    }
    return result;
  };

  return {
    markdown: replace(references.markdown),
    imageUrl: replace(references.imageUrl),
    images: references.images.map((image) => ({
      ...image,
      url: replace(image.url),
    })),
  };
}

async function ensurePublicBucket(): Promise<string> {
  const supabase = getSupabase();
  if (!supabase) {
    throw new Error("Supabase is not configured for durable blog image storage.");
  }

  const bucket = storageBucketName();
  const { data, error } = await supabase.storage.getBucket(bucket);

  if (error) {
    const statusCode = String((error as { statusCode?: string | number }).statusCode || "");
    if (statusCode !== "404" && !/not found/i.test(error.message)) {
      throw new Error(`Unable to inspect Supabase Storage bucket \"${bucket}\": ${error.message}`);
    }

    const { error: createError } = await supabase.storage.createBucket(bucket, {
      public: true,
      fileSizeLimit: 10 * 1024 * 1024,
      allowedMimeTypes: ["image/png", "image/jpeg", "image/webp"],
    });
    if (createError) {
      throw new Error(`Unable to create Supabase Storage bucket \"${bucket}\": ${createError.message}`);
    }
    return bucket;
  }

  if (!data.public) {
    const { error: updateError } = await supabase.storage.updateBucket(bucket, {
      public: true,
      fileSizeLimit: data.file_size_limit,
      allowedMimeTypes: data.allowed_mime_types,
    });
    if (updateError) {
      throw new Error(`Unable to make Supabase Storage bucket \"${bucket}\" public: ${updateError.message}`);
    }
  }

  return bucket;
}

async function uploadLocalAiImage(localUrl: string, bucket: string): Promise<string> {
  const supabase = getSupabase();
  if (!supabase) {
    throw new Error("Supabase is not configured for durable blog image storage.");
  }

  const fileName = path.basename(localUrl);
  const localPath = path.join(process.cwd(), "public", "images", "blogs", "ai", fileName);
  let file: Buffer;
  try {
    file = await fs.readFile(localPath);
  } catch {
    throw new Error(`Generated blog image is missing and cannot be published: ${localUrl}`);
  }

  let uploadFileName = fileName;
  let uploadFile = file;
  if (path.extname(fileName).toLowerCase() !== ".webp") {
    const sharp = (await import("sharp")).default;
    uploadFileName = `${path.basename(fileName, path.extname(fileName))}.webp`;
    uploadFile = await sharp(file)
      .rotate()
      .webp({ quality: 82, effort: 4, smartSubsample: true })
      .toBuffer();
  }

  return uploadBlogImageBuffer(uploadFileName, uploadFile, bucket);
}

export async function uploadBlogImageBuffer(
  fileName: string,
  file: Buffer,
  existingBucket?: string,
): Promise<string> {
  const supabase = getSupabase();
  if (!supabase) {
    throw new Error("Supabase is not configured for durable blog image storage.");
  }

  const bucket = existingBucket || await ensurePublicBucket();
  const safeFileName = path.basename(fileName);
  const objectPath = `generated/${safeFileName}`;
  const { error } = await supabase.storage.from(bucket).upload(objectPath, file, {
    contentType: contentTypeFor(safeFileName),
    cacheControl: "31536000",
    upsert: true,
  });
  if (error) {
    throw new Error(`Unable to upload generated blog image ${safeFileName}: ${error.message}`);
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(objectPath);
  if (!data.publicUrl.startsWith("https://")) {
    throw new Error(`Supabase Storage did not return a public URL for ${safeFileName}.`);
  }
  return data.publicUrl;
}

/**
 * Moves generated runtime files into durable public storage before a blog row is
 * written. If Supabase is not configured (for example, a local-only dev run),
 * the original local URLs remain usable from Next's public directory.
 */
export async function persistBlogAssetReferences(
  references: BlogAssetReferences,
): Promise<BlogAssetReferences> {
  const localUrls = findLocalAiImageUrls(references);
  if (localUrls.length === 0 || !getSupabase()) return references;

  const bucket = await ensurePublicBucket();
  const uploaded = await Promise.all(
    localUrls.map(async (localUrl) => [localUrl, await uploadLocalAiImage(localUrl, bucket)] as const),
  );

  return replaceBlogAssetUrls(references, new Map(uploaded));
}
