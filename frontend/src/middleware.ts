import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Check for auth token in cookies (set by auth-client from localStorage on client)
  // Note: Middleware runs on the server, so we can't access localStorage directly
  // Instead, we check if there's a token cookie or authorization header
  const authToken = request.cookies.get("auth_token")?.value;
  const { pathname } = request.nextUrl;

  // Protected routes
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/tasks")) {
    if (!authToken) {
      // Redirect to login if no auth token
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Public routes (redirect to dashboard if logged in)
  if (pathname === "/login" || pathname === "/signup") {
    if (authToken) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/tasks/:path*", "/login", "/signup"],
};
