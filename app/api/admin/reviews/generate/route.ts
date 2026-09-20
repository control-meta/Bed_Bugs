import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";
import { createReview } from "@/lib/reviews";

const ReviewItemSchema = z.object({
  name: z.string().describe("Authentic Indian citizen name (e.g., 'Kavita Iyer', 'Rahul Sharma', 'Sneha Kulkarni', 'Amitabh Sen', 'Priya N.')"),
  city: z.string().describe("Indian city or locality relevant to the target page"),
  service: z.string().describe("Specific pest control service (e.g., 'Odorless Bed Bug Treatment', 'Bed Bug Inspection & Spray', '1-Year Bed Bug AMC')"),
  rating: z.number().int().min(4).max(5).describe("Customer rating (mostly 5, occasional 4)"),
  quote: z.string().describe("Short, authentic, human-like customer review of exactly 20 to 35 words (1-2 sentences)."),
});

const ReviewListSchema = z.object({
  reviews: z.array(ReviewItemSchema),
});

export async function POST(request: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "OPENAI_API_KEY is not configured." }, { status: 500 });
    }

    const body = await request.json().catch(() => ({}));
    const pageSlug = body.page_slug || "/";
    const count = Math.min(50, Math.max(1, parseInt(body.count, 10) || 5));
    const status = body.status === "pending" ? "pending" : "approved";
    const ratingType = body.rating_type || "mostly_5";

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    // Derive city context from page slug
    let cityHint = "Major Indian cities like Bangalore, Mumbai, Pune, Delhi, Hyderabad, or Chennai";
    const cleanSlug = pageSlug.toLowerCase().replace(/^\/|\/$/g, "");
    if (cleanSlug.includes("bangalore") || cleanSlug.includes("bengaluru")) {
      cityHint = "Bangalore (mention areas like Koramangala, Indiranagar, HSR Layout, Whitefield, or Bellandur)";
    } else if (cleanSlug.includes("pune")) {
      cityHint = "Pune (mention areas like Baner, Wakad, Kothrud, Viman Nagar, or Hadapsar)";
    } else if (cleanSlug.includes("mumbai")) {
      cityHint = "Mumbai (mention areas like Andheri, Thane, Borivali, Powai, or Bandra)";
    } else if (cleanSlug.includes("delhi")) {
      cityHint = "Delhi NCR (mention areas like Dwarka, Rohini, South Ex, or Vasant Kunj)";
    } else if (cleanSlug.includes("noida")) {
      cityHint = "Noida / Greater Noida (mention sectors like Sector 62, Sector 18, or Sector 137)";
    } else if (cleanSlug.includes("hyderabad")) {
      cityHint = "Hyderabad (mention areas like Gachibowli, Madhapur, or Kukatpally)";
    } else if (cleanSlug.includes("chennai")) {
      cityHint = "Chennai (mention areas like Velachery, Anna Nagar, or T Nagar)";
    } else if (cleanSlug.includes("gurgaon")) {
      cityHint = "Gurgaon (mention Cyber City, Sector 56, or Sohna Road)";
    }

    const ratingInstruction =
      ratingType === "all_5"
        ? "All ratings must be 5 stars."
        : ratingType === "mixed"
        ? "Give roughly 70% 5-star ratings and 30% 4-star ratings with constructive positive feedback."
        : "Give 90% 5-star ratings and 10% 4-star ratings for realistic authenticity.";

    const systemPrompt = `
You are the customer feedback intelligence engine for BedBugsTreatment.co.in, India's leading odorless bed bug extermination service.

Generate exactly ${count} realistic, human-like customer reviews written by real Indian citizens.

CRITICAL RULES:
1. REAL INDIAN CITIZEN NAMES:
   - Use diverse, natural Indian names from different regions: e.g., "Rohit Sharma", "Sneha Kulkarni", "Vikram Sen", "Pooja Nair", "Arjun Reddy", "Kavita Joshi", "Amit Patel", "Deepa Verma", "Anand Iyer", "Neha Deshmukh", "Rajesh Das".
   - You can also use authentic first name + last initial (e.g. "Rohit S.", "Sneha K.").
2. UNIFORM SHORT CONTENT SIZE:
   - EVERY review MUST be short: strictly 20 to 35 words long (1 to 2 sentences max).
   - Maintain the EXACT SAME content size across all generated reviews so they fit beautifully in website review cards without awkward line height gaps.
   - Do NOT write essays, bullet points, or multi-paragraph reviews.
3. AUTHENTIC HUMAN TONE:
   - Natural conversational Indian English.
   - Specific realistic customer situations:
     * Odorless spray that didn't disturb elderly parents or kids.
     * Relief after weeks of itching and sleepless nights.
     * Technician arrived on time and thoroughly checked mattress seams.
     * No need to throw away expensive mattresses.
     * Free follow-up visit under the 12-month warranty was prompt.
4. LOCATION CONTEXT:
   - Target page slug: "${pageSlug}"
   - Preferred city/locality: ${cityHint}.
5. RATINGS:
   - ${ratingInstruction}
`;

    const completion = await openai.chat.completions.parse({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `Generate ${count} short, authentic Indian customer reviews for page "${pageSlug}". Keep every review strictly between 20 and 35 words.`,
        },
      ],
      response_format: zodResponseFormat(ReviewListSchema, "reviews_data"),
      temperature: 0.7, // Good authentic variety
    });

    const parsed = completion.choices[0]?.message?.parsed;
    if (!parsed || !parsed.reviews || parsed.reviews.length === 0) {
      throw new Error("AI failed to generate reviews.");
    }

    // Save each review into the database / local store
    const createdReviews = [];
    for (const rev of parsed.reviews) {
      const created = await createReview({
        name: rev.name,
        city: rev.city,
        service: rev.service,
        rating: rev.rating,
        quote: rev.quote,
        status,
        page_slug: pageSlug === "all" ? null : pageSlug,
      });
      createdReviews.push(created);
    }

    return NextResponse.json({
      success: true,
      count: createdReviews.length,
      reviews: createdReviews,
      message: `Successfully generated and saved ${createdReviews.length} authentic Indian citizen reviews!`,
    });
  } catch (error: any) {
    console.error("[api/admin/reviews/generate] Error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate reviews" }, { status: 500 });
  }
}
