import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { validateRequired, validateNumber } from "@/lib/api-validation";

export async function GET() {
  const rows = await prisma.doorPricing.findMany({ orderBy: { updatedAt: "desc" } });
  return NextResponse.json(rows);
}

export async function POST(request: NextRequest) {
  try { await requireAdmin(); } catch (res) { return res as NextResponse; }
  const body = await request.json();
  const req = validateRequired(body, ["categoryId", "thickness", "minArea", "maxArea", "pricePerSqm"]);
  if (!req.valid) return NextResponse.json({ error: req.error }, { status: 400 });
  for (const f of ["thickness", "minArea", "maxArea", "pricePerSqm"] as const) {
    const v = validateNumber(body[f]);
    if (!v.valid) return NextResponse.json({ error: `${f}: ${v.error}` }, { status: 400 });
  }
  const { categoryId, categoryName, thickness, minArea, maxArea, pricePerSqm } = body;
  const row = await prisma.doorPricing.create({
    data: { categoryId, categoryName, thickness, minArea, maxArea, pricePerSqm },
  });
  return NextResponse.json(row, { status: 201 });
}
