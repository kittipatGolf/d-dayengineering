type HistorySummaryCardsProps = {
  total: number;
  completed: number;
  canceled: number;
};

export function HistorySummaryCards({ total, completed, canceled }: HistorySummaryCardsProps) {
  return (
    <section className="mt-4 grid gap-3 sm:grid-cols-3">
      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <p className="text-xs text-slate-500">รายการทั้งหมด</p>
        <p className="mt-1 text-2xl font-bold text-slate-900">{total}</p>
      </div>
      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <p className="text-xs text-slate-500">สถานะสำเร็จ</p>
        <p className="mt-1 text-2xl font-bold text-emerald-700">{completed}</p>
      </div>
      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <p className="text-xs text-slate-500">สถานะยกเลิก</p>
        <p className="mt-1 text-2xl font-bold text-rose-700">{canceled}</p>
      </div>
    </section>
  );
}

