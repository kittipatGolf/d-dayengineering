import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { createUserNotification } from "@/lib/notifications";

type Params = { params: Promise<{ id: string }> };

const TERMINAL_STATUSES = ["สำเร็จ", "ยกเลิก"];

export async function PUT(request: NextRequest, { params }: Params) {
  try { await requireAdmin(); } catch (res) { return res as NextResponse; }
  const { id } = await params;
  const { status, repairPrice } = await request.json();

  const updateData: Record<string, unknown> = { status };
  if (repairPrice !== undefined) updateData.repairPrice = repairPrice;

  const repairRequest = await prisma.repairRequest.update({
    where: { id },
    data: updateData,
  });

  if (repairRequest.userId) {
    createUserNotification(
      repairRequest.userId,
      "status",
      "อัปเดตสถานะแจ้งซ่อม",
      `คำขอแจ้งซ่อมของคุณถูกเปลี่ยนเป็น "${status}"`,
      `/profile`,
    ).catch(() => {});
  }

  if (TERMINAL_STATUSES.includes(status)) {
    await prisma.repairHistory.create({
      data: {
        username: repairRequest.username,
        images: repairRequest.images,
        repairType: repairRequest.repairType,
        repairItem: repairRequest.repairItem,
        detail: repairRequest.detail,
        repairDate: repairRequest.repairDate,
        address: repairRequest.address as object,
        status,
        price: repairRequest.repairPrice,
      },
    });

    await prisma.repairRequest.delete({ where: { id } });
    return NextResponse.json(null);
  }

  return NextResponse.json(repairRequest);
}
