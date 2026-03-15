import { prisma } from "@/lib/prisma";
import { checkRateLimit, getClientIp } from "@/lib/auth/rate-limit";
import { sendPasswordResetEmail } from "@/lib/email";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const rl = checkRateLimit(`reset:${ip}`, 3, 60 * 60 * 1000);
  if (!rl.allowed) {
    return NextResponse.json({ error: "คำขอมากเกินไป กรุณารอสักครู่" }, { status: 429 });
  }

  const { email } = await request.json();
  if (!email) {
    return NextResponse.json({ error: "กรุณากรอกอีเมล" }, { status: 400 });
  }

  const successMessage = "หากอีเมลนี้มีอยู่ในระบบ ระบบจะส่งลิงก์รีเซ็ตรหัสผ่านให้";

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ message: successMessage });
  }

  const token = crypto.randomUUID();
  await prisma.passwordResetToken.create({
    data: {
      token,
      userId: user.id,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    },
  });

  try {
    await sendPasswordResetEmail(email, token);
  } catch (err) {
    console.error("Failed to send reset email:", err);
  }

  return NextResponse.json({ message: successMessage });
}
