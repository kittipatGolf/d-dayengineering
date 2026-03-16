import { prisma } from "@/lib/prisma";
import { getSession, requireAdmin } from "@/lib/auth/session";
import { createAdminNotification } from "@/lib/notifications";
import { checkRateLimit, getClientIp } from "@/lib/auth/rate-limit";
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
    const ip = getClientIp(req);
    const rl = checkRateLimit(`repair-requests:${ip}`, 10, 15 * 60 * 1000);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "คำขอมากเกินไป กรุณารอสักครู่" },
        { status: 429 },
      );
    }

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
    ).catch((err) => console.error("Failed to send admin notification for new repair request:", err));

    return NextResponse.json(repairRequest, { status: 201 });
  } catch (err) {
    console.error("POST /api/repair-requests error:", err);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการสร้างคำขอซ่อม" },
      { status: 500 }
    );
  }
}
