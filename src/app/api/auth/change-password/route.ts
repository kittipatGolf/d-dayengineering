export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";
import { hashPassword, verifyPassword, validatePasswordStrength } from "@/lib/auth/password";
import { signAccessToken, signRefreshToken } from "@/lib/auth/jwt";
import { setAuthCookies } from "@/lib/auth/cookies";
import { REFRESH_TOKEN_EXPIRY_DAYS } from "@/lib/auth/constants";
import { checkRateLimit, getClientIp } from "@/lib/auth/rate-limit";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const rl = checkRateLimit(`change-password:${ip}`, 5, 15 * 60 * 1000);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "พยายามเปลี่ยนรหัสผ่านมากเกินไป กรุณารอสักครู่" },
      { status: 429 },
    );
  }

  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { oldPassword, newPassword } = await request.json();

  if (!oldPassword || !newPassword) {
    return NextResponse.json({ error: "กรุณากรอกข้อมูลให้ครบ" }, { status: 400 });
  }

  const pwCheck = validatePasswordStrength(newPassword);
  if (!pwCheck.valid) {
    return NextResponse.json({ error: pwCheck.errors[0] }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const valid = await verifyPassword(oldPassword, user.password);
  if (!valid) {
    return NextResponse.json({ error: "รหัสผ่านเดิมไม่ถูกต้อง" }, { status: 401 });
  }

  const hashedPassword = await hashPassword(newPassword);

  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword, passwordChangedAt: new Date() },
  });

  // Revoke all existing refresh tokens
  await prisma.refreshToken.updateMany({
    where: { userId: user.id, revokedAt: null },
    data: { revokedAt: new Date() },
  });

  // Issue new tokens for current session
  const accessToken = await signAccessToken({ userId: user.id, role: user.role });
  const refreshTokenRecord = await prisma.refreshToken.create({
    data: {
      token: crypto.randomUUID(),
      userId: user.id,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000),
    },
  });
  const refreshJwt = await signRefreshToken({ userId: user.id, tokenId: refreshTokenRecord.id });

  const response = NextResponse.json({ success: true });
  return setAuthCookies(response, accessToken, refreshJwt);
}
