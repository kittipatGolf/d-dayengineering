import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/session";
import { NextResponse } from "next/server";

export async function GET() {
  try { await requireAdmin(); } catch (res) { return res as NextResponse; }

  const users = await prisma.user.findMany({
    select: { id: true, username: true, firstName: true, lastName: true, email: true, phone: true, role: true, createdAt: true, updatedAt: true, addresses: true },
  });
  return NextResponse.json(users);
}
