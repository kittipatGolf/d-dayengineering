"use client";

import { DashboardOverviewSection } from "./components/dashboard/dashboard-overview-section";
import { RepairOverviewPanel } from "./components/repair/repair-overview-panel";
import { UserStatisticsPanel } from "./components/user-statistics/user-statistics-panel";

export default function HomeAdminPage() {
  return (
    <div className="space-y-5">
      <header className="relative overflow-hidden rounded-2xl bg-linear-to-br from-blue-900 via-blue-800 to-slate-900 px-6 py-7 text-white shadow-lg md:px-8">
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-blue-400/10 blur-3xl" />
        <div className="relative">
          <p className="text-sm font-medium text-blue-200">แดชบอร์ด</p>
          <h1 className="mt-1 text-2xl font-bold md:text-3xl">ยินดีต้อนรับ, ผู้ดูแลระบบ</h1>
          <p className="mt-2 text-sm text-blue-200/70">ภาพรวมข้อมูลทั้งหมดของร้านดีย์แปด ประตูม้วน</p>
        </div>
      </header>

      <DashboardOverviewSection />

      <RepairOverviewPanel />

      <UserStatisticsPanel />
    </div>
  );
}
