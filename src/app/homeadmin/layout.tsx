"use client";

import { useState } from "react";
import { AdminSidebar } from "./components/admin-sidebar";
import { AdminTopbar } from "./components/admin-topbar";

export default function HomeAdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <section className="min-h-screen bg-slate-100">
      <AdminTopbar onMenuClick={() => setSidebarOpen(true)} />
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="px-4 py-5 md:px-6">{children}</div>
    </section>
  );
}
