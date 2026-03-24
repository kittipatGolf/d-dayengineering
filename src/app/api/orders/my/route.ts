import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: "กรุณาเข้าสู่ระบบก่อนทำรายการ" },
        { status: 401 }
      );
    }

    const orders = await prisma.order.findMany({
      where: { userId: session.userId },
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(orders);
  } catch (err) {
    console.error("GET /api/orders/my error:", err);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการดึงข้อมูลคำสั่งซื้อ" },
      { status: 500 }
    );
  }
}
