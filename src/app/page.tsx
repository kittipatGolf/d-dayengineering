export default function Home() {
  return (
    <section className="grid min-h-[70vh] place-items-center">
      <div className="w-full rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:p-12">
        <p className="mb-3 inline-flex rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
          หน้าแรก
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-5xl">
          D-Day Engineering
        </h1>
        <p className="mt-4 max-w-2xl text-slate-600">
          ผู้เชี่ยวชาญงานประตูม้วน บริการติดตั้ง ซ่อมบำรุง และจำหน่ายอะไหล่ครบวงจร
          พร้อมทีมงานดูแลหน้างานอย่างมืออาชีพ
        </p>
      </div>
    </section>
  );
}
