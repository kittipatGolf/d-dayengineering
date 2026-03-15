"use client";

import { useEffect, useState } from "react";
import { SalesOverviewPanel } from "../sales-overview-panel";
import { DashboardStatCard } from "../dashboard-stat-card";

type Stats = {
  ordersTotal: number;
  ordersPending: number;
  ordersConfirmed: number;
  ordersSuccess: number;
  ordersFailed: number;
  repairTotal: number;
  repairPending: number;
  repairConfirmed: number;
  repairSuccess: number;
  repairFailed: number;
  usersCount: number;
};

export function DashboardOverviewSection() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/dashboard?type=stats")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => { if (data) setStats(data); })
      .catch(() => {});
  }, []);

  const s = stats;

  const orderStats = [
    { title: "คำสั่งซื้อทั้งหมด", value: s ? `${s.ordersTotal} รายการ` : "—", valueColor: "text-blue-600" },
    { title: "รอการยืนยัน", value: s ? `${s.ordersPending} รายการ` : "—", valueColor: "text-amber-600" },
    { title: "ได้รับการยืนยัน", value: s ? `${s.ordersConfirmed} รายการ` : "—", valueColor: "text-cyan-600" },
    { title: "คำสั่งซื้อสำเร็จ", value: s ? `${s.ordersSuccess} รายการ` : "—", valueColor: "text-emerald-600" },
    { title: "คำสั่งซื้อไม่สำเร็จ", value: s ? `${s.ordersFailed} รายการ` : "—", valueColor: "text-rose-600" },
  ];

  const repairStats = [
    { title: "คำขอซ่อมทั้งหมด", value: s ? `${s.repairTotal} รายการ` : "—", valueColor: "text-blue-600" },
    { title: "รอการยืนยัน", value: s ? `${s.repairPending} รายการ` : "—", valueColor: "text-amber-600" },
    { title: "ได้รับการยืนยัน", value: s ? `${s.repairConfirmed} รายการ` : "—", valueColor: "text-cyan-600" },
    { title: "คำขอซ่อมสำเร็จ", value: s ? `${s.repairSuccess} รายการ` : "—", valueColor: "text-emerald-600" },
    { title: "คำขอซ่อมไม่สำเร็จ", value: s ? `${s.repairFailed} รายการ` : "—", valueColor: "text-rose-600" },
  ];

  return (
    <div className="space-y-5">
      <div className="grid gap-5 xl:grid-cols-[1fr_1.35fr]">
        <div>
          <h3 className="mb-3 text-sm font-bold text-slate-600">คำสั่งซื้อ</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {orderStats.map((item) => (
              <DashboardStatCard key={item.title} title={item.title} value={item.value} valueColor={item.valueColor} />
            ))}
            <DashboardStatCard title="ผู้ใช้งาน" value={s ? `${s.usersCount} คน` : "—"} valueColor="text-violet-600" />
          </div>
        </div>
        <SalesOverviewPanel />
      </div>

      <div>
        <h3 className="mb-3 text-sm font-bold text-slate-600">คำขอซ่อม</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {repairStats.map((item) => (
            <DashboardStatCard key={item.title} title={item.title} value={item.value} valueColor={item.valueColor} />
          ))}
        </div>
      </div>
    </div>
  );
}
