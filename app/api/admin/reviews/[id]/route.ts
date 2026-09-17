import { NextRequest, NextResponse } from "next/server";
import { updateReview, deleteReview } from "@/lib/reviews";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const updates: any = {};
    if (body.name !== undefined) updates.name = body.name;
    if (body.city !== undefined) updates.city = body.city || null;
    if (body.service !== undefined) updates.service = body.service || null;
    if (body.quote !== undefined) updates.quote = body.quote;
    if (body.rating !== undefined) {
      const ratingRaw = Number(body.rating);
      updates.rating = Math.min(5, Math.max(1, isNaN(ratingRaw) ? 5 : Math.round(ratingRaw)));
    }

    const updated = await updateReview(id, updates);
    
    if (!updated) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, review: updated });
  } catch (error: any) {
    console.error(`Error updating review:`, error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const deleted = await deleteReview(id);
    
    if (!deleted) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error(`Error deleting review:`, error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
