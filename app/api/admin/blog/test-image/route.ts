import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function POST(req: NextRequest) {
  try {
    const { prompt, model } = await req.json();

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY is not configured" },
        { status: 500 }
      );
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const response = await openai.images.generate({
      model: model || "gpt-image-2.5-flare",
      prompt: prompt || "A professional, high quality photorealistic image about pest control.",
      n: 1,
      size: "1024x1024",
    });

    const imgData = response.data?.[0];
    const imageUrl = imgData?.url || (imgData?.b64_json ? `data:image/png;base64,${imgData.b64_json}` : null);

    if (imageUrl) {
      return NextResponse.json({ 
        success: true, 
        url: imageUrl,
        raw_response: imgData
      });
    } else {
      throw new Error("No URL or b64_json returned. Raw response: " + JSON.stringify(response));
    }

  } catch (error: any) {
    console.error("[Test Image Route Error]", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate test image" },
      { status: 500 }
    );
  }
}
