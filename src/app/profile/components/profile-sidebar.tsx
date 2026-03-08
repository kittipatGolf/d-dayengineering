import Link from "next/link";
import {
  ChevronRightIcon,
  MapPinIcon,
  WrenchScrewdriverIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";

type ProfileSidebarProps = {
  activeSection: "orders" | "address" | "repair";
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
  onEditProfileClick,
  onChangePasswordClick,
}: ProfileSidebarProps) {
  return (
    <aside className="rounded-xl bg-sky-600 p-4 text-white shadow-md sm:p-5">
      <div className="text-center">
        <p className="font-bold">กฤติภัทร ไชยประณีธาน</p>
        <div className="mt-4 space-y-2">
          <button
            type="button"
            onClick={onEditProfileClick}
            className="w-full rounded bg-sky-500 px-4 py-2 font-semibold hover:bg-sky-400 sm:w-auto"
          >
            แก้ไขโปรไฟล์
          </button>
          <div>
            <button
              type="button"
              onClick={onChangePasswordClick}
              className="w-full rounded bg-cyan-600 px-4 py-2 font-semibold hover:bg-cyan-500 sm:w-auto"
            >
              เปลี่ยนรหัสผ่าน
            </button>
          </div>
        </div>
      </div>

      <div className="my-5 border-t border-sky-300" />

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = activeSection === item.key;

          return (
            <Link
              key={item.key}
              href={item.href}
              className={`flex w-full items-center justify-between rounded-lg px-4 py-3 text-left transition ${
                active ? "bg-sky-500" : "hover:bg-sky-500/70"
              }`}
            >
              <span className="inline-flex min-w-0 items-center gap-2 font-semibold">
                <Icon className="h-5 w-5" />
                <span className="truncate">{item.label}</span>
              </span>
              <ChevronRightIcon className="h-5 w-5" />
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
