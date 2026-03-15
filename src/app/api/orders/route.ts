import { prisma } from "@/lib/prisma";
import { getSession, requireAdmin } from "@/lib/auth/session";
import { createAdminNotification } from "@/lib/notifications";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try { await requireAdmin(); } catch (res) { return res as NextResponse; }
  const orders = await prisma.order.findMany({
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(orders);
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: "กรุณาเข้าสู่ระบบก่อนทำรายการ" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { firstName, lastName, phone, address, items } = body;

    if (!firstName || !lastName || !phone || !address || !items?.length) {
      return NextResponse.json(
        { error: "กรุณากรอกข้อมูลให้ครบถ้วน" },
        { status: 400 }
      );
    }

    const totalAmount = items.reduce(
      (sum: number, item: { pricePerUnit: number; quantity: number }) =>
        sum + item.pricePerUnit * item.quantity,
      0
    );

    const order = await prisma.order.create({
      data: {
        userId: session.userId,
        firstName,
        lastName,
        phone,
        address,
        totalAmount,
        items: {
          create: items.map(
            (item: {
              name: string;
              categoryName: string;
              images?: string[];
              color: string;
              widthM: number;
              lengthM: number;
              thickness: string;
              installOption: string;
              quantity: number;
              pricePerUnit: number;
              warranty: string;
            }) => ({
              name: item.name,
              categoryName: item.categoryName,
              images: item.images ?? [],
              color: item.color,
              widthM: item.widthM,
              lengthM: item.lengthM,
              thickness: item.thickness,
              installOption: item.installOption,
              quantity: item.quantity,
              pricePerUnit: item.pricePerUnit,
              warranty: item.warranty,
            })
          ),
        },
      },
      include: { items: true },
    });

    createAdminNotification(
      "order",
      "คำสั่งซื้อใหม่",
      `${firstName} ${lastName} สั่งซื้อสินค้า ฿${totalAmount.toLocaleString()}`,
      `/homeadmin/orders`,
    ).catch(() => {});

    return NextResponse.json(order, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการสร้างคำสั่งซื้อ" },
      { status: 500 }
    );
  }
}
