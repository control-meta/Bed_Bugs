import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const SYSTEM_PROMPT = `You are a Senior SEO Content Strategist for BedBugsTreatment.co.in, a professional bed bug treatment and pest control website in India.

Your task is to generate a monthly content calendar. You will be given a month and year, and you must return a structured JSON array of blog topics — exactly one for EVERY SINGLE DAY of the given month. Do not skip any days.

For each post, include:
- "date": ISO date string (YYYY-MM-DD)
- "topic": A specific, search-intent-focused blog title targeting Indian bed bug treatment searchers
- "keywords": Array of 2-3 target keywords
- "searchVolume": Estimated monthly search volume (e.g., "8,100/mo", "2,400/mo") — estimate based on your SEO knowledge
- "type": One of "how-to", "guide", "list", "comparison", "local", "educational"

Mix different types of content day by day. Focus on bed bugs, but also include related pest control topics like cockroaches, termites, and rodents since the website covers these too. Ensure there is a post for every single day (e.g. 30 or 31 posts).

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

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY is not set in environment variables." },
        { status: 500 }
      );
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const monthName = new Date(year, month - 1, 1).toLocaleString("en-US", { month: "long" });

    const userPrompt = `Generate a full daily content calendar for ${monthName} ${year} for BedBugsTreatment.co.in.
The site targets Indian users searching for bed bug treatment, pest control, and related topics.
Schedule a unique blog post for EVERY SINGLE DAY of the month. If the month has 30 days, generate exactly 30 posts. If 31, generate 31.
Return the result as a JSON object with a "plan" array.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.8,
      max_tokens: 3000,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0]?.message?.content || "{}";
    const parsed = JSON.parse(content);

    return NextResponse.json({ plan: parsed.plan || [] });
  } catch (error: any) {
    console.error("Error generating calendar plan:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate content plan" },
      { status: 500 }
    );
  }
}
