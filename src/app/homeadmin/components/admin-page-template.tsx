type AdminPageTemplateProps = {
  title: string;
  description: string;
};

export function AdminPageTemplate({ title, description }: AdminPageTemplateProps) {
  return (
    <div className="rounded-3xl border border-slate-300 bg-slate-100 p-3 shadow-sm md:p-4">
      <header className="rounded-2xl bg-white px-5 py-5 shadow-sm">
        <h1 className="text-xl font-bold text-slate-900 md:text-2xl">{title}</h1>
        <p className="mt-2 text-sm text-slate-600">{description}</p>
      </header>

      <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-white/80 p-6 text-sm text-slate-500">
        พื้นที่สำหรับพัฒนาฟีเจอร์ของหน้า {title}
      </div>
    </div>
  );
}
