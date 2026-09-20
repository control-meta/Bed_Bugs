import { NextRequest, NextResponse } from "next/server";
import { getBlogById, saveBlog, deleteBlog } from "@/lib/blog-db";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const blog = await getBlogById(id);
    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }
    return NextResponse.json({ blog });
  } catch (err: any) {
    console.error("[api/admin/blogs/[id]] GET error:", err);
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const existing = await getBlogById(id);
    if (!existing) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    const body = await request.json();
    const updated = {
      ...existing,
      ...body,
      id, // ensure ID remains constant
      slug: body.slug ? body.slug.replace(/^\/|\/$/g, "") : existing.slug,
    };

    const { blog, backend } = await saveBlog(updated);
    return NextResponse.json({ success: true, blog, backend });
  } catch (err: any) {
    console.error("[api/admin/blogs/[id]] PUT error:", err);
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const success = await deleteBlog(id);
    return NextResponse.json({ success });
  } catch (err: any) {
    console.error("[api/admin/blogs/[id]] DELETE error:", err);
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
