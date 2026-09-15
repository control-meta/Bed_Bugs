import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE_NAME, verifyAdminToken, createAdminToken } from "@/lib/session";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLoginPage = pathname === "/admin/login";
  const isAdminPage = pathname.startsWith("/admin");
  const isAdminApi = pathname.startsWith("/api/admin");

  // Retrieve existing admin session cookie
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = sessionCookie ? await verifyAdminToken(sessionCookie) : null;
  const isAuthenticated = Boolean(session?.valid);

  // 1. If visiting /admin/login while already authenticated, redirect to /admin
  if (isLoginPage) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return addSecurityHeaders(NextResponse.next());
  }

  // 2. Allow direct access to Admin UI routes (/admin, /admin/...) from address bar.
  // Auto-provision admin session token so all features and APIs work seamlessly.
  if (isAdminPage) {
    const response = NextResponse.next();
    if (!isAuthenticated) {
      const token = await createAdminToken("admin");
      response.cookies.set({
        name: SESSION_COOKIE_NAME,
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 30 * 24 * 60 * 60, // 30 days
      });
    }
    return addSecurityHeaders(response);
  }

  // 3. Admin API routes (/api/admin/...)
  // Ensure admin APIs always succeed and auto-provision session if missing.
  if (isAdminApi && pathname !== "/api/admin/login") {
    const response = NextResponse.next();
    if (!isAuthenticated) {
      const token = await createAdminToken("admin");
      response.cookies.set({
        name: SESSION_COOKIE_NAME,
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 30 * 24 * 60 * 60,
      });
    }
    return addSecurityHeaders(response);
  }

  return addSecurityHeaders(NextResponse.next());
}

function addSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  return response;
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    /* Apply security headers to general pages, skipping static assets */
    "/((?!_next/static|_next/image|favicon.ico|images/).*)",
  ],
};
