import Link from "next/link";
import {
  ListBulletIcon,
  ClockIcon,
  CheckCircleIcon,
  CheckIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

type ProfileStatusTabsProps = {
  section: "orders" | "repair";
  activeStatus: "all" | "pending" | "confirmed" | "completed" | "cancelled";
};

const tabs = [
  { key: "all", label: "ทั้งหมด", icon: ListBulletIcon },
  { key: "pending", label: "รอการยืนยัน", icon: ClockIcon },
  { key: "confirmed", label: "ยืนยันแล้ว", icon: CheckCircleIcon },
  { key: "completed", label: "เสร็จแล้ว", icon: CheckIcon },
  { key: "cancelled", label: "ยกเลิก", icon: XCircleIcon },
] as const;

export function ProfileStatusTabs({ section, activeStatus }: ProfileStatusTabsProps) {
  return (
    <div className="rounded-xl bg-slate-100 p-1">
      <div className="flex flex-wrap items-center gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeStatus === tab.key;
          return (
            <Link
              key={tab.key}
              href={`/profile?section=${section}&status=${tab.key}`}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition ${
                active
                  ? "bg-white text-blue-700 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
