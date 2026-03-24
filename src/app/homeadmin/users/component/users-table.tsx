import {
  InboxIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
  TrashIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import type { AdminUser } from "./types";

type UsersTableProps = {
  rows: AdminUser[];
  keyword: string;
  onKeywordChange: (value: string) => void;
  onViewAddresses: (user: AdminUser) => void;
  onEdit: (user: AdminUser) => void;
  onDelete: (id: string) => void;
};

export function UsersTable({
  rows,
  keyword,
  onKeywordChange,
  onViewAddresses,
  onEdit,
  onDelete,
}: UsersTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* header */}
      <div className="border-b border-slate-100 px-5 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <UsersIcon className="h-5 w-5 text-slate-400" />
            <h2 className="text-base font-bold text-slate-900">การจัดการผู้ใช้</h2>
          </div>
        </div>
      </div>

      {/* toolbar: search */}
      <div className="flex items-center justify-end border-b border-slate-100 bg-slate-50/60 px-5 py-3">
        <label className="relative block w-full sm:max-w-56">
          <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={keyword}
            onChange={(e) => onKeywordChange(e.target.value)}
            placeholder="ค้นหาผู้ใช้..."
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
        </label>
      </div>

      {/* table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
              <th className="px-5 py-3 font-semibold">ไอดี</th>
              <th className="px-5 py-3 font-semibold">ชื่อผู้ใช้</th>
              <th className="px-5 py-3 font-semibold">ชื่อจริง</th>
              <th className="px-5 py-3 font-semibold">นามสกุล</th>
              <th className="px-5 py-3 font-semibold">อีเมล</th>
              <th className="px-5 py-3 font-semibold">เบอร์โทร</th>
              <th className="px-5 py-3 font-semibold">ที่อยู่</th>
              <th className="px-5 py-3 font-semibold">บทบาท</th>
              <th className="px-5 py-3 font-semibold">การจัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row) => (
              <tr key={row.id} className="transition-colors hover:bg-blue-50/40">
                <td className="px-5 py-4 text-xs text-slate-400">{row.id.replace("USR-", "")}</td>
                <td className="px-5 py-4 font-semibold text-slate-800">{row.username}</td>
                <td className="px-5 py-4 text-slate-700">{row.firstName}</td>
                <td className="px-5 py-4 text-slate-700">{row.lastName}</td>
                <td className="px-5 py-4 text-slate-700">{row.email}</td>
                <td className="px-5 py-4 text-slate-700">{row.phone}</td>
                <td className="px-5 py-4">
                  <button
                    type="button"
                    onClick={() => onViewAddresses(row)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                  >
                    ดูที่อยู่
                  </button>
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex rounded-lg px-2.5 py-1 text-xs font-semibold ${
                      row.role === "Admin"
                        ? "bg-rose-50 text-rose-700"
                        : "bg-blue-50 text-blue-700"
                    }`}
                  >
                    {row.role}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="inline-flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => onEdit(row)}
                      className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-blue-600"
                      aria-label={`แก้ไข ${row.username}`}
                    >
                      <PencilSquareIcon className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(row.id)}
                      className="rounded-lg p-1.5 text-slate-500 transition hover:bg-rose-50 hover:text-rose-600"
                      aria-label={`ลบ ${row.username}`}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* empty state */}
        {rows.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
              <InboxIcon className="h-8 w-8 text-slate-400" />
            </div>
            <p className="mt-4 font-medium text-slate-600">ไม่พบข้อมูลผู้ใช้</p>
            <p className="mt-1 text-sm text-slate-400">
              {keyword ? "ลองเปลี่ยนคำค้นหา" : "ยังไม่มีผู้ใช้ในระบบ"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
