import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    apiKeySet: !!process.env.OPENAI_API_KEY,
    researchModel: process.env.OPENAI_RESEARCH_MODEL || "gpt-4o",
    writingModel: process.env.OPENAI_BLOG_MODEL || "gpt-4o",
    sourceVerificationEnabled: true,
    maxRevisions: Math.max(0, Math.min(2, Number(process.env.BLOG_MAX_REVISIONS || 2))),
  });
}
