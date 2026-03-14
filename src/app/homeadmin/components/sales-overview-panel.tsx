"use client";

import { useMemo, useState } from "react";
import { getRecentYears } from "./year-options";
import { ReportFilterControls } from "./report-filter-controls";

const periods = [
  { value: "year", label: "รายปี" },
  { value: "month", label: "รายเดือน" },
] as const;

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

type PeriodValue = (typeof periods)[number]["value"];

type ChartItem = {
  label: string;
  value: number;
  active?: boolean;
};

function getYearlySales(years: number[]): ChartItem[] {
  return [...years].reverse().map((year, index) => ({
    label: String(year),
    value: 120000 + (index + 1) * 25000,
  }));
}

function getMonthlySales(selectedYear: number, selectedMonth: number): ChartItem[] {
  return months.map((month, index) => ({
    label: month,
    value: 8500 + (selectedYear % 7) * 500 + index * 1200,
    active: index === selectedMonth,
  }));
}

export function SalesOverviewPanel() {
  const years = useMemo(() => getRecentYears(5), []);
  const [period, setPeriod] = useState<PeriodValue>("year");
  const [year, setYear] = useState<number>(years[0]);
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());

  const chartData = useMemo(() => {
    if (period === "year") {
      return getYearlySales(years);
    }

    return getMonthlySales(year, selectedMonth);
  }, [period, year, years, selectedMonth]);

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
