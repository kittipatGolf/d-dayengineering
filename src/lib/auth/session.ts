import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ACCESS_TOKEN_COOKIE } from "./constants";
import { verifyAccessToken, type AccessTokenPayload } from "./jwt";

export async function getSession(): Promise<AccessTokenPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
  if (!token) return null;
  return verifyAccessToken(token);
}

export async function requireSession(): Promise<AccessTokenPayload> {
  const session = await getSession();
  if (!session) {
    throw NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return session;
}

export async function requireAdmin(): Promise<AccessTokenPayload> {
  const session = await requireSession();
  if (session.role !== "Admin") {
    throw NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return session;
}
