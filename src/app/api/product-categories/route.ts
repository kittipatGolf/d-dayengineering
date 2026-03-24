import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { validateRequired } from "@/lib/api-validation";

export async function GET() {
  const categories = await prisma.productCategory.findMany({ orderBy: { updatedAt: "desc" } });
  return NextResponse.json(categories);
}

export async function POST(request: NextRequest) {
  try { await requireAdmin(); } catch (res) { return res as NextResponse; }
  const body = await request.json();
  const req = validateRequired(body, ["name", "kind"]);
  if (!req.valid) return NextResponse.json({ error: req.error }, { status: 400 });
  const { name, kind, colors, isActive } = body;
  const category = await prisma.productCategory.create({
    data: { name, kind, colors, isActive },
  });
  return NextResponse.json(category, { status: 201 });
}
