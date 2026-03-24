import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";

export async function GET() {
  try { await requireAdmin(); } catch (res) { return res as NextResponse; }

  const history = await prisma.repairHistory.findMany({
    where: { status: { in: ["สำเร็จ", "ยกเลิก"] } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(history);
}
