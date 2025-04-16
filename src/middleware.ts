import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { Session } from "./modules/auth/types/auth-types";

import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// export default createMiddleware(routing);

const I18nMiddleware = createMiddleware(routing);

async function getMiddlewareSession(req: NextRequest) {
  const { data: session } = await axios.get<Session>("/api/auth/get-session", {
    baseURL: req.nextUrl.origin,
    headers: {
      cookie: req.headers.get("cookie") || "",
    },
  });

  return session;
}

const getPathWithoutLocale = (pathname: string): string => {
  const parts = pathname.split("/");
  return parts.length > 2 ? `/${parts.slice(2).join("/")}` : "/";
};

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
  console.log("Middleware");

  const [, locale] = req.nextUrl.pathname.split("/");
  const refinedPathname = getPathWithoutLocale(pathname);

  const res = I18nMiddleware(req);

  if (refinedPathname.includes("admin") && session?.user?.role !== "admin") {
    return NextResponse.redirect(new URL("/", url));
  }

  if (publicRoutes.some((route) => refinedPathname.startsWith(route))) {
    // const locale = req.cookies.get("NEXT_LOCALE")?.value || "en";
    return session
      ? NextResponse.redirect(new URL("/bezs", url))
      : NextResponse.next();
  }

  if (protectedRoutes.some((route) => refinedPathname.startsWith(route))) {
    return session
      ? NextResponse.next()
      : NextResponse.redirect(new URL("/signin", url));
  }

  // return NextResponse.next();
  return res;
}

// export const config = {
//   matcher: [
//     "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
//     "/(api|trpc)(.*)",
//   ],
// };

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
  // matcher: ["/", "/(en|hi)/:path*"],
};
