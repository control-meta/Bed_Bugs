import { NextRequest, NextResponse } from "next/server";
import { getReviews, createReview } from "@/lib/reviews";

export const dynamic = "force-dynamic";
export const revalidate = 0;
import {
  checkSubmissionRateLimit,
  getClientIp,
  isHoneypotTriggered,
  sanitizeString,
} from "@/lib/security";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page_slug = searchParams.get("page_slug") || undefined;
    
    const data = await getReviews({ status: "approved", page_slug });
    return NextResponse.json({ success: true, reviews: data.reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const clientIp = getClientIp(request);

    // 1. Rate limiting check
    const rateLimit = checkSubmissionRateLimit(clientIp);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: `Too many submissions. Please wait ${rateLimit.retryAfterSeconds} seconds before trying again.`,
        },
        { status: 429 },
      );
    }

    const body = await request.json().catch(() => ({}));

    // 2. Honeypot check for bots
    if (isHoneypotTriggered(body.hp_field) || isHoneypotTriggered(body.website)) {
      return NextResponse.json({
        success: true,
        message: "Thank you for your review!",
      });
    }

    // 3. Extract and sanitize
    const name = sanitizeString(body.name, 80);
    const city = sanitizeString(body.city, 80);
    const service = sanitizeString(body.service, 100);
    const quote = sanitizeString(body.quote || body.message || body.review, 800);
    const page_slug = sanitizeString(body.page_slug, 150);
    const ratingRaw = Number(body.rating);
    const rating = Math.min(5, Math.max(1, isNaN(ratingRaw) ? 5 : Math.round(ratingRaw)));

    // 4. Validation
    if (!name || name.length < 2) {
      return NextResponse.json(
        { error: "Please provide your name (at least 2 characters)." },
        { status: 400 },
      );
    }

    if (!quote || quote.length < 5) {
      return NextResponse.json(
        { error: "Please write a brief review of your experience." },
        { status: 400 },
      );
    }

    // 5. Save review
    const newReview = await createReview({
      name,
      city: city || undefined,
      service: service || undefined,
      rating,
      quote,
      status: "pending",
      page_slug: page_slug || null,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Thank you! Your review has been submitted successfully.",
        review: newReview,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error submitting review:", error);
    return NextResponse.json(
      { error: "Failed to submit your review. Please try again." },
      { status: 500 },
    );
  }
}
