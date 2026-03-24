import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { validateNumber } from "@/lib/api-validation";

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: Params) {
  try { await requireAdmin(); } catch (res) { return res as NextResponse; }
  const { id } = await params;
  const { items, totalAmount } = await request.json();
  if (!Array.isArray(items)) return NextResponse.json({ error: "items must be an array" }, { status: 400 });
  const v = validateNumber(totalAmount);
  if (!v.valid) return NextResponse.json({ error: `totalAmount: ${v.error}` }, { status: 400 });

  await prisma.orderItem.deleteMany({ where: { orderId: id } });

  if (items && items.length > 0) {
    await prisma.orderItem.createMany({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: items.map((item: any) => {
        const { id: _id, ...rest } = item;
        return { ...rest, orderId: id };
      }) as any,
    });
  }

  const order = await prisma.order.update({
    where: { id },
    data: { totalAmount },
    include: { items: true },
  });

  return NextResponse.json(order);
}
