import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: Params) {
  try { await requireAdmin(); } catch (res) { return res as NextResponse; }
  const { id } = await params;
  const { addresses } = await request.json();

  await prisma.address.deleteMany({ where: { userId: id } });

  if (addresses && addresses.length > 0) {
    await prisma.address.createMany({
      data: addresses.map((addr: Record<string, string>) => ({
        ...addr,
        id: undefined,
        userId: id,
      })),
    });
  }

  const user = await prisma.user.findUnique({
    where: { id },
    include: { addresses: true },
  });
  return NextResponse.json(user);
}
