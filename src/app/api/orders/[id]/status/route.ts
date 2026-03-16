import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { createUserNotification } from "@/lib/notifications";
import { validateEnum } from "@/lib/api-validation";

type Params = { params: Promise<{ id: string }> };

const VALID_STATUSES = ["รอการยืนยัน", "ได้รับการยืนยัน", "สำเร็จ", "ยกเลิก", "ไม่สำเร็จ"];
const TERMINAL_STATUSES = ["สำเร็จ", "ยกเลิก"];

export async function PUT(request: NextRequest, { params }: Params) {
  try { await requireAdmin(); } catch (res) { return res as NextResponse; }
  const { id } = await params;
  const { status } = await request.json();
  const v = validateEnum(status, VALID_STATUSES);
  if (!v.valid) return NextResponse.json({ error: v.error }, { status: 400 });

  const order = await prisma.order.update({
    where: { id },
    data: { status },
    include: { items: true },
  });

  if (order.userId) {
    createUserNotification(
      order.userId,
      "status",
      "อัปเดตสถานะคำสั่งซื้อ",
      `คำสั่งซื้อของคุณถูกเปลี่ยนเป็น "${status}"`,
      `/profile`,
    ).catch((err) => console.error("Failed to send user notification for order status update:", err));
  }

  if (TERMINAL_STATUSES.includes(status)) {
    await prisma.productHistory.create({
      data: {
        firstName: order.firstName,
        lastName: order.lastName,
        phone: order.phone,
        address: order.address as object,
        items: order.items as unknown as object,
        totalAmount: order.totalAmount,
        status,
        completedAt: new Date().toLocaleDateString("th-TH"),
      },
    });
  }

  return NextResponse.json(order);
}
