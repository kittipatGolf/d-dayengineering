import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { validateRequired } from "@/lib/api-validation";

export async function GET() {
  const products = await prisma.product.findMany({ orderBy: { updatedAt: "desc" } });
  return NextResponse.json(products);
}

export async function POST(request: NextRequest) {
  try { await requireAdmin(); } catch (res) { return res as NextResponse; }
  const body = await request.json();
  const req = validateRequired(body, ["name", "kind", "categoryId"]);
  if (!req.valid) return NextResponse.json({ error: req.error }, { status: 400 });
  const { name, kind, categoryId, categoryName, price, unit, colors, description, warrantyYears, images, status } = body;
  const product = await prisma.product.create({
    data: { name, kind, categoryId, categoryName, price, unit, colors, description, warrantyYears, images, status },
  });
  return NextResponse.json(product, { status: 201 });
}
