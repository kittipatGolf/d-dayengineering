export function ServicesSection() {
  return (
    <section className="w-full">
      <h2 className="mb-4 text-4xl font-bold text-slate-900">บริการของเรา</h2>
      <div className="grid gap-6 lg:grid-cols-2">
        <article className="h-[360px] rounded-2xl border-2 border-dashed border-slate-300 bg-slate-100/80 shadow-sm" />
        <article className="h-[360px] rounded-2xl border-2 border-dashed border-slate-300 bg-slate-100/80 shadow-sm" />
      </div>
    </section>
  );
}
