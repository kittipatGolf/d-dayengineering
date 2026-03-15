import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { createUserNotification } from "@/lib/notifications";

type Params = { params: Promise<{ id: string }> };

const TERMINAL_STATUSES = ["สำเร็จ", "ยกเลิก"];

export async function PUT(request: NextRequest, { params }: Params) {
  try { await requireAdmin(); } catch (res) { return res as NextResponse; }
  const { id } = await params;
  const { status } = await request.json();

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
    ).catch(() => {});
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

    await prisma.order.delete({ where: { id } });
    return NextResponse.json(null);
  }

  return NextResponse.json(order);
}
