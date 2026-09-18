import { NextResponse } from "next/server";
import { scanAndSyncImages, getAllImagesSeo } from "@/lib/seo-db";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const scanResult = await scanAndSyncImages();
    const allImages = await getAllImagesSeo();

    return NextResponse.json({
      success: true,
      added: scanResult.added,
      total: scanResult.total,
      images: allImages.images,
      isSupabase: allImages.isSupabase,
    });
  } catch (err: any) {
    console.error("Error in POST /api/admin/seo/scan:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to scan images" },
      { status: 500 },
    );
  }
}
