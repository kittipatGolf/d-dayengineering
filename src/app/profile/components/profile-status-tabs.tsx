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
  { key: "confirmed", label: "ได้รับการยืนยันแล้ว", icon: CheckCircleIcon },
  { key: "completed", label: "เสร็จแล้ว", icon: CheckIcon },
  { key: "cancelled", label: "ยกเลิก", icon: XCircleIcon },
] as const;

export function ProfileStatusTabs({ section, activeStatus }: ProfileStatusTabsProps) {
  return (
    <div className="border-b border-slate-200 pb-3">
      <div className="flex flex-wrap items-center gap-3 sm:gap-x-8 sm:gap-y-3">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const active = activeStatus === tab.key;
        return (
          <Link
            key={tab.key}
            href={`/profile?section=${section}&status=${tab.key}`}
            className={`inline-flex items-center gap-1.5 border-b-2 pb-2 text-sm transition sm:text-base ${
              active ? "border-sky-500 text-sky-500" : "border-transparent text-slate-600 hover:text-sky-600"
            }`}
          >
            <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="font-semibold">{tab.label}</span>
          </Link>
        );
      })}
      </div>
    </div>
  );
}
