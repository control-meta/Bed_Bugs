import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
const googleTrends = require("google-trends-api");
import { saveCalendarPlans, BlogPlan } from "@/lib/calendar-db";

const SYSTEM_PROMPT = `You are a Senior SEO Content Strategist for BedBugsTreatment.co.in, a professional and highly specialized bed bug treatment website in India.

Your task is to generate blog topics for the specified date range. Do NOT generate topics for dates that have already passed. Only generate for the requested start date to end date inclusive.

For each post, include:
- "date": ISO date string (YYYY-MM-DD)
- "topic": A specific, search-intent-focused blog title targeting Indian bed bug treatment searchers
- "keywords": Array of 2-3 target keywords
- "searchVolume": Return an empty string ""
- "type": One of "how-to", "guide", "list", "comparison", "local", "educational"

**CRITICAL INSTRUCTION: You MUST ONLY generate topics that are strictly related to BED BUGS. Under NO CIRCUMSTANCES should you generate topics about cockroaches, termites, rodents, ants, mosquitoes, or any other general pests. EVERY single topic MUST be specifically about bed bugs.** Focus heavily on practical, location-specific (Mumbai, Delhi, Bangalore, Pune), and actionable bed bug advice. Mix different types of content day by day. Ensure every single day in the requested range has a unique, high-intent topic about bed bugs.

Return ONLY a valid JSON object in this exact format:
{
  "plan": [
    {
      "date": "YYYY-MM-DD",
      "topic": "Blog title here",
      "keywords": ["keyword 1", "keyword 2"],
      "searchVolume": "",
      "type": "how-to"
    }
  ]
}`;

const FALLBACK_PROMPT = `You are an SEO expert. Generate a 5-day emergency content calendar specifically about BED BUG control and BED BUG treatment. Do NOT mention any other pests like cockroaches or rodents.

Output exactly a JSON array of objects.
Each object must have:
- date: "YYYY-MM-DD"
- title: "Catchy Title about Bed Bugs"
- description: "Short description"
- primaryKeyword: "main SEO keyword"
- trendScore: 85

ONLY output the raw JSON array.`;

const TOPIC_SUGGESTION_PROMPT = `You are a local SEO expert in India.
Provide 3 alternative, broader, mainstream BED BUG treatment topics and short-tail keywords that Indian users actively search for (e.g., "bed bug treatment", "how to get rid of bed bugs", "bed bug bites").
Do NOT include any topics about cockroaches, rodents, or general pest control.

Output EXACTLY a JSON array of 3 strings. Example: ["Bed Bug Treatment Cost", "Bed Bug Symptoms", "DIY Bed Bug Removal"]
No markdown, no markdown blocks.`;

async function fetchTrendScore(keyword: string): Promise<number | null> {
  try {
    const trendRes = await googleTrends.interestOverTime({
      keyword,
      startTime: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    });
    const parsedTrend = JSON.parse(trendRes);
    const timelineData = parsedTrend.default?.timelineData;
    if (timelineData && timelineData.length > 0) {
      const latest = timelineData[timelineData.length - 1];
      return latest.value[0];
    }
  } catch (err) {
    console.warn("Failed to fetch trend for", keyword);
  }
  return null;
}

async function getAlternativeTopics(openai: OpenAI, originalTopic: string, originalKeyword: string): Promise<{topic: string, keyword: string}[]> {
  const prompt = `The blog topic "${originalTopic}" with keyword "${originalKeyword}" is too specific and has 0 search volume on Google Trends. 
Provide 3 alternative, broader, mainstream pest control topics and short-tail keywords that Indian users actively search for (e.g., "bed bug treatment", "pest control services", "cockroach control").
Return ONLY JSON in this format:
{
  "alternatives": [
    { "topic": "Broader Topic Title", "keyword": "short tail keyword" }
  ]
}`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
      response_format: { type: "json_object" },
    });
    const content = response.choices[0]?.message?.content || "{}";
    const parsed = JSON.parse(content);
    return parsed.alternatives || [];
  } catch (err) {
    return [];
  }
}

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
        searchVolume: "",
        type: p.type || "guide",
        status: "planned",
      }));

    // Fetch Trends for each valid post to get actual relative interest score
    for (let i = 0; i < validPosts.length; i++) {
      const post = validPosts[i];
      // Use the first keyword or the topic if no keywords
      const mainKeyword = (post.keywords && post.keywords.length > 0) ? post.keywords[0] : post.topic;
      
      let score = await fetchTrendScore(mainKeyword);
      
      // If score is 0 or null, attempt to regenerate broader topics
      if (score === 0 || score === null) {
        const alternatives = await getAlternativeTopics(openai, post.topic, mainKeyword);
        for (const alt of alternatives) {
          // small delay before next trend check to avoid rate limiting
          await new Promise(r => setTimeout(r, 300));
          
          const altScore = await fetchTrendScore(alt.keyword);
          if (altScore !== null && altScore > 0) {
            post.topic = alt.topic;
            post.keywords = [alt.keyword];
            score = altScore;
            break; // found a good one, exit alternative loop
          }
        }
      }

      if (score !== null) {
        post.searchVolume = `Trend Score: ${score}/100`;
      } else {
        post.searchVolume = "Trend Score: N/A";
      }
      
      // small delay before moving to next post
      await new Promise(r => setTimeout(r, 300));
    }

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
