import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const ACCESS_TOKEN_COOKIE = "access_token";

type TokenPayload = { userId: string; role: string };

async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as TokenPayload;
  } catch {
    return null;
  }
}

function redirect(request: NextRequest, path: string) {
  const url = request.nextUrl.clone();
  url.pathname = path;
  return NextResponse.redirect(url);
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  const payload = token ? await verifyToken(token) : null;
  const { pathname } = request.nextUrl;

  // Admin routes: must be logged in with Admin role
  if (pathname.startsWith("/homeadmin")) {
    if (!payload) return redirect(request, "/login");
    if (payload.role !== "Admin") return redirect(request, "/");
  }

  // Auth-required routes
  if (pathname.startsWith("/profile")) {
    if (!payload) return redirect(request, "/login");
  }

  // Guest-only routes: redirect if already logged in
  if (["/login", "/register", "/requestreset"].some((r) => pathname.startsWith(r))) {
    if (payload) {
      return redirect(request, payload.role === "Admin" ? "/homeadmin" : "/");
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/homeadmin/:path*", "/profile/:path*", "/login", "/register", "/requestreset"],
};
