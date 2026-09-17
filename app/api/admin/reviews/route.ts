import { NextRequest, NextResponse } from "next/server";
import { getReviews, createReview } from "@/lib/reviews";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get("limit");
    const limit = limitParam ? parseInt(limitParam, 10) : undefined;

    const data = await getReviews({ limit });
    return NextResponse.json({ success: true, ...data });
  } catch (error: any) {
    console.error("Error in GET /api/admin/reviews:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.quote || !body.rating) {
      return NextResponse.json({ error: "Missing required fields (name, quote, rating)." }, { status: 400 });
    }

    const ratingRaw = Number(body.rating);
    const rating = Math.min(5, Math.max(1, isNaN(ratingRaw) ? 5 : Math.round(ratingRaw)));

    const newReview = await createReview({
      name: body.name,
      city: body.city || undefined,
      service: body.service || undefined,
      quote: body.quote,
      rating,
    });

    return NextResponse.json({ success: true, review: newReview }, { status: 201 });
  } catch (error: any) {
    console.error("Error in POST /api/admin/reviews:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
