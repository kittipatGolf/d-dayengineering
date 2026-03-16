"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { SearchableSelect } from "@/components/searchable-select";
import { getRecentYears } from "../year-options";

const periodOptions = [
  { value: "day", label: "รายวัน" },
  { value: "month", label: "รายเดือน" },
] as const;

const monthNames = [
  "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
  "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค.",
];

type UserOption = { id: string; firstName: string; lastName: string };
type DataRow = { month?: number; day?: number; total: number };
type UserData = { orders: DataRow[]; repairs: DataRow[] } | null;
type PeriodValue = (typeof periodOptions)[number]["value"];

export function UserStatisticsPanel() {
  const years = useMemo(() => getRecentYears(5), []);
  const [period, setPeriod] = useState<PeriodValue>("month");
  const [year, setYear] = useState<number>(years[0]);
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [users, setUsers] = useState<UserOption[]>([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [data, setData] = useState<UserData>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams({ type: "user-stats" });
    if (selectedUser) {
      params.set("userId", selectedUser);
      params.set("period", period);
      params.set("year", String(year));
      if (period === "day") params.set("month", String(month));
    }

    try {
      const res = await fetch(`/api/dashboard?${params}`);
      if (!res.ok) {
        setError(res.status === 401 || res.status === 403 ? "ไม่มีสิทธิ์เข้าถึงข้อมูล" : "ไม่สามารถโหลดข้อมูลได้");
        return;
      }
      const json = await res.json();
      setUsers(json.users ?? []);
      setData(json.data);
    } catch {
      setError("เกิดข้อผิดพลาดในการเชื่อมต่อ");
    } finally {
      setLoading(false);
    }
  }, [selectedUser, period, year, month]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const labels = useMemo(() => {
    if (!data) return [];
    if (period === "month") {
      return Array.from({ length: 12 }, (_, i) => ({ key: i + 1, label: monthNames[i] }));
    }
    const daysInMonth = new Date(year, month, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => ({ key: i + 1, label: String(i + 1) }));
  }, [data, period, year, month]);

  const orderMap = useMemo(() => {
    if (!data) return new Map<number, number>();
    const field = period === "month" ? "month" : "day";
    return new Map(data.orders.map((r) => [r[field]!, r.total]));
  }, [data, period]);

  const repairMap = useMemo(() => {
    if (!data) return new Map<number, number>();
    const field = period === "month" ? "month" : "day";
    return new Map(data.repairs.map((r) => [r[field]!, r.total]));
  }, [data, period]);

  const totalOrders = data ? data.orders.reduce((s, r) => s + r.total, 0) : 0;
  const totalRepairs = data ? data.repairs.reduce((s, r) => s + r.total, 0) : 0;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-2xl font-bold text-slate-900">สถิติตามผู้ใช้</h2>

      <div className="mt-4 flex flex-wrap gap-3">
        <SearchableSelect
          placeholder="เลือกผู้ใช้"
          options={users.map((u) => ({ value: u.id, label: `${u.firstName} ${u.lastName}` }))}
          value={selectedUser}
          onChange={setSelectedUser}
          size="sm"
          className="w-48"
        />

        <SearchableSelect
          options={periodOptions.map((o) => ({ value: o.value, label: o.label }))}
          value={period}
          onChange={(v) => setPeriod(v as PeriodValue)}
          searchable={false}
          size="sm"
          className="w-32"
        />

        <SearchableSelect
          options={years.map((y) => ({ value: String(y), label: `ปี ${y}` }))}
          value={String(year)}
          onChange={(v) => setYear(Number(v))}
          searchable={false}
          size="sm"
          className="w-32"
        />

        {period === "day" && (
          <SearchableSelect
            options={monthNames.map((name, i) => ({ value: String(i + 1), label: name }))}
            value={String(month)}
            onChange={(v) => setMonth(Number(v))}
            size="sm"
            className="w-32"
          />
        )}
      </div>

      {loading ? (
        <div className="mt-6 flex items-center justify-center py-12">
          <div className="h-7 w-7 animate-spin rounded-full border-3 border-slate-200 border-t-blue-600" />
        </div>
      ) : error ? (
        <div className="mt-6 flex flex-col items-center justify-center gap-2 py-12 text-center">
          <ExclamationTriangleIcon className="h-8 w-8 text-amber-400" />
          <p className="text-sm text-slate-500">{error}</p>
        </div>
      ) : !selectedUser ? (
        <p className="mt-4 text-slate-500">กรุณาเลือกผู้ใช้</p>
      ) : data ? (
        <>
          <div className="mt-3 flex items-center gap-4 text-sm text-slate-600">
            <span className="flex items-center gap-1">
              <span className="inline-block h-3 w-6 rounded-sm bg-blue-500" /> ยอดสั่งซื้อ
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block h-3 w-6 rounded-sm bg-pink-400" /> ค่าซ่อม
            </span>
          </div>

          <div className="mt-2 overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-3 py-2 text-left font-medium">{period === "month" ? "เดือน" : "วัน"}</th>
                  <th className="px-3 py-2 text-right font-medium">ยอดสั่งซื้อ (บาท)</th>
                  <th className="px-3 py-2 text-right font-medium">ค่าซ่อม (บาท)</th>
                </tr>
              </thead>
              <tbody>
                {labels.map(({ key, label }) => (
                  <tr key={key} className="border-t border-slate-100">
                    <td className="px-3 py-1.5 text-slate-700">{label}</td>
                    <td className="px-3 py-1.5 text-right text-blue-600">
                      {(orderMap.get(key) ?? 0).toLocaleString()}
                    </td>
                    <td className="px-3 py-1.5 text-right text-pink-600">
                      {(repairMap.get(key) ?? 0).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-3 flex gap-6 text-sm font-semibold">
            <span className="text-blue-700">ยอดสั่งซื้อรวม: {totalOrders.toLocaleString()} บาท</span>
            <span className="text-pink-700">ค่าซ่อมรวม: {totalRepairs.toLocaleString()} บาท</span>
          </div>
        </>
      ) : null}
    </section>
  );
}
