import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { Session } from "./modules/auth/types/auth-types";

async function getMiddlewareSession(req: NextRequest): Promise<Session | null> {
  try {
    const response = await fetch(`${req.nextUrl.origin}/api/auth/get-session`, {
      method: "GET",
      headers: {
        Cookie: req.headers.get("cookie") || "",
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
      cache: "no-store",
      credentials: "same-origin",
    });

    if (!response.ok) {
      if (response.status === 500) {
        console.error("Session API error:", await response.text());
      }
      return null;
    }

    const session: Session = await response.json();
    return session;
  } catch (error) {
    console.error("Error fetching session:", error);
    return null;
  }
}

function matchRoute(pathname: string, route: string): boolean {
  return pathname === route || pathname.startsWith(`${route}`);
}

const authRoutes = [
  "/sign",
  "/email-verification",
  "/reset-password",
  "/2fa-verification",
];
const protectedRoutes = ["/bezs"];

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const url = req.url;

  // Skip only for session API
  if (pathname === "/api/auth/get-session") {
    return NextResponse.next();
  }

  const session = await getMiddlewareSession(req);

  // Check if trying to access public routes while logged in
  if (authRoutes.some((route) => matchRoute(pathname, route))) {
    return session
      ? NextResponse.redirect(new URL("/bezs", url))
      : NextResponse.next();
  }

  // Handle protected routes
  if (!session) {
    return NextResponse.redirect(new URL("/signin", url));
  }

  if (pathname.startsWith("/bezs/admin") && session?.user?.role !== "admin") {
    return NextResponse.redirect(new URL("/", url));
  }

  if (protectedRoutes.some((route) => matchRoute(pathname, route))) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Only match non-api routes except signin
    "/((?!api|_next|.*\\..*).*)",
    "/bezs/:path*",
  ],
};
