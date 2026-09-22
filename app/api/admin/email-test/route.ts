import { NextResponse } from "next/server";
import { sendTestEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    await sendTestEmail();
    return NextResponse.json({ success: true, message: "Test email sent successfully." });
  } catch (error: any) {
    console.error("Test email route error:", error);
    return NextResponse.json({ success: false, error: error.message || "Failed to send email" }, { status: 500 });
  }
}
