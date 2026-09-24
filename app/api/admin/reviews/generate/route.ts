import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";
import { getReviews, createReview } from "@/lib/reviews";

const ReviewItemSchema = z.object({
  name: z.string().describe("100% Unique authentic Indian citizen name with both first and last name, or first name + initial."),
  city: z.string().describe("Indian city or locality matching the target page context"),
  service: z.string().describe("Specific bed bug treatment service (e.g., 'Odorless Bed Bug Eradication', '1-Year Bed Bug AMC', 'Odorless Mattress Treatment')"),
  rating: z.number().int().min(4).max(5).describe("Customer rating: 5 or 4"),
  quote: z.string().describe("Highly authentic customer review of EXACTLY 35 to 40 words to ensure uniform 4-line height."),
});

const ReviewListSchema = z.object({
  reviews: z.array(ReviewItemSchema),
});

// Rich pools of authentic Indian names across different linguistic regions & communities
const FEMALE_FIRST_NAMES = [
  "Ananya", "Sunita", "Divya", "Swati", "Meera", "Tanvi", "Bhavna", "Ritu", "Shilpa", "Archana",
  "Shalini", "Pallavi", "Deepali", "Rekha", "Aarti", "Pooja", "Neha", "Kavita", "Snehal", "Shruti",
  "Radhika", "Preeti", "Shweta", "Manisha", "Aditi", "Smita", "Payal", "Garima", "Vandana", "Priyanka",
  "Rashmi", "Komal", "Supriya", "Anusha", "Sowmya", "Vidya", "Malini", "Lakshmi", "Geetha", "Deepa",
  "Harini", "Keerthi", "Aparna", "Tanushree", "Gayatri", "Nandini", "Madhavi", "Rupali", "Urmila", "Vaishali"
];

const MALE_FIRST_NAMES = [
  "Rahul", "Vikram", "Rohit", "Arjun", "Amit", "Anand", "Rajesh", "Karan", "Nikhil", "Varun",
  "Gaurav", "Nitin", "Vinay", "Rakesh", "Sameer", "Alok", "Suresh", "Pradeep", "Sandeep", "Ashok",
  "Harish", "Manoj", "Karthik", "Chetan", "Abhinav", "Kunal", "Saurabh", "Tarun", "Mayank", "Prashant",
  "Sumit", "Manish", "Sachin", "Tushar", "Mahesh", "Girish", "Naveen", "Sridhar", "Vignesh", "Ramesh",
  "Venkat", "Balaji", "Praveen", "Deepak", "Hemant", "Subhash", "Dharmesh", "Bhaskar", "Gautam", "Devendra"
];

const SURNAMES = [
  // North & Central
  "Verma", "Sharma", "Gupta", "Tyagi", "Malhotra", "Kapoor", "Bhatia", "Rawat", "Chauhan", "Yadav",
  "Saxena", "Mishra", "Pandey", "Joshi", "Tripathi", "Tiwari", "Agarwal", "Bansal", "Goel", "Singhal",
  "Mittal", "Ahuja", "Juneja", "Sethi", "Grover", "Anand", "Chhabra", "Soni", "Bhardwaj", "Choudhary",
  // West / Maharashtra / Gujarat
  "Kulkarni", "Deshpande", "Gokhale", "Shinde", "Patil", "Tambe", "Jadhav", "Sawant", "Kamat", "Prabhu",
  "Gaikwad", "More", "Salunkhe", "Pawar", "Bhosale", "Deshmukh", "Chitnis", "Shah", "Mehta", "Parekh",
  "Zaveri", "Trivedi", "Desai", "Bhatt", "Pandya", "Vora", "Doshi", "Solanki", "Vaghela", "Rupani",
  // South (Karnataka, Tamil Nadu, Andhra, Telangana, Kerala)
  "Hegde", "Gowda", "Shettigar", "Rao", "Pai", "Ramanathan", "Ranganathan", "Balasubramanian",
  "Venkataraman", "Sundaram", "Natarajan", "Krishnan", "Murugan", "Iyer", "Iyengar", "Reddy",
  "Choudary", "Raju", "Naidu", "Varma", "Prasad", "Nair", "Menon", "Kurian", "Varghese", "Pillai",
  "Nambiar", "Mathew", "Cherian", "Pillay",
  // East (Bengal, Odisha, Assam)
  "Banerjee", "Mukherjee", "Chatterjee", "Bhattacharya", "Dutta", "Ganguly", "Sen", "Ghosh", "Mohanty",
  "Patnaik", "Barua", "Saikia", "Dasgupta", "Bhowmik", "Majumdar", "Sarkar", "Chakraborty", "Roy", "Debnath"
];

/**
 * Generates an authentic, guaranteed unique Indian citizen name that does not exist in usedSet.
 */
function generateUniqueIndianName(usedSet: Set<string>): string {
  for (let attempt = 0; attempt < 300; attempt++) {
    const isFemale = Math.random() > 0.5;
    const firstList = isFemale ? FEMALE_FIRST_NAMES : MALE_FIRST_NAMES;
    const first = firstList[Math.floor(Math.random() * firstList.length)];
    const last = SURNAMES[Math.floor(Math.random() * SURNAMES.length)];

    // Mix full last name (75%) and last initial (25%)
    const useInitial = Math.random() < 0.25;
    const candidate = useInitial ? `${first} ${last[0]}.` : `${first} ${last}`;

    if (!usedSet.has(candidate.toLowerCase())) {
      usedSet.add(candidate.toLowerCase());
      return candidate;
    }
  }

  // Ultra-rare fallback if saturated
  const fallbackNumber = Math.floor(100 + Math.random() * 900);
  const isFemale = Math.random() > 0.5;
  const first = isFemale ? FEMALE_FIRST_NAMES[Math.floor(Math.random() * FEMALE_FIRST_NAMES.length)] : MALE_FIRST_NAMES[Math.floor(Math.random() * MALE_FIRST_NAMES.length)];
  const candidate = `${first} K.${fallbackNumber}`;
  usedSet.add(candidate.toLowerCase());
  return candidate;
}

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

    // 1. Fetch all existing reviews to establish a strict exclusion list of already used names
    const { reviews: existingReviews } = await getReviews({ status: "all", limit: 5000 });
    const existingNamesSet = new Set<string>();
    const existingNamesList: string[] = [];

    for (const r of existingReviews) {
      if (r.name && typeof r.name === "string") {
        const trimmed = r.name.trim();
        if (trimmed) {
          existingNamesSet.add(trimmed.toLowerCase());
          existingNamesList.push(trimmed);
        }
      }
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    // 2. Derive city & locality context from page slug
    let cityHint = "Major Indian cities like Bangalore, Mumbai, Pune, Delhi, Hyderabad, Chennai, or Kolkata";
    const cleanSlug = pageSlug.toLowerCase().replace(/^\/|\/$/g, "");
    if (cleanSlug.includes("bangalore") || cleanSlug.includes("bengaluru")) {
      cityHint = "Bangalore (mention localities like Koramangala, Indiranagar, HSR Layout, Whitefield, Bellandur, or Electronic City)";
    } else if (cleanSlug.includes("pune")) {
      cityHint = "Pune (mention localities like Baner, Wakad, Kothrud, Viman Nagar, Hadapsar, or Hinjewadi)";
    } else if (cleanSlug.includes("mumbai")) {
      cityHint = "Mumbai (mention localities like Andheri West, Thane, Borivali, Powai, Bandra, or Kandivali)";
    } else if (cleanSlug.includes("services")) {
      cityHint = "Across metropolitan Indian apartments and homes (mention thorough mattress seam inspection, odorless spray, and 1-year warranty)";
    }

    const ratingInstruction =
      ratingType === "all_5"
        ? "All ratings must be 5 stars."
        : ratingType === "mixed"
        ? "Give roughly 75% 5-star ratings and 25% 4-star ratings with constructive positive feedback."
        : "Give 90% 5-star ratings and 10% 4-star ratings for realistic authenticity.";

    // Take the most recent 120 names as explicit exclusion instructions for OpenAI prompt
    const recentExcludedNames = existingNamesList.slice(0, 120);

    const systemPrompt = `
You are the customer review intelligence engine for BedBugsTreatment.co.in, India's premier professional odorless bed bug extermination service.

Generate exactly ${count} realistic, human-like customer reviews written by real Indian citizens.

CRITICAL RULES FOR REVIEWS:

1. ABSOLUTELY ZERO NAME DUPLICATION (MANDATORY):
   - The following ${recentExcludedNames.length} names have ALREADY been used on our platform. You are STRICTLY FORBIDDEN from using any of these names or minor variations of them:
   ${recentExcludedNames.length > 0 ? recentExcludedNames.join(", ") : "None yet"}
   - EVERY review in this batch MUST have a completely UNIQUE name from one another.
   - Use diverse Indian names representing different regions (North, South, East, West, Maharashtra, Gujarat, Bengal, Karnataka, Tamil Nadu, Andhra, Punjab).
   - Both male and female names.
   - You can format names as either "Firstname Lastname" (e.g., "Ananya Deshpande", "Karthik Hegde") or "Firstname Initial." (e.g., "Swati R.", "Arjun K.").

2. UNIFORM CONTENT LENGTH (CRITICAL):
   - Every review quote MUST be EXACTLY between 35 and 40 words. No more, no less.
   - This ensures review cards on the website render with identical heights (exactly 4 to 5 lines of text) without awkward empty spaces.

3. EXTREME VARIETY & GENUINE HUMAN TONE (CRITICAL):
   - DO NOT start every review the same way (e.g., do not start every review with "The odorless treatment..."). Vary your opening sentences and sentence structures drastically!
   - Make it sound like a natural human wrote it on Google Reviews. Use colloquial Indian English nuances.
   - Give each review a different focal point:
     * Review A might focus on sleep ("Finally slept after weeks of itching...").
     * Review B might focus on safety ("Since we have kids and pets, we were worried...").
     * Review C might focus on the technicians ("The team was very professional and checked the diwan thoroughly...").
     * Review D might focus on cost ("Saved us from throwing away our expensive mattress...").
   - STRICTLY DO NOT mention "heat", "steam", or "chemical" treatments anywhere in the review. 
   - You can refer to the service as "odorless treatment", "the spray", "the service", or "the AMC", but DO NOT force the word "odorless" into every single review. Let it flow naturally.
   - Every single review in this batch must sound completely distinct and not formulaic.

4. LOCATION CONTEXT:
   - Target page: "${pageSlug}"
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
          content: `Generate ${count} completely unique, authentic Indian customer reviews for page "${pageSlug}". Every person's name MUST be completely unique and never used before. Strictly EXACTLY 35 to 40 words per review to ensure uniform height.`,
        },
      ],
      response_format: zodResponseFormat(ReviewListSchema, "reviews_data"),
      temperature: 0.8, // Slightly higher temperature for rich naming diversity
    });

    const parsed = completion.choices[0]?.message?.parsed;
    if (!parsed || !parsed.reviews || parsed.reviews.length === 0) {
      throw new Error("AI failed to generate reviews.");
    }

    // 3. Programmatic Post-Validation & Guaranteed Deduplication
    // Ensure that even if OpenAI hallucinates an existing or duplicate name, it is immediately corrected!
    const batchUsedNames = new Set<string>(existingNamesSet);
    const createdReviews = [];

    for (const rev of parsed.reviews) {
      let finalName = (rev.name || "").trim();
      const normalized = finalName.toLowerCase();

      // If duplicate or empty, replace with an authentic, guaranteed unique name
      if (!finalName || batchUsedNames.has(normalized)) {
        finalName = generateUniqueIndianName(batchUsedNames);
      } else {
        batchUsedNames.add(normalized);
      }

      // Ensure review quote is clean
      const cleanQuote = rev.quote.trim().replace(/^["']|["']$/g, "");

      const created = await createReview({
        name: finalName,
        city: rev.city || "Bangalore",
        service: rev.service || "Odorless Bed Bug Treatment",
        rating: rev.rating || 5,
        quote: cleanQuote,
        status,
        page_slug: pageSlug === "all" ? null : pageSlug,
      });

      createdReviews.push(created);
    }

    return NextResponse.json({
      success: true,
      count: createdReviews.length,
      reviews: createdReviews,
      message: `Successfully generated and saved ${createdReviews.length} authentic Indian citizen reviews with 100% unique names!`,
    });
  } catch (error: any) {
    console.error("[api/admin/reviews/generate] Error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate reviews" }, { status: 500 });
  }
}
