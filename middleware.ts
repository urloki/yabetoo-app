import NextAuth from "next-auth";
import authConfig from "@/auth.config";
import createIntlMiddleware from "next-intl/middleware";

import {
  apiAuthRoutes,
  authRoutes,
  DEFAULT_LOGIN_REDIRECT,
  publicRoutes,
} from "@/routes";
import type { NextRequest } from "next/server";
import { i18n } from "@/app.config";

const intlMiddleware = createIntlMiddleware({
  locales: i18n.locales,
  defaultLocale: i18n.defaultLocale,
  localePrefix: "never",
});

const { auth } = NextAuth(authConfig);

const authMiddleware = auth(async (req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthRoutes);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  //const organizations = await getOrganizations();

  //console.log(organizations);

  /*if (isLoggedIn && isAdminRoute) {
    const user = req.auth?.user;
    //const session = await req.
    console.log(user);
    if (!req.auth?.user.roles.includes("admin")) {
      return Response.redirect(new URL("/login", nextUrl));
    }
  }*/

  if (isApiAuthRoute) {
    return;
  }

  if (isPublicRoute) {
    return;
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return;
  }

  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL("/login", nextUrl));
  }

  if (isLoggedIn && nextUrl.pathname === "/") {
    return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
  }

  if (nextUrl.pathname === "/auth/register") {
    return Response.redirect(new URL("/login", nextUrl));
  }

  if (isLoggedIn) {
    return intlMiddleware(req); // Apply internationalization for logged-in users
  }
});

export default function middleware(req: NextRequest) {
  const publicPathnameRegex = RegExp(
    `^(/(${i18n.locales.join("|")}))?(${authRoutes
      .flatMap((p) => (p === "/" ? ["", "/"] : p))
      .join("|")})/?$`,
    "i",
  );
  const isPublicPage = publicPathnameRegex.test(req.nextUrl.pathname);

  if (isPublicPage) {
    return intlMiddleware(req); // Apply internationalization for public pages
  }
  return (authMiddleware as any)(req); // Apply authentication logic for non-public pages
}

export const config = {
  matcher: [
    "/((?!.+\\.[\\w]+$|_next).*)",
    "/",
    "/(api|trpc)(.*)",
    "/(fr|en)/:path*",
  ],
};
