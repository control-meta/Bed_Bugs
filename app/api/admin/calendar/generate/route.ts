import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { saveCalendarPlans, BlogPlan } from "@/lib/calendar-db";

const SYSTEM_PROMPT = `You are a Senior SEO Content Strategist for BedBugsTreatment.co.in, India's premier specialized bed bug eradication and inspection platform.

Your task is to generate blog topics and target keywords for the specified date range. Do NOT generate topics for dates that have already passed. Only generate for the requested start date to end date inclusive.

For each post, include:
- "date": ISO date string (YYYY-MM-DD)
- "topic": A specific, search-intent-focused blog title strictly about BED BUGS for Indian searchers
- "keywords": Array of exactly 5 target keywords that are STRICTLY and EXCLUSIVELY related to BED BUGS (e.g., "bed bug treatment Bangalore", "how to identify bed bug bites", "odorless bed bug spray", "bed bug odorless treatment cost", "khatmal marne ka tarika")
- "searchVolume": Relative search volume or interest level for Indian searchers (e.g. "Trend Score: 85/100", "High Volume: 5K-10K/mo", "Peak Season Demand", "Rising Interest")
- "type": One of "how-to", "guide", "list", "comparison", "local", "educational"

**CRITICAL INSTRUCTION: STRICTLY BED BUGS ONLY (ZERO TOLERANCE FOR OTHER PESTS):**
1. KEYWORDS MUST BE SPECIFICALLY ABOUT BED BUGS:
   - EVERY SINGLE KEYWORD in the "keywords" array MUST explicitly include "bed bug", "bed bugs", or specific bed bug terminology (e.g. "bed bug bites", "bed bug eggs", "khatmal", "bed bug spray").
   - Under NO CIRCUMSTANCES should any keyword be about cockroaches, termites, rodents, rats, ants, mosquitoes, or generic pest control.
   - Prohibited keywords: "pest control services", "cockroach control", "termite spray", "general pest treatment", "home hygiene tips".
   - Approved keywords: "bed bug treatment cost in Delhi", "signs of bed bugs in mattress", "odorless bed bug odorless treatment", "bed bug inspection checklist", "how to kill bed bugs permanently", "bed bug bites vs mosquito bites", "steam treatment for bed bugs".

2. DIVERSE CONTENT ANGLES:
    - Focus heavily on practical, location-specific situations ONLY for Pune, Mumbai, and Bangalore.
    - Create a monthly plan strictly allocating days 1-10 for Pune, days 11-20 for Mumbai, days 21-30 for Bangalore, and a general topic for day 31.
    - Mix different types of content day by day (how-to guides, cost breakdowns, DIY myth-busting vs professional treatment, diwan and box-bed inspections, tenant checklists).
    - Every title must be materially different from every other title. Never repeat generic titles such as "Effective Bed Bug Treatment Methods" or change only the city name.
    - Use one distinct search intent per day: bites, cost, mattress inspection, eggs, odorless treatment, steam, prevention, travel, tenants, hotels, children and pets, DIY myths, treatment preparation, warranty, and related angles.
    - Return exactly 5 keywords for every post. Every day's 5 keywords must cover different search intents: primary topic, local/service, cost or commercial, problem/symptom, and prevention or solution.
    - Do not reuse a keyword anywhere else in the monthly plan. Do not create near-duplicates by changing only the city or word order. Each day must target a distinct search query cluster.
    - Prefer high-intent Indian SEO phrases such as "bed bug treatment near me", "bed bug treatment cost in Delhi", "signs of bed bugs in mattress", "professional bed bug exterminator", and "how to get rid of bed bugs permanently".

Return ONLY a valid JSON object in this exact format:
{
  "plan": [
    {
      "date": "YYYY-MM-DD",
      "topic": "Exhaustive Bed Bug Topic Title",
      "keywords": ["specific bed bug keyword 1", "specific bed bug keyword 2", "specific bed bug keyword 3", "specific bed bug keyword 4", "specific bed bug keyword 5"],
      "searchVolume": "",
      "type": "how-to"
    }
  ]
}`;

const FALLBACK_PROMPT = `You are an SEO expert. Generate a 5-day emergency content calendar specifically about BED BUG control and BED BUG treatment in India.
Do NOT mention any other pests like cockroaches, termites, or rodents.
Every single keyword MUST be specifically and strictly related to BED BUGS.

Output exactly a JSON array of objects.
Each object must have:
- date: "YYYY-MM-DD"
- title: "Catchy Title strictly about Bed Bugs"
- description: "Short description"
- primaryKeyword: "bed bug specific keyword"
- trendScore: 85

ONLY output the raw JSON array.`;

const TOPIC_SUGGESTION_PROMPT = `You are a local SEO expert in India.
Provide 3 alternative, broader, mainstream BED BUG treatment topics and short-tail keywords that Indian users actively search for (e.g., "bed bug treatment", "how to get rid of bed bugs", "bed bug bites", "bed bug spray").
Do NOT include any topics or keywords about cockroaches, termites, rodents, or general pest control. Every keyword must specifically contain "bed bug" or "bed bugs".

Output EXACTLY a JSON array of 3 strings. Example: ["Bed Bug Treatment Cost", "Bed Bug Symptoms", "DIY Bed Bug Removal"]
No markdown, no markdown blocks.`;

const UNIQUE_TITLE_TEMPLATES = [
  "How to Identify Bed Bug Bites Before They Spread in {location}",
  "Bed Bug Treatment Cost in {location}: What Homeowners Should Know",
  "Mattress Inspection Checklist for Hidden Bed Bugs in {location}",
  "DIY Bed Bug Removal Mistakes That Make Infestations Worse in {location}",
  "Odorless Bed Bug Treatment in {location}: Process, Safety, and Results",
  "How to Remove Bed Bug Eggs from Mattresses and Furniture in {location}",
  "{location} Bed Bug Chemical Spray vs Steam: Which Works Better?",
  "Bed Bug Prevention Tips for {location} Tenants Moving into a New Home",
  "Signs of Bed Bugs in Sofas, Diwans, and Box Beds in {location} Homes",
  "How Long Does Professional Bed Bug Treatment Take in {location}?",
  "Bed Bug Bites vs Mosquito Bites: Key Differences for {location} Residents",
  "Best Bed Bug Spray for Indoor Home Treatment in {location}",
  "Bed Bug Infestation Checklist for {location} Hotels and Guest Houses",
  "When to Call a Professional Bed Bug Exterminator in {location}",
  "How to Check Second-Hand Furniture for Bed Bugs in {location}",
  "Bed Bug Treatment for Children and Pets: Safety Guide for {location} Families",
  "Can Bed Bugs Survive in Clothes, Luggage, and Bedding in {location} Weather?",
  "Steam Cleaning for Bed Bugs in {location}: What It Can and Cannot Do",
  "Bed Bug Powder, Spray, or Steam: Comparing Treatment Options in {location}",
  "How to Prepare Your {location} Home for Professional Bed Bug Treatment",
  "Bed Bug Warranty and Follow-Up Visits: What to Expect in {location}",
  "Emergency Bed Bug Treatment After a Hotel Stay in {location}",
  "How Bed Bugs Enter Apartments and Shared Buildings in {location}",
  "Bed Bug Life Cycle: Eggs, Nymphs, and Adult Bugs Explained in {location}",
  "How to Prevent Bed Bugs During Travel and Relocation in {location}",
  "Bed Bug Treatment for Rental Homes: Tenant and Landlord Guide in {location}",
  "Do Bed Bug Foggers Work? Safer Alternatives for {location} Homes",
  "How to Find Bed Bugs in Mattress Seams and Bed Frames in {location}",
  "Monsoon Bed Bug Prevention for {location} Homes",
  "Bed Bug Treatment for Hostels, PGs, and Student Rooms in {location}",
  "How to Stop Bed Bugs from Returning After Treatment in {location}",
  "Bed Bug Inspection Before Buying or Renting a Home in {location}",
  "Professional Bed Bug Treatment for Office and Commercial Spaces in {location}",
  "Natural Bed Bug Remedies: What Helps and What Does Not in {location}",
  "Bed Bug Control for Wooden Beds, Cabinets, and Cracks in {location}",
];

const FORBIDDEN_PESTS = ["cockroach", "termite", "rodent", "ant", "mosquito", "rat", "lizard", "spider", "wasp", "fly", "beetle", "flea", "tick"];

/**
 * Ensures every keyword is 100% strictly related to bed bugs.
 * Strips any generic or non-bed-bug pest terms and enforces the bed bug focus.
 */
function sanitizeBedBugKeywords(keywords: string[]): string[] {
  const clean: string[] = [];

  for (const kw of keywords) {
    if (!kw || typeof kw !== "string") continue;
    const trimmed = kw.trim();
    const lower = trimmed.toLowerCase();

    // Reject any keyword referencing other pests
    if (FORBIDDEN_PESTS.some(p => lower.includes(p))) {
      continue;
    }

    // If it already explicitly contains "bed bug" or "khatmal", keep it
    if (lower.includes("bed bug") || lower.includes("khatmal")) {
      clean.push(trimmed);
      continue;
    }

    // If it's a generic pest keyword (e.g. "pest control Bangalore", "inspection cost"), anchor it to bed bugs
    if (lower.includes("pest control")) {
      clean.push(trimmed.replace(/pest control/i, "bed bug pest control"));
    } else {
      clean.push(`bed bug ${trimmed}`);
    }
  }

  // Keep five distinct keywords per day. The final monthly pass adds
  // additional SEO-focused keywords when OpenAI returns too few.
  const fallbackKeywords = [
    "bed bug treatment",
    "bed bug inspection",
    "bed bug treatment cost",
    "signs of bed bugs in mattress",
    "how to get rid of bed bugs permanently",
  ];

  for (const fallback of fallbackKeywords) {
    if (clean.length >= 5) break;
    if (!clean.some((keyword) => normalizeKeyword(keyword) === normalizeKeyword(fallback))) {
      clean.push(fallback);
    }
  }

  return Array.from(new Set(clean.map((keyword) => keyword.trim()))).slice(0, 5);
}

const SEO_LOCATIONS = [
  "Pune",
  "Mumbai",
  "Bangalore",
];

const SEO_ANGLES = [
  "treatment near me",
  "professional exterminator",
  "treatment cost",
  "inspection checklist",
  "spray treatment",
  "mattress treatment",
  "deep treatment",
  "steam treatment",
  "eggs removal",
  "bites treatment",
  "infestation signs",
  "prevention tips",
  "same day service",
  "odorless treatment",
  "home treatment",
  "hotel room inspection",
  "hostel room treatment",
  "rental home treatment",
  "sofa treatment",
  "furniture inspection",
  "DIY mistakes",
  "permanent removal",
  "odorless treatment",
  "powder treatment",
  "life cycle guide",
  "travel prevention",
  "tenant checklist",
  "children safe treatment",
  "monsoon prevention",
  "warranty service",
  "emergency service",
  "room disinfection",
];

function normalizeKeyword(keyword: string): string {
  return keyword
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function titleTokens(title: string): Set<string> {
  return new Set(
    title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .split(/\s+/)
      .filter(Boolean)
      .map((token) => token.replace(/s$/, "")),
  );
}

function titlesAreTooSimilar(first: string, second: string): boolean {
  const firstTokens = titleTokens(first);
  const secondTokens = titleTokens(second);
  const intersection = [...firstTokens].filter((token) => secondTokens.has(token)).length;
  const smallerTitleSize = Math.min(firstTokens.size, secondTokens.size);

  return first.trim().toLowerCase() === second.trim().toLowerCase() || (smallerTitleSize > 0 && intersection / smallerTitleSize >= 0.75);
}

function ensureUniqueTopics(posts: BlogPlan[]): void {
  const acceptedTitles: string[] = [];

  for (let index = 0; index < posts.length; index++) {
    const post = posts[index];
    const isDuplicate = acceptedTitles.some((title) => titlesAreTooSimilar(title, post.topic));

    if (isDuplicate) {
      const dayOfMonth = parseInt(post.date.split("-")[2], 10);
      let location = "";
      if (dayOfMonth <= 10) location = "Pune";
      else if (dayOfMonth <= 20) location = "Mumbai";
      else if (dayOfMonth <= 30) location = "Bangalore";

      const candidates = UNIQUE_TITLE_TEMPLATES.map((template) => {
        if (!location) {
          return template.replace(/ in {location}| for {location} Homes| for {location} Residents| for {location} Families| in {location} Weather|{location} /g, "");
        }
        return template.replace("{location}", location);
      });

      const replacement = candidates.find(
        (candidate) => !acceptedTitles.some((title) => titlesAreTooSimilar(title, candidate)),
      );

      if (replacement) {
        post.topic = replacement;
      } else {
        const fallbackTemplate = UNIQUE_TITLE_TEMPLATES[index % UNIQUE_TITLE_TEMPLATES.length];
        const formattedFallback = !location 
          ? fallbackTemplate.replace(/ in {location}| for {location} Homes| for {location} Residents| for {location} Families| in {location} Weather|{location} /g, "")
          : fallbackTemplate.replace("{location}", location);
        post.topic = `${formattedFallback} — ${post.date}`;
      }
    }

    acceptedTitles.push(post.topic);
  }
}

function buildUniqueSeoKeywords(
  existingKeywords: string[],
  topic: string,
  postIndex: number,
  usedKeywords: Set<string>,
): string[] {
  const selected: string[] = [];

  for (const keyword of existingKeywords) {
    const normalized = normalizeKeyword(keyword);
    if (normalized && !usedKeywords.has(normalized) && !selected.some((item) => normalizeKeyword(item) === normalized)) {
      selected.push(keyword.trim());
      usedKeywords.add(normalized);
    }
    if (selected.length === 5) return selected;
  }

  const topicHint = topic
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\b(about|guide|ways|tips|how|what|why|bed|bugs?|india|indian)\b/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .slice(0, 3)
    .join(" ");

  for (let offset = 0; selected.length < 5 && offset < SEO_ANGLES.length * SEO_LOCATIONS.length; offset++) {
    const angle = SEO_ANGLES[(postIndex * 5 + offset) % SEO_ANGLES.length];
    const location = SEO_LOCATIONS[(postIndex + Math.floor(offset / SEO_ANGLES.length)) % SEO_LOCATIONS.length];
    const topicPrefix = topicHint && offset % 2 === 0 ? `${topicHint} ` : "";
    const candidate = `bed bug ${topicPrefix}${angle} in ${location}`.replace(/\s+/g, " ");
    const normalized = normalizeKeyword(candidate);

    if (!usedKeywords.has(normalized)) {
      selected.push(candidate);
      usedKeywords.add(normalized);
    }
  }

  return selected.slice(0, 5);
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
CRITICAL REQUIREMENTS:
- Today's date is: ${today.toISOString().split("T")[0]}
- DO NOT generate topics for days that have already passed before today!
- Generate topics ONLY for the CURRENT DAY and UPCOMING DAYS: from ${startDateStr} (Day ${startDay}) to ${endDateStr} (Day ${endDay}) inclusive.
- There must be exactly ${totalDaysToGenerate} posts in your "plan" array — one for each day in this range.
- Each item must specify "date" matching the exact YYYY-MM-DD within ${startDateStr} to ${endDateStr}.

STRICT CITY ALLOCATION RULE (10-10-10-1):
- The FIRST 10 days of the month MUST target "Pune". The word "Pune" MUST appear in both the topic and the keywords.
- The NEXT 10 days of the month (Days 11-20) MUST target "Mumbai". The word "Mumbai" MUST appear in both the topic and the keywords.
- The NEXT 10 days of the month (Days 21-30) MUST target "Bangalore" (or "Bengaluru"). The word "Bangalore" MUST appear in both the topic and the keywords.
- If there is a 31st day in the month, that 1 single post MUST be a "General/India" post with NO city mentioned in the title.
- Do NOT generate generic topics for days 1-30. Every title from Day 1 to 30 MUST explicitly include its assigned city name.

- STRICT KEYWORD RULE: EVERY keyword in the "keywords" array must be specifically and strictly about BED BUGS only (e.g., "bed bug treatment Pune", "bed bug spray Mumbai", "bed bug bites Bangalore"). Absolutely NO generic pests or non-bed-bug keywords!
- Return exactly 5 keywords for each day. All 5 must be distinct, high-intent SEO queries covering different intents, and no keyword may be reused on another day in this plan.
- Do not create near-duplicates by changing only the city, adding a year, or rearranging words. Build a genuinely different keyword cluster for every date.
- Every title must be materially different from all other titles. Do not repeat a title or reuse the same title structure with only a city/location changed.
- Target Indian users searching for bed bug treatments, inspection, eradication, and mattress prevention.

Return the result as a JSON object with a "plan" array.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 9000,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0]?.message?.content || "{}";
    const parsed = JSON.parse(content);
    const rawPlan = Array.isArray(parsed.plan) ? parsed.plan : [];

    // Filter and sanitize valid posts matching the expected date range
    const validPosts: BlogPlan[] = rawPlan
      .filter((p: any) => p && p.date && p.topic)
      .map((p: any) => {
        const rawKeywords = Array.isArray(p.keywords) ? p.keywords : [];
        const bedBugKeywords = sanitizeBedBugKeywords(rawKeywords);

        return {
          date: p.date,
          topic: p.topic,
          keywords: bedBugKeywords,
          searchVolume: p.searchVolume || "Trend Score: 80/100",
          type: p.type || "guide",
          status: "planned" as const,
        };
      });

    // Trend alternatives can return the same generic title for many dates.
    // Normalize those collisions before persisting the monthly calendar.
    ensureUniqueTopics(validPosts);

    // Enforce a unique five-keyword SEO cluster for every day after any
    // trend-based topic replacements have completed.
    const usedKeywords = new Set<string>();
    for (let i = 0; i < validPosts.length; i++) {
      validPosts[i].keywords = buildUniqueSeoKeywords(
        validPosts[i].keywords,
        validPosts[i].topic,
        i,
        usedKeywords,
      );
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
