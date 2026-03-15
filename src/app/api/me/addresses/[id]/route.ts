import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: "กรุณาเข้าสู่ระบบก่อนทำรายการ" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const address = await prisma.address.findUnique({
      where: { id },
    });

    if (!address) {
      return NextResponse.json(
        { error: "ไม่พบที่อยู่ที่ต้องการลบ" },
        { status: 404 }
      );
    }

    if (address.userId !== session.userId) {
      return NextResponse.json(
        { error: "คุณไม่มีสิทธิ์ลบที่อยู่นี้" },
        { status: 403 }
      );
    }

    await prisma.address.delete({ where: { id } });

    return NextResponse.json({ message: "ลบที่อยู่สำเร็จ" });
  } catch {
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการลบที่อยู่" },
      { status: 500 }
    );
  }
}
