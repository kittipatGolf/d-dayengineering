import { prisma } from "@/lib/prisma";
import { getSession, requireAdmin } from "@/lib/auth/session";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const target = request.nextUrl.searchParams.get("target"); // "admin" or "user"

  if (target === "admin") {
    try { await requireAdmin(); } catch (res) { return res as NextResponse; }

    const notifications = await prisma.notification.findMany({
      where: { role: "Admin" },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    const unreadCount = await prisma.notification.count({
      where: { role: "Admin", isRead: false },
    });
    return NextResponse.json({ notifications, unreadCount });
  }

  // User notifications
  const notifications = await prisma.notification.findMany({
    where: { role: "User", userId: session.userId },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  const unreadCount = await prisma.notification.count({
    where: { role: "User", userId: session.userId, isRead: false },
  });
  return NextResponse.json({ notifications, unreadCount });
}

export async function PATCH(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { ids, markAll, target } = body as {
    ids?: string[];
    markAll?: boolean;
    target?: "admin" | "user";
  };

  if (markAll) {
    if (target === "admin") {
      try { await requireAdmin(); } catch (res) { return res as NextResponse; }
      await prisma.notification.updateMany({
        where: { role: "Admin", isRead: false },
        data: { isRead: true },
      });
    } else {
      await prisma.notification.updateMany({
        where: { role: "User", userId: session.userId, isRead: false },
        data: { isRead: true },
      });
    }
    return NextResponse.json({ ok: true });
  }

  if (ids && ids.length > 0) {
    await prisma.notification.updateMany({
      where: { id: { in: ids } },
      data: { isRead: true },
    });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "No ids or markAll provided" }, { status: 400 });
}
