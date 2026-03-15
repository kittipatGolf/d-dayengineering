import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: Params) {
  try { await requireAdmin(); } catch (res) { return res as NextResponse; }
  const { id } = await params;
  const body = await request.json();
  const { name, kind, colors, isActive } = body;
  const data = { name, kind, colors, isActive };

  const category = await prisma.productCategory.update({ where: { id }, data });
  return NextResponse.json(category);
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  try { await requireAdmin(); } catch (res) { return res as NextResponse; }
  const { id } = await params;
  await prisma.productCategory.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}
