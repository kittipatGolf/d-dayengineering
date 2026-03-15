export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth/password";
import { signAccessToken, signRefreshToken } from "@/lib/auth/jwt";
import { setAuthCookies } from "@/lib/auth/cookies";
import { REFRESH_TOKEN_EXPIRY_DAYS } from "@/lib/auth/constants";
import { checkRateLimit, getClientIp } from "@/lib/auth/rate-limit";
import { NextRequest, NextResponse } from "next/server";

const GENERIC_ERROR = "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง";

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const rl = checkRateLimit(`login:${ip}`, 5, 15 * 60 * 1000);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "พยายามเข้าสู่ระบบมากเกินไป กรุณารอสักครู่" },
      { status: 429 },
    );
  }

  const body = await request.json();
  const { username, password } = body;

  if (!username || !password) {
    return NextResponse.json({ error: "กรุณากรอกข้อมูลให้ครบ" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { username: username.trim() } });
  if (!user) {
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 401 });
  }

  const valid = await verifyPassword(password, user.password);
  if (!valid) {
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 401 });
  }

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
  });

  return setAuthCookies(response, accessToken, refreshJwt);
}
