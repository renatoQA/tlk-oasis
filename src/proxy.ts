import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { homeForRole } from "@/lib/session";
import { db } from "@/lib/db";

const SESSION_COOKIE_NAMES = ["authjs.session-token", "__Secure-authjs.session-token"];

function redirectToLoginAndClearSession(url: string) {
  const response = NextResponse.redirect(new URL("/login", url));
  for (const name of SESSION_COOKIE_NAMES) {
    response.cookies.delete(name);
  }
  return response;
}

export default auth(async (req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  const isAuthRoute =
    pathname.startsWith("/login") ||
    pathname.startsWith("/invite") ||
    pathname.startsWith("/no-account");

  if (!session && !isAuthRoute) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (session?.user?.id) {
    const stillExists = await db.user.findUnique({
      where: { id: session.user.id },
      select: { id: true },
    });
    if (!stillExists) {
      return redirectToLoginAndClearSession(req.url);
    }
  }

  if (session && pathname === "/login") {
    return NextResponse.redirect(new URL(homeForRole(session.user.role), req.url));
  }

  const role = session?.user.role;

  if (pathname.startsWith("/admin") && role !== "ADMIN") {
    return NextResponse.redirect(new URL(homeForRole(role), req.url));
  }

  if (pathname.startsWith("/coach") && role !== "COACH" && role !== "ADMIN") {
    return NextResponse.redirect(new URL(homeForRole(role), req.url));
  }

  if (pathname.startsWith("/player") && role !== "PLAYER" && role !== "ADMIN") {
    return NextResponse.redirect(new URL(homeForRole(role), req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
