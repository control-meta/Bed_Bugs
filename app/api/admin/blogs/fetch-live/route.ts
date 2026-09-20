import { NextResponse } from "next/server";
import { fetchTopBlogs } from "@/scripts/fetch-top-blogs";

export async function POST() {
  try {
    const blogs = await fetchTopBlogs();
    return NextResponse.json({
      success: true,
      count: blogs.length,
      message: `Successfully fetched and saved ${blogs.length} blogs with images`,
    });
  } catch (err: any) {
    console.error("[api/admin/blogs/fetch-live] Error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to fetch live blogs" },
      { status: 500 }
    );
  }
}
