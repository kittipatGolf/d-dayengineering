import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: Params) {
  try { await requireAdmin(); } catch (res) { return res as NextResponse; }
  const { id } = await params;
  const { addresses } = await request.json();
  if (!Array.isArray(addresses)) return NextResponse.json({ error: "addresses must be an array" }, { status: 400 });
  for (const addr of addresses) {
    if (!addr.label || !addr.address) {
      return NextResponse.json({ error: "Each address must have label and address fields" }, { status: 400 });
    }
  }

  await prisma.address.deleteMany({ where: { userId: id } });

  if (addresses && addresses.length > 0) {
    await prisma.address.createMany({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: addresses.map((addr: any) => {
        const { id: _id, ...rest } = addr;
        return { ...rest, userId: id };
      }) as any,
    });
  }

  const user = await prisma.user.findUnique({
    where: { id },
    include: { addresses: true },
  });
  return NextResponse.json(user);
}
