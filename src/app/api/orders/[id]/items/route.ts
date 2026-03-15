import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: Params) {
  try { await requireAdmin(); } catch (res) { return res as NextResponse; }
  const { id } = await params;
  const { items, totalAmount } = await request.json();

  await prisma.orderItem.deleteMany({ where: { orderId: id } });

  if (items && items.length > 0) {
    await prisma.orderItem.createMany({
      data: items.map((item: Record<string, unknown>) => ({
        ...item,
        id: undefined,
        orderId: id,
      })),
    });
  }

  const order = await prisma.order.update({
    where: { id },
    data: { totalAmount },
    include: { items: true },
  });

  return NextResponse.json(order);
}
