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
          className="fixed inset-0 z-40 bg-black/35"
          onClick={onClose}
          aria-label="ปิดเมนูผู้ดูแลระบบ"
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 h-screen w-[280px] border-r border-slate-200 bg-white shadow-xl transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
        <div className="flex items-center justify-end px-4 py-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="ปิด sidebar"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="mx-4 rounded-xl bg-slate-50 px-3 py-4 text-center">
          <p className="text-3xl font-black leading-none text-blue-700">ดีเดย์</p>
          <p className="mt-1 text-2xl font-bold leading-none text-slate-900">ประตูม้วน</p>
        </div>

        <div className="mt-4 border-t border-slate-200" />

        <nav className="mt-2 flex-1 space-y-4 overflow-y-auto px-3 pb-4">
          {menuSections.map((group) => (
            <div key={group.section}>
              <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                {group.section}
              </p>
              <div className="space-y-1">
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
                      className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition ${
                        isActive
                          ? "bg-blue-100 text-blue-900"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
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
        </div>
      </aside>
    </>
  );
}
