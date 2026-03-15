type AdminPageTemplateProps = {
  title: string;
  description: string;
};

export function AdminPageTemplate({ title, description }: AdminPageTemplateProps) {
  return (
    <div className="space-y-5">
      <header className="relative overflow-hidden rounded-2xl bg-linear-to-br from-blue-900 via-blue-800 to-slate-900 px-6 py-6 text-white shadow-lg">
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/5 blur-3xl" />
        <div className="relative">
          <h1 className="text-xl font-bold md:text-2xl">{title}</h1>
          <p className="mt-1 text-sm text-blue-200/80">{description}</p>
        </div>
      </header>

      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500">
        พื้นที่สำหรับพัฒนาฟีเจอร์ของหน้า {title}
      </div>
    </div>
  );
}
