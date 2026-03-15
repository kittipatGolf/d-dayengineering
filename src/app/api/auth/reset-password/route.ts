export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";
import { hashPassword, validatePasswordStrength } from "@/lib/auth/password";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { token, newPassword } = await request.json();

  if (!token || !newPassword) {
    return NextResponse.json({ error: "ข้อมูลไม่ครบ" }, { status: 400 });
  }

  const pwCheck = validatePasswordStrength(newPassword);
  if (!pwCheck.valid) {
    return NextResponse.json({ error: pwCheck.errors[0] }, { status: 400 });
  }

  const resetToken = await prisma.passwordResetToken.findUnique({ where: { token } });

  if (!resetToken || resetToken.usedAt || resetToken.expiresAt < new Date()) {
    return NextResponse.json({ error: "ลิงก์รีเซ็ตไม่ถูกต้องหรือหมดอายุ" }, { status: 400 });
  }

  const hashedPassword = await hashPassword(newPassword);

  await prisma.user.update({
    where: { id: resetToken.userId },
    data: { password: hashedPassword, passwordChangedAt: new Date() },
  });

  await prisma.passwordResetToken.update({
    where: { id: resetToken.id },
    data: { usedAt: new Date() },
  });

  // Revoke all refresh tokens
  await prisma.refreshToken.updateMany({
    where: { userId: resetToken.userId, revokedAt: null },
    data: { revokedAt: new Date() },
  });

  return NextResponse.json({ message: "รีเซ็ตรหัสผ่านสำเร็จ กรุณาเข้าสู่ระบบใหม่" });
}
