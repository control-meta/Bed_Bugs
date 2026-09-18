import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getLocationPage, saveLocationPage } from "@/lib/locations-db";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function GET(request: NextRequest, { params }: Props) {
  try {
    const { slug } = await params;
    const location = await getLocationPage(slug);

    if (!location) {
      return NextResponse.json({ error: "Location page not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, location });
  } catch (error: any) {
    console.error(`Error in GET /api/admin/locations/[slug]:`, error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: Props) {
  try {
    const { slug } = await params;
    const body = await request.json();

    const updated = await saveLocationPage(slug, body);

    // Instant revalidation of both the specific city page and dynamic route
    try {
      revalidatePath(`/${slug}`);
      revalidatePath("/[city]", "page");
    } catch (revalidateError) {
      console.warn("Failed to revalidate path:", revalidateError);
    }

    return NextResponse.json({
      success: true,
      message: `Location page for ${updated.name} published successfully.`,
      location: updated,
    });
  } catch (error: any) {
    console.error(`Error in PUT /api/admin/locations/[slug]:`, error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
