import { NextRequest, NextResponse } from "next/server";
import { getAllBlogs, saveBlog } from "@/lib/blog-db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || undefined;
    const status = searchParams.get("status") || undefined;

    // Fetch all blogs matching the search query to compute overall stats
    const allBlogsForSearch = await getAllBlogs({ search });
    const stats = {
      total: allBlogsForSearch.length,
      published: allBlogsForSearch.filter((b) => b.status === "published").length,
      draft: allBlogsForSearch.filter((b) => b.status === "draft").length,
    };

    // Filter by status if specified and not 'all'
    const blogs =
      status && status !== "all"
        ? allBlogsForSearch.filter((b) => b.status === status)
        : allBlogsForSearch;

    return NextResponse.json({ blogs, total: blogs.length, stats });
  } catch (err: any) {
    console.error("[api/admin/blogs] GET error:", err);
    return NextResponse.json({ error: err.message || "Failed to fetch blogs" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.title || !body.slug) {
      return NextResponse.json({ error: "Title and slug are required" }, { status: 400 });
    }

    const { blog, backend } = await saveBlog(body);
    return NextResponse.json({ success: true, blog, backend });
  } catch (err: any) {
    console.error("[api/admin/blogs] POST error:", err);
    return NextResponse.json({ error: err.message || "Failed to save blog" }, { status: 500 });
  }
}
