import {
  ClipboardDocumentListIcon,
  EyeIcon,
  InboxIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import { FilterTabs } from "../../components/admin-shared/filter-tabs";
import { SearchableSelect } from "@/components/searchable-select";
import type { OrderRecord, OrderStatus } from "./types";

type ActiveTab = "ทั้งหมด" | "รอการยืนยัน" | "ได้รับการยืนยัน";

type OrdersTableProps = {
  rows: OrderRecord[];
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  keyword: string;
  onKeywordChange: (value: string) => void;
  onOpenAddress: (order: OrderRecord) => void;
  onOpenItems: (order: OrderRecord) => void;
  onOpenSummary: (order: OrderRecord) => void;
  onChangeStatus: (id: string, status: OrderStatus) => void;
};

const statusOptions = [
  { value: "รอการยืนยัน", label: "รอการยืนยัน" },
  { value: "ได้รับการยืนยัน", label: "ได้รับการยืนยัน" },
  { value: "สำเร็จ", label: "สำเร็จ" },
  { value: "ยกเลิก", label: "ยกเลิก" },
];

function statusClassName(status: OrderStatus) {
  if (status === "สำเร็จ") return "bg-emerald-50 text-emerald-700";
  if (status === "ยกเลิก") return "bg-rose-50 text-rose-700";
  if (status === "ได้รับการยืนยัน") return "bg-blue-50 text-blue-700";
  return "bg-amber-50 text-amber-700";
}

export function OrdersTable({
  rows,
  activeTab,
  onTabChange,
  keyword,
  onKeywordChange,
  onOpenAddress,
  onOpenItems,
  onOpenSummary,
  onChangeStatus,
}: OrdersTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* header */}
      <div className="border-b border-slate-100 px-5 py-4">
        <div className="flex items-center gap-2">
          <ClipboardDocumentListIcon className="h-5 w-5 text-slate-400" />
          <h2 className="text-base font-bold text-slate-900">รายการคำสั่งซื้อ</h2>
        </div>
      </div>

      {/* toolbar: tabs + search */}
      <div className="flex flex-col gap-3 border-b border-slate-100 bg-slate-50/60 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
        <FilterTabs
          options={["ทั้งหมด", "รอการยืนยัน", "ได้รับการยืนยัน"] as const}
          value={activeTab}
          onChange={onTabChange}
          className=""
        />
        <label className="relative block w-full sm:max-w-56">
          <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={keyword}
            onChange={(e) => onKeywordChange(e.target.value)}
            placeholder="ค้นหาคำสั่งซื้อ..."
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
        </label>
      </div>

      {/* table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
              <th className="px-5 py-3 font-semibold">หมายเลข</th>
              <th className="px-5 py-3 font-semibold">ชื่อจริง</th>
              <th className="px-5 py-3 font-semibold">นามสกุล</th>
              <th className="px-5 py-3 font-semibold">เบอร์โทร</th>
              <th className="px-5 py-3 font-semibold">ที่อยู่</th>
              <th className="px-5 py-3 font-semibold">สินค้า</th>
              <th className="px-5 py-3 font-semibold">ยอดรวม</th>
              <th className="px-5 py-3 font-semibold">สถานะ</th>
              <th className="px-5 py-3 font-semibold">เปลี่ยนสถานะ</th>
              <th className="px-5 py-3 font-semibold">สรุป</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row) => (
              <tr key={row.id} className="transition-colors hover:bg-blue-50/40">
                <td className="px-5 py-4 font-semibold text-slate-800">{row.id}</td>
                <td className="px-5 py-4 text-slate-700">{row.firstName}</td>
                <td className="px-5 py-4 text-slate-700">{row.lastName}</td>
                <td className="px-5 py-4 text-slate-700">{row.phone}</td>
                <td className="px-5 py-4">
                  <button
                    type="button"
                    onClick={() => onOpenAddress(row)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                  >
                    <MapPinIcon className="h-3.5 w-3.5" />
                    ดูที่อยู่
                  </button>
                </td>
                <td className="px-5 py-4">
                  <button
                    type="button"
                    onClick={() => onOpenItems(row)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                  >
                    <EyeIcon className="h-3.5 w-3.5" />
                    ดูสินค้า
                  </button>
                </td>
                <td className="px-5 py-4">
                  <span className="font-semibold text-slate-900">
                    {new Intl.NumberFormat("th-TH").format(row.totalAmount)}
                    <span className="ml-0.5 text-xs font-normal text-slate-400">บาท</span>
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span className={`inline-flex rounded-lg px-2.5 py-1 text-xs font-semibold ${statusClassName(row.status)}`}>
                    {row.status}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <SearchableSelect
                    options={statusOptions}
                    value={row.status}
                    onChange={(v) => onChangeStatus(row.id, v as OrderStatus)}
                    searchable={false}
                    size="sm"
                    className="min-w-36"
                  />
                </td>
                <td className="px-5 py-4">
                  <button
                    type="button"
                    onClick={() => onOpenSummary(row)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                  >
                    ดูสรุป
                  </button>
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
            <p className="mt-4 font-medium text-slate-600">ไม่พบข้อมูลคำสั่งซื้อ</p>
            <p className="mt-1 text-sm text-slate-400">
              {keyword ? "ลองเปลี่ยนคำค้นหาหรือตัวกรอง" : "ยังไม่มีคำสั่งซื้อ"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
