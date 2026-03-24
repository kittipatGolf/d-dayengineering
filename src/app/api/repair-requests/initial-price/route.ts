import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { validateNumber } from "@/lib/api-validation";

export async function PUT(request: NextRequest) {
  try { await requireAdmin(); } catch (res) { return res as NextResponse; }
  const { price } = await request.json();
  const v = validateNumber(price);
  if (!v.valid) return NextResponse.json({ error: `price: ${v.error}` }, { status: 400 });

  await prisma.repairRequest.updateMany({
    where: { status: { in: ["รอการยืนยัน", "ได้รับการยืนยัน"] } },
    data: { repairPrice: price },
  });

  const updated = await prisma.repairRequest.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(updated);
}
