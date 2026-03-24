import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { validateRequired } from "@/lib/api-validation";

export async function GET() {
  const items = await prisma.portfolio.findMany({ orderBy: { updatedAt: "desc" } });
  return NextResponse.json(items);
}

export async function POST(request: NextRequest) {
  try { await requireAdmin(); } catch (res) { return res as NextResponse; }
  try {
    const body = await request.json();
    const req = validateRequired(body, ["title"]);
    if (!req.valid) return NextResponse.json({ error: req.error }, { status: 400 });
    const { title, description, images } = body;
    const item = await prisma.portfolio.create({
      data: { title, description, images: images ?? [] },
    });
    return NextResponse.json(item, { status: 201 });
  } catch (err) {
    console.error("POST /api/portfolio error:", err);
    return NextResponse.json({ error: "เกิดข้อผิดพลาด" }, { status: 500 });
  }
}
