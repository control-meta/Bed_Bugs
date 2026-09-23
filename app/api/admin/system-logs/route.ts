import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const LOG_FILE_PATH = path.join(process.cwd(), ".auto_publish_terminal.log");

    if (!fs.existsSync(LOG_FILE_PATH)) {
      return new NextResponse("No terminal logs found yet.", {
        status: 200,
        headers: { "Content-Type": "text/plain" },
      });
    }

    const content = fs.readFileSync(LOG_FILE_PATH, "utf8");
    
    return new NextResponse(content, {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  } catch (err: any) {
    console.error("[api/admin/system-logs] GET error:", err);
    return new NextResponse(`Failed to fetch system logs: ${err.message}`, {
      status: 500,
      headers: { "Content-Type": "text/plain" },
    });
  }
}
