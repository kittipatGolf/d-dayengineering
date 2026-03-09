export default function HomeAdminPage() {
  return (
    <section className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-10">
      <h1 className="text-3xl font-bold text-slate-900">Admin Home</h1>
      <p className="text-slate-600">Welcome to the admin dashboard.</p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm text-slate-500">Total Users</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">0</p>
        </article>
        <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm text-slate-500">Pending Repairs</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">0</p>
        </article>
        <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm text-slate-500">System Alerts</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">0</p>
        </article>
      </div>
    </section>
  );
}
