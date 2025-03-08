import { type NextRequest, NextResponse } from "next/server";

import { getSessionCookie } from "better-auth";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const authRoutes = [
    "/sign-in",
    "/sign-up",
    "/forgot-password",
    "/reset-password",
  ]; // auth routes
  const protectedRoutes = [
    "/dashboard",
    "/clients",
    "/projects",
    "/organizations",
    "/profile",
  ]; // protected routes

  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  const cookies = getSessionCookie(request);
  // const cookies = request.cookies.has("better-auth.session_token");

  if (cookies) {
    if (isAuthRoute) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
  }

  if (isProtectedRoute) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",

    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    // "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|favicon-light.svg|favicon-dark.svg).*)",
  ],
};
