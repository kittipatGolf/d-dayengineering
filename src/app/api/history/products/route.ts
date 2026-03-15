import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const history = await prisma.productHistory.findMany({
    where: { status: { in: ["สำเร็จ", "ยกเลิก"] } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(history);
}
