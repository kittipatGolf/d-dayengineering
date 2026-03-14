import { MagnifyingGlassIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
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
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-3xl font-bold text-slate-900">การจัดการผู้ใช้</h2>

        <label className="relative block w-full max-w-[320px]">
          <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            value={keyword}
            onChange={(event) => onKeywordChange(event.target.value)}
            placeholder="ค้นหาข้อมูลผู้ใช้"
            className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-800 outline-none transition focus:border-blue-500"
          />
        </label>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
            <tr>
              <th className="px-3 py-3 font-semibold">ไอดีผู้ใช้</th>
              <th className="px-3 py-3 font-semibold">ชื่อผู้ใช้</th>
              <th className="px-3 py-3 font-semibold">ชื่อจริง</th>
              <th className="px-3 py-3 font-semibold">นามสกุล</th>
              <th className="px-3 py-3 font-semibold">อีเมล</th>
              <th className="px-3 py-3 font-semibold">เบอร์โทรศัพท์</th>
              <th className="px-3 py-3 font-semibold">ที่อยู่</th>
              <th className="px-3 py-3 font-semibold">บทบาท</th>
              <th className="px-3 py-3 font-semibold">การจัดการ</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-slate-100">
                <td className="px-3 py-4 text-slate-700">{row.id.replace("USR-", "")}</td>
                <td className="px-3 py-4 font-medium text-slate-800">{row.username}</td>
                <td className="px-3 py-4 text-slate-700">{row.firstName}</td>
                <td className="px-3 py-4 text-slate-700">{row.lastName}</td>
                <td className="px-3 py-4 text-slate-700">{row.email}</td>
                <td className="px-3 py-4 text-slate-700">{row.phone}</td>
                <td className="px-3 py-4">
                  <button
                    type="button"
                    onClick={() => onViewAddresses(row)}
                    className="text-blue-600 underline underline-offset-2 transition hover:text-blue-800"
                  >
                    ดูที่อยู่
                  </button>
                </td>
                <td className="px-3 py-4">
                  <span
                    className={`inline-flex rounded-md px-2 py-1 text-xs font-semibold ${
                      row.role === "Admin" ? "bg-rose-500 text-white" : "bg-sky-600 text-white"
                    }`}
                  >
                    {row.role}
                  </span>
                </td>
                <td className="px-3 py-4">
                  <div className="inline-flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(row)}
                      className="rounded-lg p-1.5 text-slate-600 transition hover:bg-slate-100"
                      aria-label={`แก้ไข ${row.username}`}
                    >
                      <PencilSquareIcon className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(row.id)}
                      className="rounded-lg p-1.5 text-rose-600 transition hover:bg-rose-50"
                      aria-label={`ลบ ${row.username}`}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-3 py-8 text-center text-slate-500">
                  ไม่พบข้อมูลผู้ใช้
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}

