import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: Params) {
  try { await requireAdmin(); } catch (res) { return res as NextResponse; }
  const { id } = await params;
  const body = await request.json();
  const { categoryId, categoryName, thickness, minArea, maxArea, pricePerSqm } = body;
  const data = { categoryId, categoryName, thickness, minArea, maxArea, pricePerSqm };

  const row = await prisma.doorPricing.update({ where: { id }, data });
  return NextResponse.json(row);
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  try { await requireAdmin(); } catch (res) { return res as NextResponse; }
  const { id } = await params;
  await prisma.doorPricing.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}
