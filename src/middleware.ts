import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Allow access to static assets, API routes, and images
  if (
    request.nextUrl.pathname.startsWith("/_next") ||
    request.nextUrl.pathname.startsWith("/static") ||
    request.nextUrl.pathname.startsWith("/api") ||
    request.nextUrl.pathname.startsWith("/images") ||
    request.nextUrl.pathname.startsWith("/assets") ||
    request.nextUrl.pathname.endsWith(".ico") ||
    request.nextUrl.pathname.endsWith(".png") ||
    request.nextUrl.pathname.endsWith(".jpg") ||
    request.nextUrl.pathname.endsWith(".jpeg") ||
    request.nextUrl.pathname.endsWith(".webp") ||
    request.nextUrl.pathname.endsWith(".svg") ||
    request.nextUrl.pathname === "/"
  ) {
    return NextResponse.next();
  }

  // Redirect all other routes to the maintenance page
  return NextResponse.redirect(new URL("/", request.url));
}

export const config = {
  matcher: "/:path*",
};
