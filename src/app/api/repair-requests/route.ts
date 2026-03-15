import { prisma } from "@/lib/prisma";
import { getSession, requireAdmin } from "@/lib/auth/session";
import { createAdminNotification } from "@/lib/notifications";
import { type Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try { await requireAdmin(); } catch (res) { return res as NextResponse; }
  const requests = await prisma.repairRequest.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(requests);
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

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { username: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "ไม่พบข้อมูลผู้ใช้" },
        { status: 404 }
      );
    }

    const body = await req.json();
    const { repairType, repairItem, detail, address, images } = body;

    if (!repairType || !repairItem || !address) {
      return NextResponse.json(
        { error: "กรุณากรอกข้อมูลให้ครบถ้วน" },
        { status: 400 }
      );
    }

    const now = new Date();
    const repairDate = now.toLocaleDateString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const data: Prisma.RepairRequestUncheckedCreateInput = {
      userId: session.userId,
      username: user.username,
      repairType,
      repairItem,
      detail: detail ?? "",
      repairDate,
      address,
      images: images ?? [],
    };

    const repairRequest = await prisma.repairRequest.create({ data });

    createAdminNotification(
      "repair",
      "คำขอแจ้งซ่อมใหม่",
      `${user.username} แจ้งซ่อม${repairType} - ${repairItem}`,
      `/homeadmin/repairs`,
    ).catch(() => {});

    return NextResponse.json(repairRequest, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการสร้างคำขอซ่อม" },
      { status: 500 }
    );
  }
}
