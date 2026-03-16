import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { validateNumber } from "@/lib/api-validation";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: Params) {
  try { await requireAdmin(); } catch (res) { return res as NextResponse; }
  const { id } = await params;
  const body = await request.json();

  const allowed = ["selectedPart", "warranty", "repairPrice"] as const;
  const data: Record<string, unknown> = {};
  for (const key of allowed) {
    if (body[key] !== undefined) data[key] = body[key];
  }

  if (data.repairPrice !== undefined) {
    const v = validateNumber(data.repairPrice);
    if (!v.valid) return NextResponse.json({ error: `repairPrice: ${v.error}` }, { status: 400 });
  }
  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "ไม่มีข้อมูลที่ต้องอัปเดต" }, { status: 400 });
  }

  const updated = await prisma.repairRequest.update({ where: { id }, data });
  return NextResponse.json(updated);
}
