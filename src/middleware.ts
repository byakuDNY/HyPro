import { type NextRequest, NextResponse } from "next/server";

import { betterFetch } from "@better-fetch/fetch";

import type { Session } from "@/lib/auth";

import envConfig from "./lib/env-config";

const publicRoutes = ["/", "/pricing"];
const authRoutes = ["/sign-in", "/sign-up", "/forgot-password"];

export default async function authMiddleware(request: NextRequest) {
  const pathName = request.nextUrl.pathname;

  const isPublicRoute = publicRoutes.includes(pathName);
  const isAuthRoute = authRoutes.includes(pathName);

  try {
    const { data: session } = await betterFetch<Session>(
      "/api/auth/get-session",
      {
        baseURL: envConfig.baseUrl,
        headers: {
          //get the cookie from the request
          cookie: request.headers.get("cookie") || "",
        },
        timeout: 5000,
      },
    );

    if (isPublicRoute) {
      return NextResponse.next();
    }

    if (!session) {
      if (isAuthRoute) {
        return NextResponse.next();
      }

      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    if (isAuthRoute) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Error fetching session:", error);
    if (isPublicRoute || isAuthRoute) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|favicon-light.svg|favicon-dark.svg).*)",
  ],
};
