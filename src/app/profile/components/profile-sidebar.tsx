import Link from "next/link";
import {
  ChevronRightIcon,
  MapPinIcon,
  WrenchScrewdriverIcon,
  ClipboardDocumentListIcon,
  PencilSquareIcon,
  KeyIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

type ProfileSidebarProps = {
  activeSection: "orders" | "address" | "repair";
  user: { firstName: string; lastName: string; email: string };
  onEditProfileClick: () => void;
  onChangePasswordClick: () => void;
};

const menuItems = [
  { key: "orders", label: "คำสั่งซื้อของฉัน", icon: ClipboardDocumentListIcon, href: "/profile?section=orders&status=all" },
  { key: "address", label: "ที่อยู่", icon: MapPinIcon, href: "/profile?section=address" },
  { key: "repair", label: "แจ้งซ่อม", icon: WrenchScrewdriverIcon, href: "/profile?section=repair&status=all" },
] as const;

export function ProfileSidebar({
  activeSection,
  user,
  onEditProfileClick,
  onChangePasswordClick,
}: ProfileSidebarProps) {
  const initial = user.firstName?.charAt(0)?.toUpperCase() || "U";

  return (
    <aside className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* User info header */}
      <div className="relative overflow-hidden bg-linear-to-br from-blue-900 via-blue-800 to-slate-900 px-5 py-6 text-center text-white">
        <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-blue-400/10 blur-3xl" />
        <div className="relative">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/15 text-2xl font-bold backdrop-blur-sm">
            {initial}
          </div>
          <p className="mt-3 text-lg font-bold">{user.firstName} {user.lastName}</p>
          <p className="mt-0.5 text-sm text-blue-200/80">{user.email}</p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex border-b border-slate-100">
        <button
          type="button"
          onClick={onEditProfileClick}
          className="flex flex-1 items-center justify-center gap-1.5 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-blue-600"
        >
          <PencilSquareIcon className="h-4 w-4" />
          แก้ไขโปรไฟล์
        </button>
        <div className="w-px bg-slate-100" />
        <button
          type="button"
          onClick={onChangePasswordClick}
          className="flex flex-1 items-center justify-center gap-1.5 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-blue-600"
        >
          <KeyIcon className="h-4 w-4" />
          เปลี่ยนรหัสผ่าน
        </button>
      </div>

      {/* Nav menu */}
      <nav className="p-3">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = activeSection === item.key;

            return (
              <Link
                key={item.key}
                href={item.href}
                className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left transition ${
                  active
                    ? "bg-blue-50 text-blue-700 font-semibold"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                }`}
              >
                <span className="inline-flex min-w-0 items-center gap-2.5">
                  <Icon className={`h-5 w-5 ${active ? "text-blue-600" : "text-slate-400"}`} />
                  <span className="truncate text-sm">{item.label}</span>
                </span>
                <ChevronRightIcon className={`h-4 w-4 ${active ? "text-blue-400" : "text-slate-300"}`} />
              </Link>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}
