import { NextRequest, NextResponse } from "next/server";
import { getAllBlogs, saveBlog } from "@/lib/blog-db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || undefined;
    const status = searchParams.get("status") || undefined;

    const blogs = await getAllBlogs({ search, status });
    return NextResponse.json({ blogs, total: blogs.length });
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
