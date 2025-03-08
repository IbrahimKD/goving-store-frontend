import { NextResponse, NextRequest } from "next/server";
import { fetchUser } from "./lib/actions/user/fetchUser";

const ROUTES_CONFIG = {
  protected: ["/user", "/cart/checkout"],
  admin: ["/admin"],
  auth: ["/login", "/register"],
  redirects: {
    unAuthenticated: "/login",
    notAdmin: "/user",
    authenticated: "/user",
  },
};

const isPathRight = (routes: any, pathname: string) => {
  return routes.some((route: string) => pathname.startsWith(route));
};

const createRedirectUrl = (path: string, requestURL: string) => {
  return new URL(path, requestURL);
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token");
  const user = await fetchUser(token);
  console.log(user, "user ");
  const isProtected = isPathRight(ROUTES_CONFIG.protected, pathname);
  const isAdmin = isPathRight(ROUTES_CONFIG.admin, pathname);
  const isAuth = isPathRight(ROUTES_CONFIG.auth, pathname);
  if (isProtected || isAdmin) {
    if (!user) {
      return NextResponse.redirect(
        createRedirectUrl(ROUTES_CONFIG.redirects.unAuthenticated, request.url)
      );
    }
    if (isAdmin && user.role !== "admin") {
      return NextResponse.redirect(
        createRedirectUrl(ROUTES_CONFIG.redirects.notAdmin, request.url)
      );
    }
  }
  console.log(isAuth);
  if (user && user?.role === "user" && isAuth) {
    return NextResponse.redirect(
      createRedirectUrl(ROUTES_CONFIG.redirects.authenticated, request.url)
    );
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin",
    "/admin/:path*", // التأكد من تضمين جميع المسارات الفرعية الخاصة بـ /admin
    "/user",
    "/user/:path*",
    "/cart/checkout",
    "/login",
    "/register",
  ],
};
