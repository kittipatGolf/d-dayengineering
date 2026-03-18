import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";

export async function GET(request: NextRequest) {
  try { await requireAdmin(); } catch (res) { return res as NextResponse; }

  const type = request.nextUrl.searchParams.get("type") ?? "stats";

  if (type === "stats") {
    const [
      ordersTotal,
      ordersPending,
      ordersConfirmed,
      ordersSuccess,
      ordersFailed,
      repairTotal,
      repairPending,
      repairConfirmed,
      repairSuccess,
      repairFailed,
      usersCount,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { status: "รอการยืนยัน" } }),
      prisma.order.count({ where: { status: "ได้รับการยืนยัน" } }),
      prisma.order.count({ where: { status: "สำเร็จ" } }),
      prisma.order.count({ where: { status: "ไม่สำเร็จ" } }),
      prisma.repairRequest.count(),
      prisma.repairRequest.count({ where: { status: "รอการยืนยัน" } }),
      prisma.repairRequest.count({ where: { status: "ได้รับการยืนยัน" } }),
      prisma.repairRequest.count({ where: { status: "สำเร็จ" } }),
      prisma.repairRequest.count({ where: { status: "ไม่สำเร็จ" } }),
      prisma.user.count(),
    ]);

    return NextResponse.json({
      ordersTotal,
      ordersPending,
      ordersConfirmed,
      ordersSuccess,
      ordersFailed,
      repairTotal,
      repairPending,
      repairConfirmed,
      repairSuccess,
      repairFailed,
      usersCount,
    });
  }

  if (type === "years") {
    const orderYears = await prisma.$queryRaw<{ year: number }[]>`
      SELECT DISTINCT EXTRACT(YEAR FROM "createdAt")::int AS year FROM orders ORDER BY year DESC
    `;
    const repairYears = await prisma.$queryRaw<{ year: number }[]>`
      SELECT DISTINCT EXTRACT(YEAR FROM "createdAt")::int AS year FROM repair_requests ORDER BY year DESC
    `;
    const allYears = [...new Set([...orderYears.map((r) => r.year), ...repairYears.map((r) => r.year)])].sort((a, b) => b - a);
    const currentYear = new Date().getFullYear();
    if (!allYears.includes(currentYear)) allYears.unshift(currentYear);
    return NextResponse.json(allYears);
  }

  if (type === "sales") {
    const yearParam = request.nextUrl.searchParams.get("year");
    const period = request.nextUrl.searchParams.get("period") ?? "year";

    if (period === "year") {
      const rows = await prisma.$queryRaw<{ year: number; total: number }[]>`
        SELECT EXTRACT(YEAR FROM "createdAt")::int AS year,
               COALESCE(SUM("totalAmount"), 0)::float AS total
        FROM orders
        WHERE status IN ('สำเร็จ', 'ได้รับการยืนยัน', 'รอการยืนยัน')
        GROUP BY year
        ORDER BY year
      `;
      return NextResponse.json(rows);
    }

    const y = yearParam ? (parseInt(yearParam) || new Date().getFullYear()) : new Date().getFullYear();
    const rows = await prisma.$queryRaw<{ month: number; total: number }[]>`
      SELECT EXTRACT(MONTH FROM "createdAt")::int AS month,
             COALESCE(SUM("totalAmount"), 0)::float AS total
      FROM orders
      WHERE status IN ('สำเร็จ', 'ได้รับการยืนยัน', 'รอการยืนยัน')
        AND EXTRACT(YEAR FROM "createdAt") = ${y}
      GROUP BY month
      ORDER BY month
    `;
    return NextResponse.json(rows);
  }

  if (type === "repairs") {
    const yearParam = request.nextUrl.searchParams.get("year");
    const period = request.nextUrl.searchParams.get("period") ?? "year";

    if (period === "year") {
      const rows = await prisma.$queryRaw<{ year: number; total: number }[]>`
        SELECT EXTRACT(YEAR FROM "createdAt")::int AS year,
               COALESCE(SUM("repairPrice"), 0)::float AS total
        FROM repair_requests
        WHERE status IN ('สำเร็จ', 'ได้รับการยืนยัน', 'รอการยืนยัน')
        GROUP BY year
        ORDER BY year
      `;
      return NextResponse.json(rows);
    }

    const y = yearParam ? (parseInt(yearParam) || new Date().getFullYear()) : new Date().getFullYear();
    const rows = await prisma.$queryRaw<{ month: number; total: number }[]>`
      SELECT EXTRACT(MONTH FROM "createdAt")::int AS month,
             COALESCE(SUM("repairPrice"), 0)::float AS total
      FROM repair_requests
      WHERE status IN ('สำเร็จ', 'ได้รับการยืนยัน', 'รอการยืนยัน')
        AND EXTRACT(YEAR FROM "createdAt") = ${y}
      GROUP BY month
      ORDER BY month
    `;
    return NextResponse.json(rows);
  }

  if (type === "user-stats") {
    const users = await prisma.user.findMany({
      where: { role: "User" },
      select: { id: true, firstName: true, lastName: true },
      orderBy: { firstName: "asc" },
    });

    const userId = request.nextUrl.searchParams.get("userId");
    if (!userId) {
      return NextResponse.json({ users, data: null });
    }

    const yearParam = request.nextUrl.searchParams.get("year");
    const y = yearParam ? (parseInt(yearParam) || new Date().getFullYear()) : new Date().getFullYear();
    const period = request.nextUrl.searchParams.get("period") ?? "month";

    if (period === "day") {
      const monthParam = request.nextUrl.searchParams.get("month");
      const m = monthParam ? (parseInt(monthParam) || new Date().getMonth() + 1) : new Date().getMonth() + 1;

      const [orders, repairs] = await Promise.all([
        prisma.$queryRaw<{ day: number; total: number }[]>`
          SELECT EXTRACT(DAY FROM "createdAt")::int AS day,
                 COALESCE(SUM("totalAmount"), 0)::float AS total
          FROM orders
          WHERE "userId" = ${userId}
            AND EXTRACT(YEAR FROM "createdAt") = ${y}
            AND EXTRACT(MONTH FROM "createdAt") = ${m}
          GROUP BY day ORDER BY day
        `,
        prisma.$queryRaw<{ day: number; total: number }[]>`
          SELECT EXTRACT(DAY FROM "createdAt")::int AS day,
                 COALESCE(SUM("repairPrice"), 0)::float AS total
          FROM repair_requests
          WHERE "userId" = ${userId}
            AND EXTRACT(YEAR FROM "createdAt") = ${y}
            AND EXTRACT(MONTH FROM "createdAt") = ${m}
          GROUP BY day ORDER BY day
        `,
      ]);

      return NextResponse.json({ users, data: { orders, repairs } });
    }

    const [orders, repairs] = await Promise.all([
      prisma.$queryRaw<{ month: number; total: number }[]>`
        SELECT EXTRACT(MONTH FROM "createdAt")::int AS month,
               COALESCE(SUM("totalAmount"), 0)::float AS total
        FROM orders
        WHERE "userId" = ${userId}
          AND EXTRACT(YEAR FROM "createdAt") = ${y}
        GROUP BY month ORDER BY month
      `,
      prisma.$queryRaw<{ month: number; total: number }[]>`
        SELECT EXTRACT(MONTH FROM "createdAt")::int AS month,
               COALESCE(SUM("repairPrice"), 0)::float AS total
        FROM repair_requests
        WHERE "userId" = ${userId}
          AND EXTRACT(YEAR FROM "createdAt") = ${y}
        GROUP BY month ORDER BY month
      `,
    ]);

    return NextResponse.json({ users, data: { orders, repairs } });
  }

  return NextResponse.json({ error: "Invalid type parameter" }, { status: 400 });
}
