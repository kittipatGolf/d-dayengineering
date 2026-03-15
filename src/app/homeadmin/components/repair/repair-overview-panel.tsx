"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ReportFilterControls } from "../report-filter-controls";
import { getRecentYears } from "../year-options";

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

export function RepairOverviewPanel() {
  const years = useMemo(() => getRecentYears(5), []);
  const [period, setPeriod] = useState<PeriodValue>("month");
  const [year, setYear] = useState<number>(years[0]);
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const [chartData, setChartData] = useState<ChartItem[]>([]);

  const fetchData = useCallback(async () => {
    try {
      const params = new URLSearchParams({ type: "repairs", period });
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
  const totalRepairCost = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-3xl font-bold text-slate-800">ค่าซ่อมสินค้า</h2>

      <ReportFilterControls
        idPrefix="repair"
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

      <div className="mt-3 flex items-center justify-center gap-2 text-[14px] text-slate-600">
        <span className="h-3 w-8 rounded-sm bg-pink-300" />
        <span>ค่าซ่อม (บาท)</span>
      </div>

      <div className="mt-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
        <div className="relative h-72">
          <div className="absolute inset-0 grid grid-rows-10">
            {Array.from({ length: 10 }).map((_, index) => (
              <span key={index} className="border-b border-slate-200" />
            ))}
          </div>

          <div className="relative flex h-full items-end gap-2 overflow-x-auto pb-1">
            {chartData.map((item) => {
              const barHeight = Math.max((item.value / highestValue) * 100, 3);

              return (
                <div
                  key={item.label}
                  className="flex min-w-[48px] flex-1 flex-col items-center gap-2"
                >
                  <div
                    className={`w-full rounded-t-md ${
                      item.active ? "bg-rose-500" : "bg-pink-300"
                    }`}
                    style={{ height: `${barHeight}%` }}
                    title={`${item.label}: ${item.value.toLocaleString()} บาท`}
                  />
                  <span className="text-xs text-slate-600">{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <p className="mt-4 text-3xl font-bold text-red-600">
        ค่าซ่อมรวม{period === "month" ? "เดือน" : "ปี"} -:{" "}
        {totalRepairCost.toLocaleString()} บาท
      </p>
    </section>
  );
}
