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
    <article className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className={`mt-3 text-2xl font-bold ${valueColor}`}>{value}</p>
    </article>
  );
}
