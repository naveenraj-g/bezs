import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { Session } from "./modules/auth/types/auth-types";

async function getMiddlewareSession(req: NextRequest) {
  const { data: session } = await axios.get<Session>("/api/auth/get-session", {
    baseURL: req.nextUrl.origin,
    headers: {
      cookie: req.headers.get("cookie") || "",
    },
  });

  return session;
}

function matchRoute(pathname: string, route: string): boolean {
  return pathname === route || pathname.startsWith(`${route}`);
}

const publicRoutes = [
  "/sign",
  "/email-verification",
  "/reset-password",
  "/2fa-verification",
];
const protectedRoutes = ["/bezs"];

export async function middleware(req: NextRequest) {
  const session = await getMiddlewareSession(req);
  const url = req.url;
  const pathname = req.nextUrl.pathname;

  if (!session) {
    return NextResponse.redirect(new URL("/signin", url));
  }

  if (pathname.startsWith("/bezs/admin") && session?.user?.role !== "admin") {
    return NextResponse.redirect(new URL("/", url));
  }

  if (publicRoutes.some((route) => matchRoute(pathname, route))) {
    return session
      ? NextResponse.redirect(new URL("/bezs", url))
      : NextResponse.next();
  }

  if (protectedRoutes.some((route) => matchRoute(pathname, route))) {
    return session
      ? NextResponse.next()
      : NextResponse.redirect(new URL("/signin", url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
