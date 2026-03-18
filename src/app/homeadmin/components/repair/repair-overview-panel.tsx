"use client";

import { useCallback, useEffect, useState } from "react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { ReportFilterControls } from "../report-filter-controls";

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
  const [years, setYears] = useState<number[]>([new Date().getFullYear()]);
  const [period, setPeriod] = useState<PeriodValue>("month");
  const [year, setYear] = useState<number>(new Date().getFullYear());

  useEffect(() => {
    fetch("/api/dashboard?type=years")
      .then((r) => (r.ok ? r.json() : null))
      .then((data: number[] | null) => {
        if (data && data.length > 0) {
          setYears(data);
          setYear(data[0]);
        }
      })
      .catch(() => {});
  }, []);
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const [chartData, setChartData] = useState<ChartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ type: "repairs", period });
      if (period === "month") params.set("year", String(year));

      const res = await fetch(`/api/dashboard?${params}`);
      if (!res.ok) {
        setError(res.status === 401 || res.status === 403 ? "ไม่มีสิทธิ์เข้าถึงข้อมูล" : "ไม่สามารถโหลดข้อมูลได้");
        setChartData([]);
        return;
      }
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
      setError("เกิดข้อผิดพลาดในการเชื่อมต่อ");
      setChartData([]);
    } finally {
      setLoading(false);
    }
  }, [period, year, years, selectedMonth]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const highestValue = Math.max(...chartData.map((item) => item.value), 1);
  const totalRepairCost = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-2xl font-bold text-slate-900">ค่าซ่อมสินค้า</h2>

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

      <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <div className="relative h-56">
          {/* grid lines */}
          <div className="absolute inset-0 grid grid-rows-5">
            <span className="border-b border-slate-200" />
            <span className="border-b border-slate-200" />
            <span className="border-b border-slate-200" />
            <span className="border-b border-slate-200" />
            <span className="border-b border-slate-200" />
          </div>

          {loading ? (
            <div className="relative flex h-full items-center justify-center">
              <div className="h-7 w-7 animate-spin rounded-full border-3 border-slate-200 border-t-pink-500" />
            </div>
          ) : error ? (
            <div className="relative flex h-full flex-col items-center justify-center gap-2 text-center">
              <ExclamationTriangleIcon className="h-8 w-8 text-amber-400" />
              <p className="text-sm text-slate-500">{error}</p>
            </div>
          ) : (
            <div className="relative flex h-full items-end gap-3 overflow-x-auto pb-1">
              {chartData.map((item) => {
                const barHeight = Math.max((item.value / highestValue) * 100, 5);
                return (
                  <div
                    key={item.label}
                    className="flex min-w-11 flex-1 flex-col items-center gap-2"
                  >
                    <div
                      className={`w-full rounded-t-md transition-all ${
                        item.active ? "bg-rose-500" : "bg-pink-300"
                      }`}
                      style={{ height: `${barHeight}%` }}
                      title={`${item.label}: ${item.value.toLocaleString()} บาท`}
                    />
                    <span className="text-xs font-medium text-slate-600">{item.label}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <p className="mt-4 text-lg font-semibold text-rose-700">
        ค่าซ่อมรวมทั้งหมด: {totalRepairCost.toLocaleString()} บาท
      </p>
    </section>
  );
}
