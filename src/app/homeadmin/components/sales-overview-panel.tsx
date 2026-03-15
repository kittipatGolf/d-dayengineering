"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getRecentYears } from "./year-options";
import { ReportFilterControls } from "./report-filter-controls";

const periods = [
  { value: "year", label: "รายปี" },
  { value: "month", label: "รายเดือน" },
] as const;

const months = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
] as const;

type PeriodValue = (typeof periods)[number]["value"];

type ChartItem = {
  label: string;
  value: number;
  active?: boolean;
};

export function SalesOverviewPanel() {
  const years = useMemo(() => getRecentYears(5), []);
  const [period, setPeriod] = useState<PeriodValue>("year");
  const [year, setYear] = useState<number>(years[0]);
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const [chartData, setChartData] = useState<ChartItem[]>([]);

  const fetchData = useCallback(async () => {
    try {
      const params = new URLSearchParams({ type: "sales", period });
      if (period === "month") params.set("year", String(year));

      const res = await fetch(`/api/dashboard?${params}`);
      if (!res.ok) return;
      const rows: { year?: number; month?: number; total: number }[] = await res.json();

      if (period === "year") {
        const yearMap = new Map(rows.map((r) => [r.year!, r.total]));
        setChartData(
          [...years].reverse().map((y) => ({
            label: String(y),
            value: yearMap.get(y) ?? 0,
          })),
        );
      } else {
        const monthMap = new Map(rows.map((r) => [r.month!, r.total]));
        setChartData(
          months.map((m, i) => ({
            label: m,
            value: monthMap.get(i + 1) ?? 0,
            active: i === selectedMonth,
          })),
        );
      }
    } catch {
      /* ignore */
    }
  }, [period, year, years, selectedMonth]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const highestValue = Math.max(...chartData.map((item) => item.value), 1);
  const totalSales = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-2xl font-bold text-slate-900">ยอดขายสินค้า</h2>

      <ReportFilterControls
        idPrefix="sales"
        period={period}
        year={year}
        selectedMonth={selectedMonth}
        showMonth={period === "month"}
        periodOptions={periods}
        years={years}
        monthOptions={months}
        onPeriodChange={(value) => setPeriod(value as PeriodValue)}
        onYearChange={setYear}
        onMonthChange={setSelectedMonth}
      />

      <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <div className="relative h-56">
          <div className="absolute inset-0 grid grid-rows-5">
            <span className="border-b border-slate-200" />
            <span className="border-b border-slate-200" />
            <span className="border-b border-slate-200" />
            <span className="border-b border-slate-200" />
            <span className="border-b border-slate-200" />
          </div>

          <div className="relative flex h-full items-end gap-3 overflow-x-auto pb-1">
            {chartData.map((item) => {
              const barHeight = Math.max((item.value / highestValue) * 100, 5);

              return (
                <div
                  key={item.label}
                  className="flex min-w-[44px] flex-1 flex-col items-center gap-2"
                >
                  <div
                    className={`w-full rounded-t-md transition-all ${
                      item.active ? "bg-amber-400" : "bg-blue-600"
                    }`}
                    style={{ height: `${barHeight}%` }}
                    title={`${item.label}: ${item.value.toLocaleString()} บาท`}
                  />
                  <span className="text-xs font-medium text-slate-600">{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <p className="mt-4 text-lg font-semibold text-emerald-700">
        ยอดขายรวมทั้งหมด: {totalSales.toLocaleString()} บาท
      </p>
    </section>
  );
}
