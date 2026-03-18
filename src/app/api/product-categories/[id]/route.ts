import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { validateRequired } from "@/lib/api-validation";

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: Params) {
  try { await requireAdmin(); } catch (res) { return res as NextResponse; }
  const { id } = await params;
  const body = await request.json();

  // Allow partial updates (e.g. toggle isActive only)
  const data: Record<string, unknown> = {};
  if (body.name !== undefined) data.name = body.name;
  if (body.kind !== undefined) data.kind = body.kind;
  if (body.colors !== undefined) data.colors = body.colors;
  if (body.isActive !== undefined) data.isActive = body.isActive;

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  const category = await prisma.productCategory.update({ where: { id }, data });
  return NextResponse.json(category);
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  try { await requireAdmin(); } catch (res) { return res as NextResponse; }
  const { id } = await params;
  await prisma.productCategory.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}
