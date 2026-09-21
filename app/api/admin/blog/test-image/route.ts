import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import {
  buildBlogImagePlan,
  generateFreshBlogImage,
  normalizeBlogImageModel,
} from "@/lib/blog/ai-image-generator";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function POST(req: NextRequest) {
  try {
    const { topic, prompt, model } = await req.json();

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY is not configured" },
        { status: 500 }
      );
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const imageTopic = String(topic || prompt || "Bed Bug Inspection and Treatment Guide").trim();
    const plan = buildBlogImagePlan({ topic: imageTopic });
    const image = await generateFreshBlogImage({
      openai,
      model,
      topic: imageTopic,
      spec: plan.top,
      signal: req.signal,
    });

    return NextResponse.json({
      success: true,
      url: image.url,
      raw_response: {
        model: normalizeBlogImageModel(model),
        role: image.role,
        alt: image.alt,
      },
    });

  } catch (error: any) {
    console.error("[Test Image Route Error]", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate test image" },
      { status: 500 }
    );
  }
}
