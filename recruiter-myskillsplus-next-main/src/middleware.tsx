import { NextResponse, type NextRequest } from "next/server";

const authRoutes = ["/auth/signin", "/auth/signup"];
const protectedRoutes = ["/export", "/view-360-feedback", "/request-360-feedback"];

export function middleware(request: NextRequest) {
  const isLogin = request.cookies.has("iysauth.session-token");
  const { nextUrl, url } = request;

  // If the user is already logged in, redirect away from authentication routes
  if (isLogin && authRoutes.includes(nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/", url));
  }

  // If the user is not logged in and trying to access protected routes, redirect to sign-in
  if (!isLogin && protectedRoutes.includes(nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/auth/signin", url));
  }

  // Allow the request to proceed if no redirection is needed
  return NextResponse.next();
}
