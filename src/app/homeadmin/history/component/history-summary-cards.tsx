import {
  ClipboardDocumentListIcon,
  CheckBadgeIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

type HistorySummaryCardsProps = {
  total: number;
  completed: number;
  canceled: number;
};

const cards = [
  {
    key: "total" as const,
    label: "รายการทั้งหมด",
    icon: ClipboardDocumentListIcon,
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-100",
    accent: "bg-blue-600",
  },
  {
    key: "completed" as const,
    label: "สถานะสำเร็จ",
    icon: CheckBadgeIcon,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
    accent: "bg-emerald-500",
  },
  {
    key: "canceled" as const,
    label: "สถานะยกเลิก",
    icon: XCircleIcon,
    color: "text-rose-600",
    bg: "bg-rose-50",
    border: "border-rose-100",
    accent: "bg-rose-500",
  },
];

export function HistorySummaryCards({ total, completed, canceled }: HistorySummaryCardsProps) {
  const values = { total, completed, canceled };

  return (
    <section className="mt-4 grid gap-4 sm:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.key}
            className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className={`absolute left-0 top-0 h-full w-1 ${card.accent}`} />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">{card.label}</p>
                <p className={`mt-1.5 text-3xl font-bold tracking-tight ${card.color}`}>
                  {values[card.key].toLocaleString("th-TH")}
                </p>
                <p className="mt-1 text-xs text-slate-400">รายการ</p>
              </div>
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.bg} ${card.border} border`}>
                <Icon className={`h-6 w-6 ${card.color}`} />
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}
