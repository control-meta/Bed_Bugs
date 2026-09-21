import { readLocalBlogs, saveBlog } from "../lib/blog-db";
import { findLocalAiImageUrls } from "../lib/blog/image-storage";

async function main(): Promise<void> {
  const localBlogs = readLocalBlogs();
  const affected = localBlogs.filter((blog) =>
    findLocalAiImageUrls({
      markdown: blog.markdown,
      imageUrl: blog.imageUrl || "",
      images: blog.images || [],
    }).length > 0,
  );

  console.log(`Found ${affected.length} blog(s) with local generated image URLs.`);
  for (const blog of affected) {
    const { blog: migrated, backend } = await saveBlog(blog);
    const remaining = findLocalAiImageUrls({
      markdown: migrated.markdown,
      imageUrl: migrated.imageUrl || "",
      images: migrated.images || [],
    });
    if (backend !== "supabase" || remaining.length > 0) {
      throw new Error(`Migration did not persist ${blog.slug} to Supabase with durable image URLs.`);
    }
    console.log(`Migrated ${blog.slug}`);
  }

  const migratedBlogs = readLocalBlogs();
  const publicUrls = Array.from(
    new Set(
      migratedBlogs.flatMap((blog) =>
        [blog.imageUrl || "", ...(blog.images || []).map((image) => image.url)].filter((url) =>
          url.includes("/storage/v1/object/public/blog-images/"),
        ),
      ),
    ),
  );

  for (const publicUrl of publicUrls) {
    const response = await fetch(publicUrl, { method: "HEAD" });
    if (!response.ok || !response.headers.get("content-type")?.startsWith("image/")) {
      throw new Error(`Public image verification failed (${response.status}): ${publicUrl}`);
    }
  }
  console.log(`Verified ${publicUrls.length} public image URL(s).`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
