import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin")) {
    const token = request.cookies.get("admin_token")?.value;

    if (!token) {
      const loginUrl = new URL("/admin", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // ── Decode & validate cookie payload ──────────────────
    try {
      const decoded = JSON.parse(Buffer.from(token, "base64").toString("utf-8"));

      // Must have id and a valid role
      if (!decoded.id || !["admin", "superadmin", "moderator"].includes(decoded.role)) {
        throw new Error("Invalid token payload");
      }
    } catch {
      // Tampered or invalid cookie → clear it and redirect
      const loginUrl = new URL("/admin", request.url);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete("admin_token");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};