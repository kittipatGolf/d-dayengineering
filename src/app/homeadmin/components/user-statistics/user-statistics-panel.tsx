"use client";

import { useMemo, useState } from "react";
import { getRecentYears } from "../year-options";

const periodOptions = [
  { value: "day", label: "รายวัน" },
  { value: "month", label: "รายเดือน" },
] as const;

export function UserStatisticsPanel() {
  const years = useMemo(() => getRecentYears(5), []);
  const [period, setPeriod] = useState<(typeof periodOptions)[number]["value"]>("day");
  const [year, setYear] = useState<number>(years[0]);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-2xl font-bold text-slate-900">สถิติตามผู้ใช้</h2>

      <div className="mt-4 flex flex-wrap gap-3">
        <select
          className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          defaultValue=""
        >
          <option value="" disabled>
            เลือกผู้ใช้
          </option>
        </select>

        <select
          value={period}
          onChange={(event) =>
            setPeriod(event.target.value as (typeof periodOptions)[number]["value"])
          }
          className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        >
          {periodOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          value={year}
          onChange={(event) => setYear(Number(event.target.value))}
          className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        >
          {years.map((yearOption) => (
            <option key={yearOption} value={yearOption}>
              ปี {yearOption}
            </option>
          ))}
        </select>
      </div>

      <p className="mt-4 text-slate-500">กรุณาเลือกผู้ใช้</p>
    </section>
  );
}
