"use client";

import { useState } from "react";
import { DashboardOverviewSection } from "./components/dashboard/dashboard-overview-section";
import { NotificationModal } from "./components/notification/notification-modal";
import { RepairOverviewPanel } from "./components/repair/repair-overview-panel";
import { UserStatisticsPanel } from "./components/user-statistics/user-statistics-panel";

export default function HomeAdminPage() {
  const [notificationOpen, setNotificationOpen] = useState(false);

  return (
    <div className="rounded-3xl border border-slate-300 bg-slate-100 p-3 shadow-sm md:p-4">
      <header className="rounded-2xl bg-linear-to-r from-blue-900 to-blue-700 px-5 py-5 text-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm text-blue-100">แดชบอร์ด</p>
            <h1 className="text-2xl font-bold">ผู้ดูแลระบบ</h1>
          </div>
          <button
            type="button"
            onClick={() => setNotificationOpen(true)}
            className="rounded-full bg-amber-400 px-5 py-2 text-sm font-semibold text-amber-950 transition hover:bg-amber-300"
          >
            แจ้งเตือน
          </button>
        </div>
      </header>

      <DashboardOverviewSection />

      <div className="mt-4">
        <RepairOverviewPanel />
      </div>

      <div className="mt-4">
        <UserStatisticsPanel />
      </div>

      <NotificationModal
        open={notificationOpen}
        onClose={() => setNotificationOpen(false)}
      />
    </div>
  );
}
