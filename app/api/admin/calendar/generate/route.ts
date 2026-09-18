import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { saveCalendarPlans, BlogPlan } from "@/lib/calendar-db";

const SYSTEM_PROMPT = `You are a Senior SEO Content Strategist for BedBugsTreatment.co.in, a professional bed bug treatment and pest control website in India.

Your task is to generate blog topics for the specified date range. Do NOT generate topics for dates that have already passed. Only generate for the requested start date to end date inclusive.

For each post, include:
- "date": ISO date string (YYYY-MM-DD)
- "topic": A specific, search-intent-focused blog title targeting Indian bed bug treatment searchers
- "keywords": Array of 2-3 target keywords
- "searchVolume": Estimated monthly search volume (e.g., "8,100/mo", "2,400/mo") — estimate based on your SEO knowledge
- "type": One of "how-to", "guide", "list", "comparison", "local", "educational"

Mix different types of content day by day. Focus on bed bugs, but also include related pest control topics like cockroaches, termites, and rodents since the website covers these too. Ensure every single day in the requested range has a unique, high-intent topic.

Return ONLY a valid JSON object in this exact format:
{
  "plan": [
    {
      "date": "YYYY-MM-DD",
      "topic": "Blog title here",
      "keywords": ["keyword 1", "keyword 2"],
      "searchVolume": "8,100/mo",
      "type": "how-to"
    }
  ]
}`;

export async function POST(req: NextRequest) {
  try {
    const { month, year } = await req.json();

    if (!month || !year || isNaN(month) || isNaN(year) || month < 1 || month > 12) {
      return NextResponse.json(
        { error: "Invalid month or year provided." },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY is not set in environment variables." },
        { status: 500 }
      );
    }

    // Determine current date context (IST / local)
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;
    const currentDate = today.getDate();

    // Check if the requested month is strictly in the past
    const isPastMonth = year < currentYear || (year === currentYear && month < currentMonth);
    if (isPastMonth) {
      return NextResponse.json(
        { error: "Cannot generate content plan for past months. All days have already passed." },
        { status: 400 }
      );
    }

    const isCurrentMonth = year === currentYear && month === currentMonth;
    const daysInMonth = new Date(year, month, 0).getDate();

    // If current month: only generate from today onwards. If future month: 1st to end of month.
    const startDay = isCurrentMonth ? currentDate : 1;
    const endDay = daysInMonth;

    if (startDay > endDay) {
      return NextResponse.json(
        { error: "No upcoming days remaining in this month." },
        { status: 400 }
      );
    }

    const startDateStr = `${year}-${String(month).padStart(2, "0")}-${String(startDay).padStart(2, "0")}`;
    const endDateStr = `${year}-${String(month).padStart(2, "0")}-${String(endDay).padStart(2, "0")}`;
    const totalDaysToGenerate = endDay - startDay + 1;

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const monthName = new Date(year, month - 1, 1).toLocaleString("en-US", { month: "long" });

    const userPrompt = `Generate a content calendar for ${monthName} ${year} for BedBugsTreatment.co.in.
CRITICAL DATE REQUIREMENTS:
- Today's date is: ${today.toISOString().split("T")[0]}
- DO NOT generate topics for days that have already passed before today!
- Generate topics ONLY for the CURRENT DAY and UPCOMING DAYS: from ${startDateStr} (Day ${startDay}) to ${endDateStr} (Day ${endDay}) inclusive.
- There must be exactly ${totalDaysToGenerate} posts in your "plan" array — one for each day in this range.
- Each item must specify "date" matching the exact YYYY-MM-DD within ${startDateStr} to ${endDateStr}.
- Target Indian users searching for bed bug treatments, inspection, pest eradication, and prevention.

Return the result as a JSON object with a "plan" array.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.8,
      max_tokens: 3500,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0]?.message?.content || "{}";
    const parsed = JSON.parse(content);
    const rawPlan = Array.isArray(parsed.plan) ? parsed.plan : [];

    // Filter and sanitize valid posts matching the expected date range
    const validPosts: BlogPlan[] = rawPlan
      .filter((p: any) => p && p.date && p.topic)
      .map((p: any) => ({
        date: p.date,
        topic: p.topic,
        keywords: Array.isArray(p.keywords) ? p.keywords : [],
        searchVolume: p.searchVolume || "",
        type: p.type || "guide",
        status: "planned",
      }));

    // Save to Database (Supabase with local fallback)
    const { plan: fullMonthPlan, isSupabase } = await saveCalendarPlans(validPosts, month, year);

    return NextResponse.json({
      plan: fullMonthPlan,
      generatedCount: validPosts.length,
      isSupabase,
    });
  } catch (error: any) {
    console.error("Error generating calendar plan:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate content plan" },
      { status: 500 }
    );
  }
}
