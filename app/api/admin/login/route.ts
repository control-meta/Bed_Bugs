import { NextRequest, NextResponse } from "next/server";
import {
  checkLoginLockout,
  createAdminToken,
  recordFailedLogin,
  resetLoginAttempts,
  SESSION_COOKIE_NAME,
  verifyAdminCredentials,
} from "@/lib/auth";
import { getClientIp, sanitizeString } from "@/lib/security";

export async function POST(request: NextRequest) {
  try {
    const clientIp = getClientIp(request);

    // 1. Check if IP is temporarily locked out
    const lockout = checkLoginLockout(clientIp);
    if (lockout.isLocked) {
      return NextResponse.json(
        {
          error: `Too many failed login attempts. For security, access is temporarily locked. Please try again in ${lockout.remainingMinutes} minute(s).`,
        },
        { status: 429 },
      );
    }

    const body = await request.json().catch(() => ({}));
    const username = sanitizeString(body.username, 80);
    const password = typeof body.password === "string" ? body.password : "";

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required." },
        { status: 400 },
      );
    }

    // 2. Timing-safe verification
    const isValid = verifyAdminCredentials(username, password);

    if (!isValid) {
      const failStatus = recordFailedLogin(clientIp);
      if (failStatus.isNowLocked) {
        return NextResponse.json(
          {
            error:
              "Maximum failed attempts reached. Your IP has been temporarily locked for 15 minutes.",
          },
          { status: 429 },
        );
      }
      return NextResponse.json(
        {
          error: `Invalid admin credentials. (${failStatus.remainingAttempts} attempt(s) remaining before lockout)`,
        },
        { status: 401 },
      );
    }

    // 3. Clear failed attempts upon successful authentication
    resetLoginAttempts(clientIp);

    // 4. Create signed JWT session
    const token = await createAdminToken(username);

    // 5. Create Response and attach HttpOnly, SameSite=Strict cookie
    const response = NextResponse.json({
      success: true,
      message: "Login successful.",
      redirect: "/admin",
    });

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 24 * 60 * 60, // 24 hours
    });

    return response;
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during login." },
      { status: 500 },
    );
  }
}
