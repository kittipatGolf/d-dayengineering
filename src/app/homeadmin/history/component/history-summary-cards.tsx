type HistorySummaryCardsProps = {
  total: number;
  completed: number;
  canceled: number;
};

export function HistorySummaryCards({ total, completed, canceled }: HistorySummaryCardsProps) {
  return (
    <section className="mt-4 grid gap-4 sm:grid-cols-3">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-medium text-slate-500">รายการทั้งหมด</p>
        <p className="mt-2 text-2xl font-bold text-slate-900">{total}</p>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-medium text-slate-500">สถานะสำเร็จ</p>
        <p className="mt-2 text-2xl font-bold text-emerald-600">{completed}</p>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-medium text-slate-500">สถานะยกเลิก</p>
        <p className="mt-2 text-2xl font-bold text-rose-600">{canceled}</p>
      </div>
    </section>
  );
}
