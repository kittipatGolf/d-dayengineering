"use client";

import {
  BanknotesIcon,
  ClipboardDocumentListIcon,
  CubeIcon,
  HomeIcon,
  QueueListIcon,
  ShoppingCartIcon,
  TagIcon,
  UserGroupIcon,
  WrenchScrewdriverIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuSections = [
  {
    section: "งานประจำวัน",
    items: [
      { label: "หน้าแรก", href: "/homeadmin", icon: HomeIcon },
      { label: "จัดการออเดอร์", href: "/homeadmin/orders", icon: ShoppingCartIcon },
      { label: "จัดการคำขอซ่อม", href: "/homeadmin/repair-requests", icon: TagIcon },
    ],
  },
  {
    section: "จัดการข้อมูล",
    items: [
      { label: "จัดการสินค้า", href: "/homeadmin/products", icon: CubeIcon },
      {
        label: "จัดการประเภทสินค้า",
        href: "/homeadmin/product-categories",
        icon: QueueListIcon,
      },
      {
        label: "จัดการราคาประตูม้วน",
        href: "/homeadmin/door-pricing",
        icon: BanknotesIcon,
      },
      { label: "จัดการผลงาน", href: "/homeadmin/portfolio", icon: ClipboardDocumentListIcon },
      { label: "จัดการสมาชิก", href: "/homeadmin/users", icon: UserGroupIcon },
    ],
  },
  {
    section: "ระบบ",
    items: [{ label: "ประวัติ", href: "/homeadmin/history", icon: WrenchScrewdriverIcon }],
  },
];

type AdminSidebarProps = {
  open: boolean;
  onClose: () => void;
};

export function AdminSidebar({ open, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {open && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
          aria-label="ปิดเมนูผู้ดูแลระบบ"
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 h-screen w-65 sm:w-70 bg-linear-to-b from-slate-900 to-slate-950 shadow-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-600/30">
                <span className="text-sm font-black text-white">DD</span>
              </div>
              <div>
                <p className="text-base font-bold leading-tight text-white">ดีเดย์</p>
                <p className="text-xs font-medium leading-tight text-slate-400">ประตูม้วน</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-800 hover:text-white"
              aria-label="ปิด sidebar"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="mx-5 border-t border-slate-700/50" />

          {/* Navigation */}
          <nav className="mt-4 flex-1 space-y-5 overflow-y-auto px-4 pb-6">
            {menuSections.map((group) => (
              <div key={group.section}>
                <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-widest text-slate-500">
                  {group.section}
                </p>
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive =
                      item.href === "/homeadmin"
                        ? pathname === item.href
                        : pathname.startsWith(item.href);

                    return (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={onClose}
                        className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                          isActive
                            ? "bg-blue-600 text-white shadow-md shadow-blue-600/25"
                            : "text-slate-300 hover:bg-slate-800 hover:text-white"
                        }`}
                      >
                        <Icon className="h-5 w-5 shrink-0" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* Footer */}
          <div className="border-t border-slate-700/50 px-5 py-4">
            <p className="text-[11px] text-slate-500">D-Day Engineering Admin v1.0</p>
          </div>
        </div>
      </aside>
    </>
  );
}
