import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";

export async function GET() {
  const rows = await prisma.doorPricing.findMany({ orderBy: { updatedAt: "desc" } });
  return NextResponse.json(rows);
}

export async function POST(request: NextRequest) {
  try { await requireAdmin(); } catch (res) { return res as NextResponse; }
  const body = await request.json();
  const { categoryId, categoryName, thickness, minArea, maxArea, pricePerSqm } = body;
  const row = await prisma.doorPricing.create({
    data: { categoryId, categoryName, thickness, minArea, maxArea, pricePerSqm },
  });
  return NextResponse.json(row, { status: 201 });
}
