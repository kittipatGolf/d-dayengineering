import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/session";
import { NextRequest, NextResponse } from "next/server";

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: Params) {
  try { await requireAdmin(); } catch (res) { return res as NextResponse; }
  const { id } = await params;
  const body = await request.json();
  // Whitelist allowed fields to prevent mass assignment
  const ALLOWED_FIELDS = ["username", "firstName", "lastName", "email", "phone", "role"] as const;
  const data: Record<string, unknown> = {};
  for (const key of ALLOWED_FIELDS) {
    if (body[key] !== undefined) data[key] = body[key];
  }

  const user = await prisma.user.update({
    where: { id },
    data,
    include: { addresses: true },
  });
  return NextResponse.json(user);
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  try { await requireAdmin(); } catch (res) { return res as NextResponse; }
  const { id } = await params;
  await prisma.user.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}
