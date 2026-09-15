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

  // 2. Protect Admin UI routes (/admin, /admin/...)
  // Require valid login session. Redirect unauthenticated visitors to /admin/login.
  if (isAdminPage) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/admin/login", request.url);
      if (pathname !== "/admin") {
        loginUrl.searchParams.set("redirect", pathname);
      }
      return NextResponse.redirect(loginUrl);
    }
    return addSecurityHeaders(NextResponse.next());
  }

  // 3. Protect Admin API routes (/api/admin/...)
  // Exclude /api/admin/login from the block
  if (isAdminApi && pathname !== "/api/admin/login") {
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: "Unauthorized. Admin session required." },
        { status: 401 },
      );
    }
    return addSecurityHeaders(NextResponse.next());
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
