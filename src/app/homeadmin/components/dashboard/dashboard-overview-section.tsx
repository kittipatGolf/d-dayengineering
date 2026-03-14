import { SalesOverviewPanel } from "../sales-overview-panel";
import { DashboardStatCard } from "../dashboard-stat-card";

const dashboardStats = [
  { title: "คำสั่งซื้อสำเร็จ", value: "0 รายการ", valueColor: "text-emerald-600" },
  { title: "คำสั่งซื้อไม่สำเร็จ", value: "0 รายการ", valueColor: "text-rose-600" },
  { title: "ผู้ใช้งาน", value: "0 คน", valueColor: "text-violet-600" },
  { title: "คำขอซ่อมสำเร็จ", value: "0 รายการ", valueColor: "text-cyan-600" },
  { title: "คำขอซ่อมไม่สำเร็จ", value: "0 รายการ", valueColor: "text-amber-600" },
];

export function DashboardOverviewSection() {
  return (
    <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_1.35fr]">
      <div className="grid gap-4 sm:grid-cols-2">
        {dashboardStats.map((item) => (
          <DashboardStatCard
            key={item.title}
            title={item.title}
            value={item.value}
            valueColor={item.valueColor}
          />
        ))}
      </div>
      <SalesOverviewPanel />
    </div>
  );
}
