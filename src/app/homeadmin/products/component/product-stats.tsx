type ProductStatsProps = {
  total: number;
  selling: number;
};

export function ProductStats({ total, selling }: ProductStatsProps) {
  return (
    <section className="mt-4 grid gap-3 sm:grid-cols-3">
      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <p className="text-xs text-slate-500">สินค้าทั้งหมด</p>
        <p className="mt-1 text-2xl font-bold text-slate-900">{total}</p>
      </div>
      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <p className="text-xs text-slate-500">สินค้าวางขาย</p>
        <p className="mt-1 text-2xl font-bold text-emerald-700">{selling}</p>
      </div>
      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <p className="text-xs text-slate-500">สินค้าหยุดขาย</p>
        <p className="mt-1 text-2xl font-bold text-rose-700">{total - selling}</p>
      </div>
    </section>
  );
}
