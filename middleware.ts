import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // normalize pathname (ignore trailing slash differences)
  const normalized = pathname.replace(/\/+$/, "") || "/";

  const protectedPaths = ["/admin/dashboard", "/admin/panel"];
  const loginPath = "/admin/login";

  const cookie = req.cookies.get("admin-auth");
  // cookie can be a string or an object depending on environment; normalize
  const cookieVal = cookie && (typeof cookie === "string" ? cookie : (cookie as any).value);
  const isAdmin = cookieVal === "true";

  // If accessing a protected path and not admin -> redirect to login
  if (protectedPaths.some((p) => normalized.startsWith(p))) {
    if (!isAdmin) {
      const url = req.nextUrl.clone();
      url.pathname = loginPath;
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // If accessing the login page while already logged in -> redirect to dashboard
  if (normalized === loginPath) {
    if (isAdmin) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/dashboard";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/dashboard", "/admin/panel", "/admin/login"],
};
