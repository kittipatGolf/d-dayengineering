type ProductStatsProps = {
  total: number;
  selling: number;
};

export function ProductStats({ total, selling }: ProductStatsProps) {
  return (
    <section className="grid gap-4 sm:grid-cols-3">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
        <p className="text-sm font-medium text-slate-500">สินค้าทั้งหมด</p>
        <p className="mt-2 text-2xl font-bold text-slate-900">{total}</p>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
        <p className="text-sm font-medium text-slate-500">สินค้าวางขาย</p>
        <p className="mt-2 text-2xl font-bold text-emerald-600">{selling}</p>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
        <p className="text-sm font-medium text-slate-500">สินค้าหยุดขาย</p>
        <p className="mt-2 text-2xl font-bold text-rose-600">{total - selling}</p>
      </div>
    </section>
  );
}
