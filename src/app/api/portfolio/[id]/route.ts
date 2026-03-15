import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: Params) {
  try { await requireAdmin(); } catch (res) { return res as NextResponse; }
  const { id } = await params;
  const body = await request.json();
  const { title, description, images } = body;
  const data = { title, description, images: images ?? [] };

  const item = await prisma.portfolio.update({ where: { id }, data });
  return NextResponse.json(item);
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  try { await requireAdmin(); } catch (res) { return res as NextResponse; }
  const { id } = await params;
  await prisma.portfolio.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}
