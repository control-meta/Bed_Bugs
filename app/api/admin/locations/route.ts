import { NextRequest, NextResponse } from "next/server";
import { getAllLocationPages, saveLocationPage } from "@/lib/locations-db";

export async function GET() {
  try {
    const locations = await getAllLocationPages();
    return NextResponse.json({
      success: true,
      locations: locations.map((loc) => ({
        slug: loc.slug,
        name: loc.name,
        state: loc.state,
        status: loc.status || "published",
        updatedAt: loc.updatedAt,
      })),
    });
  } catch (error: any) {
    console.error("Error in GET /api/admin/locations:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.slug || !body.name || !body.state) {
      return NextResponse.json(
        { error: "Missing required fields: slug, name, and state." },
        { status: 400 },
      );
    }

    const saved = await saveLocationPage(body.slug, body);
    return NextResponse.json({ success: true, location: saved }, { status: 201 });
  } catch (error: any) {
    console.error("Error in POST /api/admin/locations:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
