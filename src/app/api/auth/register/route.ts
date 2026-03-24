export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";
import { hashPassword, validatePasswordStrength } from "@/lib/auth/password";
import { signAccessToken, signRefreshToken } from "@/lib/auth/jwt";
import { setAuthCookies } from "@/lib/auth/cookies";
import { REFRESH_TOKEN_EXPIRY_DAYS } from "@/lib/auth/constants";
import { checkRateLimit, getClientIp } from "@/lib/auth/rate-limit";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const rl = checkRateLimit(`register:${ip}`, 3, 15 * 60 * 1000);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "คำขอมากเกินไป กรุณารอสักครู่" },
      { status: 429 },
    );
  }

  const body = await request.json();
  const { username, firstName, lastName, email, phone, password } = body;

  if (!username || !firstName || !lastName || !email || !phone || !password) {
    return NextResponse.json({ error: "กรุณากรอกข้อมูลให้ครบ" }, { status: 400 });
  }

  if (!/^[A-Za-z0-9_]{4,20}$/.test(username)) {
    return NextResponse.json({ error: "ชื่อผู้ใช้ต้องเป็นอังกฤษ/ตัวเลข/ขีดล่าง 4-20 ตัว" }, { status: 400 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "รูปแบบอีเมลไม่ถูกต้อง" }, { status: 400 });
  }

  const pwCheck = validatePasswordStrength(password);
  if (!pwCheck.valid) {
    return NextResponse.json({ error: pwCheck.errors[0] }, { status: 400 });
  }

  const existing = await prisma.user.findFirst({
    where: { OR: [{ username }, { email }] },
  });
  if (existing) {
    return NextResponse.json({ error: "ชื่อผู้ใช้หรืออีเมลนี้ถูกใช้งานแล้ว" }, { status: 409 });
  }

  const hashedPassword = await hashPassword(password);

  const user = await prisma.user.create({
    data: { username, firstName, lastName, email, phone, password: hashedPassword, role: "User" },
  });

  const accessToken = await signAccessToken({ userId: user.id, role: user.role });

  const refreshTokenRecord = await prisma.refreshToken.create({
    data: {
      token: crypto.randomUUID(),
      userId: user.id,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000),
    },
  });

  const refreshJwt = await signRefreshToken({ userId: user.id, tokenId: refreshTokenRecord.id });

  const response = NextResponse.json({
    user: { id: user.id, username: user.username, firstName: user.firstName, lastName: user.lastName, email: user.email, phone: user.phone, role: user.role },
  }, { status: 201 });

  return setAuthCookies(response, accessToken, refreshJwt);
}
