import { saveBlog } from "./lib/blog-db";

async function run() {
  try {
    const { blog, backend } = await saveBlog({
      title: "Test Draft Title",
      slug: "test-draft-title",
      topic: "Test",
      primaryKeyword: "test",
      keywords: ["test"],
      markdown: "Hello world",
      excerpt: "Test excerpt",
      imageUrl: "/images/blogs/bed-bugs-pest-control.png",
      images: [],
      status: "draft",
      publicationStatus: "READY",
      autoPublishEligible: false,
      author: "Bed Bug Treatment Team",
      readTime: "9 min read"
    });
    console.log("Saved blog:", blog);
    console.log("Backend:", backend);
  } catch (e) {
    console.error(e);
  }
}
run();
