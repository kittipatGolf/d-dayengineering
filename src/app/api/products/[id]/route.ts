import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { validateRequired } from "@/lib/api-validation";

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: Params) {
  try { await requireAdmin(); } catch (res) { return res as NextResponse; }
  const { id } = await params;
  const body = await request.json();
  const req = validateRequired(body, ["name"]);
  if (!req.valid) return NextResponse.json({ error: req.error }, { status: 400 });
  const { name, kind, categoryId, categoryName, price, unit, colors, description, warrantyYears, images, status } = body;
  const data = { name, kind, categoryId, categoryName, price, unit, colors, description, warrantyYears, images, status };

  const product = await prisma.product.update({ where: { id }, data });
  return NextResponse.json(product);
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  try { await requireAdmin(); } catch (res) { return res as NextResponse; }
  const { id } = await params;
  await prisma.product.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}
