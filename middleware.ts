import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import APIURL from "./components/URL";

// تعريف الأنواع
type Role = "admin" | "user";

interface User {
  role: Role;
}


// تكوين المسارات
const ROUTES_CONFIG = {
  protected: ["/user", "/user/orders", "/user/security-settings"],
  public: ["/login", "/register"],
  admin: ["/admin"],
  defaultRedirects: {
    unauthenticated: "/login",
    authenticated: "/user",
    unauthorized: "/user",
  },
} as const;

/**
 * التحقق من صلاحية التوكن وجلب بيانات المستخدم
 */
async function getUserFromToken(token: string) {
  try {
    const response = await fetch(`${APIURL}/user/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store", // مهم لتجنب التخزين المؤقت
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }

    const data = await response.json();

    if (!data || Object.keys(data).length === 0) {
      throw new Error("No user data found");
    }

    return data;
  } catch (error) {
    console.error("[Middleware] Error fetching user:", error);
    return null;
  }
}

/**
 * إنشاء URL للتوجيه
 */
function createRedirectUrl(path: string, requestUrl: string): URL {
  return new URL(path, requestUrl);
}

/**
 * التحقق مما إذا كان المسار يتطابق مع أي من المسارات المحددة
 */
function isPathMatching(pathname: string, routes: string[]): boolean {
  return routes.some((route) => pathname.startsWith(route));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // الحصول على التوكن من الكوكيز باستخدام NextRequest
  const token = request.cookies.get("token")?.value;

  // التحقق من نوع المسار
  const isProtectedRoute = isPathMatching(pathname, ROUTES_CONFIG.protected);
  const isPublicRoute = isPathMatching(pathname, ROUTES_CONFIG.public);
  const isAdminRoute = isPathMatching(pathname, ROUTES_CONFIG.admin);

  // جلب بيانات المستخدم إذا كان التوكن موجودًا
  const user = token ? await getUserFromToken(token) : null;

  // التعامل مع المسارات المحمية
  if (isProtectedRoute || isAdminRoute) {
    if (!user) {
      return NextResponse.redirect(
        createRedirectUrl(
          ROUTES_CONFIG.defaultRedirects.unauthenticated,
          request.url
        )
      );
    }

    // التحقق من صلاحيات المستخدم للمسارات الإدارية
    if (isAdminRoute && user.role !== "admin") {
      return NextResponse.redirect(
        createRedirectUrl(
          ROUTES_CONFIG.defaultRedirects.unauthorized,
          request.url
        )
      );
    }
  }

  // منع الوصول إلى صفحات تسجيل الدخول للمستخدمين المسجلين
  if (isPublicRoute && user) {
    return NextResponse.redirect(
      createRedirectUrl(
        ROUTES_CONFIG.defaultRedirects.authenticated,
        request.url
      )
    );
  }

  // السماح بالمتابعة في الحالات الأخرى
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/user/:path*",
    "/cart/checkout",
    "/login",
    "/register",
    "/admin/:path*",
  ],
};
