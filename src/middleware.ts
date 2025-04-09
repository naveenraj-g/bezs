// import axios from "axios";
// import { NextRequest, NextResponse } from "next/server";
// import { Session } from "./modules/auth/types/auth-types";

// async function getMiddlewareSession(req: NextRequest) {
//   const { data: session } = await axios.get<Session>("/api/auth/get-session", {
//     baseURL: req.nextUrl.origin,
//     headers: {
//       cookie: req.headers.get("cookie") || "",
//     },
//   });

//   return session;
// }

// const publicRoutes = ["/sign", "/email-verification", "/reset-password"];
// const protectedRoutes = ["/bezs"];

// export async function middleware(req: NextRequest) {
//   const session = await getMiddlewareSession(req);
//   const url = req.url;
//   const pathname = req.nextUrl.pathname;
//   console.log("Middleware");

//   if (publicRoutes.some((route) => pathname.startsWith(route))) {
//     return session
//       ? NextResponse.redirect(new URL("/bezs", url))
//       : NextResponse.next();
//   }

//   if (protectedRoutes.some((route) => pathname.startsWith(route))) {
//     return session
//       ? NextResponse.next()
//       : NextResponse.redirect(new URL("/signin", url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   //   runtime: "nodejs",
//   matcher: [
//     // Skip Next.js internals and all static files, unless found in search params
//     "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
//     // Always run for API routes
//     "/(api|trpc)(.*)",
//   ],
// };

import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
