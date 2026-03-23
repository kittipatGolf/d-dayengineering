import { prisma } from "@/lib/prisma";
import { REFRESH_TOKEN_COOKIE, REFRESH_TOKEN_EXPIRY_DAYS } from "@/lib/auth/constants";
import { verifyRefreshToken, signAccessToken, signRefreshToken } from "@/lib/auth/jwt";
import { setAuthCookies, clearAuthCookies } from "@/lib/auth/cookies";
import { checkRateLimit, getClientIp, recordFailedAttempt } from "@/lib/auth/rate-limit";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const rl = checkRateLimit(`refresh:${ip}`, 20, 15 * 60 * 1000);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "คำขอมากเกินไป กรุณารอสักครู่" },
      { status: 429 },
    );
  }

  const rateLimitKey = `refresh:${ip}`;
  const refreshJwt = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;
  if (!refreshJwt) {
    recordFailedAttempt(rateLimitKey, 15 * 60 * 1000);
    return NextResponse.json({ error: "No refresh token" }, { status: 401 });
  }

  const payload = await verifyRefreshToken(refreshJwt);
  if (!payload) {
    recordFailedAttempt(rateLimitKey, 15 * 60 * 1000);
    const response = NextResponse.json({ error: "Invalid refresh token" }, { status: 401 });
    return clearAuthCookies(response);
  }

  const storedToken = await prisma.refreshToken.findUnique({
    where: { id: payload.tokenId },
    include: { user: true },
  });

  if (!storedToken) {
    const response = NextResponse.json({ error: "Token not found" }, { status: 401 });
    return clearAuthCookies(response);
  }

  // Replay detection: if token was already revoked, revoke ALL tokens for this user
  if (storedToken.revokedAt) {
    await prisma.refreshToken.updateMany({
      where: { userId: storedToken.userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
    const response = NextResponse.json({ error: "Token reuse detected" }, { status: 401 });
    return clearAuthCookies(response);
  }

  if (storedToken.expiresAt < new Date()) {
    const response = NextResponse.json({ error: "Token expired" }, { status: 401 });
    return clearAuthCookies(response);
  }

  // Rotate: revoke old, create new
  const newTokenRecord = await prisma.refreshToken.create({
    data: {
      token: crypto.randomUUID(),
      userId: storedToken.userId,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.refreshToken.update({
    where: { id: storedToken.id },
    data: { revokedAt: new Date(), replacedByToken: newTokenRecord.token },
  });

  const user = storedToken.user;
  const accessToken = await signAccessToken({ userId: user.id, role: user.role });
  const newRefreshJwt = await signRefreshToken({ userId: user.id, tokenId: newTokenRecord.id });

  const response = NextResponse.json({
    user: { id: user.id, username: user.username, firstName: user.firstName, lastName: user.lastName, email: user.email, phone: user.phone, role: user.role },
  });

  return setAuthCookies(response, accessToken, newRefreshJwt);
}
