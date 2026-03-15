import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";

export async function PUT(request: NextRequest) {
  try { await requireAdmin(); } catch (res) { return res as NextResponse; }
  const { price } = await request.json();

  await prisma.repairRequest.updateMany({
    where: { status: { in: ["รอการยืนยัน", "ได้รับการยืนยัน"] } },
    data: { repairPrice: price },
  });

  const updated = await prisma.repairRequest.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(updated);
}
