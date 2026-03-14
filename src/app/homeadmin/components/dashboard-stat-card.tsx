type DashboardStatCardProps = {
  title: string;
  value: string;
  valueColor: string;
};

export function DashboardStatCard({
  title,
  value,
  valueColor,
}: DashboardStatCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-600">{title}</p>
      <p className={`mt-4 text-3xl font-bold ${valueColor}`}>{value}</p>
    </article>
  );
}
