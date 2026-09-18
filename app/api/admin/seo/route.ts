import { NextResponse } from "next/server";
import {
  getAllPagesSeo,
  getAllImagesSeo,
  savePageSeo,
  saveImageSeo,
  bulkSaveImagesSeo,
  PageSeoItem,
  ImageSeoItem,
} from "@/lib/seo-db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [pagesResult, imagesResult] = await Promise.all([
      getAllPagesSeo(),
      getAllImagesSeo(),
    ]);

    return NextResponse.json({
      success: true,
      pages: pagesResult.pages,
      images: imagesResult.images,
      isSupabase: pagesResult.isSupabase || imagesResult.isSupabase,
    });
  } catch (err: any) {
    console.error("Error in GET /api/admin/seo:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to load SEO data" },
      { status: 500 },
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { type } = body;

    if (type === "page" && body.page) {
      const result = await savePageSeo(body.page as PageSeoItem);
      return NextResponse.json({
        success: true,
        type: "page",
        page: result.page,
        isSupabase: result.isSupabase,
      });
    }

    if (type === "image" && body.image) {
      const result = await saveImageSeo(body.image as ImageSeoItem);
      return NextResponse.json({
        success: true,
        type: "image",
        image: result.image,
        isSupabase: result.isSupabase,
      });
    }

    if (type === "bulk_images" && Array.isArray(body.images)) {
      const result = await bulkSaveImagesSeo(body.images as ImageSeoItem[]);
      return NextResponse.json({
        success: true,
        type: "bulk_images",
        count: result.count,
        isSupabase: result.isSupabase,
      });
    }

    return NextResponse.json(
      { success: false, error: "Invalid payload or type specified" },
      { status: 400 },
    );
  } catch (err: any) {
    console.error("Error in PUT /api/admin/seo:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to update SEO data" },
      { status: 500 },
    );
  }
}
