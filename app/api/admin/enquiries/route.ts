import { NextRequest, NextResponse } from "next/server";
import { deleteEnquiry, getEnquiries, updateEnquiry } from "@/lib/supabase";
import { sanitizeString } from "@/lib/security";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("q") || undefined;
    const status = searchParams.get("status") || undefined;
    const source = searchParams.get("source") || undefined;
    const limitParam = searchParams.get("limit");
    const limit = limitParam ? parseInt(limitParam, 10) : 100;

    const result = await getEnquiries({
      search,
      status,
      source,
      limit,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Admin GET enquiries error:", error);
    return NextResponse.json(
      { error: "Failed to fetch enquiries." },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const id = sanitizeString(body.id, 80);
    const status = body.status;
    const notes = body.notes !== undefined ? sanitizeString(body.notes, 2000) : undefined;

    if (!id) {
      return NextResponse.json(
        { error: "Enquiry ID is required." },
        { status: 400 },
      );
    }

    const validStatuses = [
      "new",
      "contacted",
      "scheduled",
      "completed",
      "cancelled",
    ];

    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` },
        { status: 400 },
      );
    }

    const updated = await updateEnquiry(id, {
      ...(status ? { status } : {}),
      ...(notes !== undefined ? { notes } : {}),
    });

    if (!updated) {
      return NextResponse.json(
        { error: "Enquiry not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, enquiry: updated });
  } catch (error) {
    console.error("Admin PATCH enquiry error:", error);
    return NextResponse.json(
      { error: "Failed to update enquiry." },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    let id = searchParams.get("id");

    if (!id) {
      const body = await request.json().catch(() => ({}));
      id = body.id;
    }

    if (!id) {
      return NextResponse.json(
        { error: "Enquiry ID is required." },
        { status: 400 },
      );
    }

    const success = await deleteEnquiry(id);
    return NextResponse.json({ success });
  } catch (error) {
    console.error("Admin DELETE enquiry error:", error);
    return NextResponse.json(
      { error: "Failed to delete enquiry." },
      { status: 500 },
    );
  }
}
