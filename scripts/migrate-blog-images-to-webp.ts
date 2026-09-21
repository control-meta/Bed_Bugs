import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { getAllBlogs, saveBlog } from "../lib/blog-db";
import {
  replaceBlogAssetUrls,
  uploadBlogImageBuffer,
} from "../lib/blog/image-storage";

const DURABLE_GENERATED_IMAGE = /\/storage\/v1\/object\/public\/blog-images\/generated\/[^?#]+\.(?:png|jpe?g)(?:[?#].*)?$/i;

async function sourceImage(url: string): Promise<Buffer> {
  const fileName = path.basename(new URL(url).pathname);
  const localPath = path.join(process.cwd(), "public", "images", "blogs", "ai", fileName);
  try {
    return await fs.readFile(localPath);
  } catch {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) throw new Error(`Unable to download ${url}: HTTP ${response.status}`);
    return Buffer.from(await response.arrayBuffer());
  }
}

async function main(): Promise<void> {
  const blogs = await getAllBlogs();
  const sourceUrls = Array.from(
    new Set(
      blogs.flatMap((blog) =>
        [blog.imageUrl || "", ...(blog.images || []).map((image) => image.url)]
          .filter((url) => DURABLE_GENERATED_IMAGE.test(url)),
      ),
    ),
  );

  console.log(`Found ${sourceUrls.length} published generated image(s) to optimize.`);
  const replacements = new Map<string, string>();
  let originalBytes = 0;
  let optimizedBytes = 0;

  for (const sourceUrl of sourceUrls) {
    const original = await sourceImage(sourceUrl);
    const originalName = path.basename(new URL(sourceUrl).pathname);
    const webpName = `${path.basename(originalName, path.extname(originalName))}.webp`;
    const optimized = await sharp(original)
      .rotate()
      .resize({ width: 1536, height: 1024, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 82, effort: 4, smartSubsample: true })
      .toBuffer();
    const publicUrl = await uploadBlogImageBuffer(webpName, optimized);

    await fs.writeFile(
      path.join(process.cwd(), "public", "images", "blogs", "ai", webpName),
      optimized,
    );
    replacements.set(sourceUrl, publicUrl);
    originalBytes += original.length;
    optimizedBytes += optimized.length;
    console.log(`${originalName}: ${original.length} -> ${optimized.length} bytes`);
  }

  const affected = blogs.filter((blog) =>
    [blog.markdown, blog.imageUrl || "", ...(blog.images || []).map((image) => image.url)]
      .some((value) => Array.from(replacements.keys()).some((sourceUrl) => value.includes(sourceUrl))),
  );

  for (const blog of affected) {
    const assets = replaceBlogAssetUrls({
      markdown: blog.markdown,
      imageUrl: blog.imageUrl || "",
      images: blog.images || [],
    }, replacements);
    const { backend } = await saveBlog({
      ...blog,
      ...assets,
    });
    if (backend !== "supabase") {
      throw new Error(`Failed to persist optimized image URLs for ${blog.slug}.`);
    }
    console.log(`Updated ${blog.slug}`);
  }

  for (const publicUrl of replacements.values()) {
    const response = await fetch(publicUrl, { method: "HEAD" });
    if (!response.ok || response.headers.get("content-type") !== "image/webp") {
      throw new Error(`WebP verification failed (${response.status}): ${publicUrl}`);
    }
  }

  const reduction = originalBytes
    ? Math.round((1 - optimizedBytes / originalBytes) * 100)
    : 0;
  console.log(
    `Optimized ${sourceUrls.length} image(s): ${originalBytes} -> ${optimizedBytes} bytes (${reduction}% smaller).`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
