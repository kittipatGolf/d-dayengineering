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
  const { status, repairPrice } = await request.json();
  const v = validateEnum(status, VALID_STATUSES);
  if (!v.valid) return NextResponse.json({ error: v.error }, { status: 400 });

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
    ).catch((err) => console.error("Failed to send user notification for repair status update:", err));
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
  }

  return NextResponse.json(repairRequest);
}
