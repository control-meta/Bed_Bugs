import { NextRequest, NextResponse } from "next/server";
import { createEnquiry } from "@/lib/supabase";
import {
  checkSubmissionRateLimit,
  getClientIp,
  isHoneypotTriggered,
  sanitizeString,
  validateIndianMobile,
} from "@/lib/security";
import { sendNewEnquiryEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const clientIp = getClientIp(request);

    // 1. Rate Limiting Check
    const rateLimit = checkSubmissionRateLimit(clientIp);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: `Too many submissions. Please wait ${rateLimit.retryAfterSeconds} seconds before trying again.`,
        },
        { status: 429 },
      );
    }

    const body = await request.json().catch(() => ({}));

    // 2. Honeypot check for automated spambots
    if (isHoneypotTriggered(body.hp_field) || isHoneypotTriggered(body.website)) {
      // Silently accept without saving to drop bots
      return NextResponse.json({
        success: true,
        message: "Your request has been received.",
      });
    }

    // 3. Extract and sanitize fields
    const name = sanitizeString(body.name, 100);
    const phone = sanitizeString(body.phone, 15).replace(/\D/g, "");
    const email = sanitizeString(body.email, 120);
    const city = sanitizeString(body.city, 80);
    const property_type = sanitizeString(body.property || body.property_type, 80);
    const message = sanitizeString(body.message, 1000);
    const source = sanitizeString(body.source || "website", 60);
    const source_url = sanitizeString(body.sourceUrl || body.source_url, 200);

    // 4. Validate core fields
    if (!name || name.length < 2) {
      return NextResponse.json(
        { error: "Please provide your full name (minimum 2 characters)." },
        { status: 400 },
      );
    }

    if (!validateIndianMobile(phone)) {
      return NextResponse.json(
        {
          error:
            "Please provide a valid 10-digit Indian mobile number (e.g. 9876543210).",
        },
        { status: 400 },
      );
    }

    // 5. Store Enquiry in Supabase (or local fallback)
    const newEnquiry = await createEnquiry({
      name,
      phone,
      email: email || null,
      city: city || null,
      property_type: property_type || null,
      message: message || null,
      source,
      source_url: source_url || null,
      status: "new",
      notes: null,
    });

    // 6. Send email notification asynchronously
    sendNewEnquiryEmail({
      id: String(newEnquiry.id),
      name,
      phone,
      email: email || null,
      city: city || null,
      property_type: property_type || null,
      message: message || null,
      source,
    }).catch(err => console.error("Async email failed:", err));

    return NextResponse.json(
      {
        success: true,
        message: "Enquiry submitted successfully.",
        id: newEnquiry.id,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating enquiry:", error);
    return NextResponse.json(
      { error: "Failed to submit enquiry. Please call us directly." },
      { status: 500 },
    );
  }
}
