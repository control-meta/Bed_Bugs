import { NextRequest, NextResponse } from "next/server";
import { getBlogById, saveBlog } from "@/lib/blog-db";
import OpenAI from "openai";
import { EDITOR_SYSTEM_PROMPT } from "@/lib/blog/editor-prompt";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const blog = await getBlogById(id);

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "OPENAI_API_KEY is not configured" }, { status: 500 });
    }

    const body = await request.json().catch(() => ({}));
    const chosenTitle = body.title || blog.title;
    const chosenKeywords = body.keywords || blog.keywords || [blog.primaryKeyword];
    const primaryKeyword = body.primaryKeyword || blog.primaryKeyword || chosenKeywords[0] || blog.slug.replace(/-/g, " ");
    const skipImages = Boolean(body.skipImages);

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const prompt = `
You are the Senior Pest-Control Content Editor and SEO Strategist for BedBugsTreatment.co.in.

Generate a comprehensive, publication-grade, evidence-backed blog post for Indian homeowners and renters.

TITLE:
${chosenTitle}

PRIMARY KEYWORD:
${primaryKeyword}

SECONDARY KEYWORDS:
${chosenKeywords.join(", ")}

EXISTING SLUG (URL MUST REMAIN PRESERVED):
${blog.slug}

INSTRUCTIONS:
1. Write a complete, high-value, practical, 1500-2200 word guide.
2. Structure with a compelling introduction, clear H2 and H3 subheadings, actionable checklists (mattress inspection, furniture checks, travel protocols), treatment method comparisons (chemical, steam, odorless spray), and safe DIY limitations.
3. Include an FAQ section with 4-6 detailed questions and answers.
4. DO NOT include a References section at the end; references are handled separately by the system.
${skipImages ? "5. IMPORTANT: SKIP ALL IMAGES. Do NOT include any markdown images, image placeholders, or visual placement tags." : "5. You may suggest 1-2 relevant visual aids using markdown notes where helpful."}

Ensure the output is clean, formatted Markdown starting directly with:
# ${chosenTitle}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You write authoritative, evidence-backed pest control guides formatted in clean Markdown.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.4,
    });

    const newMarkdown = response.choices[0]?.message?.content?.trim();

    if (!newMarkdown) {
      throw new Error("AI failed to generate updated content");
    }

    // Calculate word count and read time
    const words = newMarkdown.split(/\s+/).filter(Boolean).length;
    const readTime = `${Math.max(1, Math.round(words / 200))} min read`;

    // Update blog with same URL/slug
    const updated = {
      ...blog,
      title: chosenTitle,
      primaryKeyword,
      keywords: Array.isArray(chosenKeywords) ? chosenKeywords : [primaryKeyword],
      markdown: newMarkdown,
      readTime,
      revisionCount: (blog.revisionCount || 0) + 1,
      // If user wanted skipImages, remove imageUrl or keep existing?
      // Keep existing featured image unless explicitly asked, but markdown has no image tags
    };

    const { blog: saved, backend } = await saveBlog(updated);

    return NextResponse.json({
      success: true,
      blog: saved,
      backend,
      message: "Blog successfully regenerated with identical URL!",
    });
  } catch (err: any) {
    console.error("[api/admin/blogs/[id]/regenerate] Error:", err);
    return NextResponse.json({ error: err.message || "Failed to regenerate blog" }, { status: 500 });
  }
}
