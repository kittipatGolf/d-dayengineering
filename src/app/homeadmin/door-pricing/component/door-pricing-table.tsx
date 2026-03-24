import {
  InboxIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
  TagIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { FilterTabs } from "../../components/admin-shared/filter-tabs";
import { ListHeaderActions } from "../../components/admin-shared/list-header-actions";
import type { DoorPricingRow } from "./types";

type DoorPricingTableProps = {
  rows: DoorPricingRow[];
  filterValue: string;
  filterOptions: readonly string[];
  onFilterChange: (value: string) => void;
  onAdd: () => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  keyword: string;
  onKeywordChange: (value: string) => void;
};

export function DoorPricingTable({
  rows,
  filterValue,
  filterOptions,
  onFilterChange,
  onAdd,
  onEdit,
  onDelete,
  keyword,
  onKeywordChange,
}: DoorPricingTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* header */}
      <div className="border-b border-slate-100 px-5 py-4">
        <ListHeaderActions
          title="จัดการราคาต่อ ตร.ม. รายสินค้า"
          icon={TagIcon}
          addLabel="เพิ่มช่วงราคา"
          onAdd={onAdd}
        />
      </div>

      {/* toolbar: tabs + search */}
      <div className="flex flex-col gap-3 border-b border-slate-100 bg-slate-50/60 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
        <FilterTabs
          options={filterOptions}
          value={filterValue}
          onChange={onFilterChange}
          className=""
        />
        <label className="relative block w-full sm:max-w-56">
          <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={keyword}
            onChange={(e) => onKeywordChange(e.target.value)}
            placeholder="ค้นหาราคาประตูม้วน..."
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
        </label>
      </div>

      {/* table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
              <th className="px-5 py-3 font-semibold">สินค้า</th>
              <th className="px-5 py-3 font-semibold">ความหนา</th>
              <th className="px-5 py-3 font-semibold">พื้นที่ต่ำสุด</th>
              <th className="px-5 py-3 font-semibold">พื้นที่สูงสุด</th>
              <th className="px-5 py-3 font-semibold">ราคา / ตร.ม.</th>
              <th className="px-5 py-3 font-semibold">อัปเดตล่าสุด</th>
              <th className="px-5 py-3 font-semibold">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row) => (
              <tr key={row.id} className="transition-colors hover:bg-blue-50/40">
                <td className="px-5 py-4 font-semibold text-slate-800">{row.categoryName}</td>
                <td className="px-5 py-4">
                  <span className="inline-flex items-center rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                    {row.thickness}
                  </span>
                </td>
                <td className="px-5 py-4 text-slate-700">{row.minArea}</td>
                <td className="px-5 py-4 text-slate-700">{row.maxArea}</td>
                <td className="px-5 py-4">
                  <span className="font-semibold text-slate-900">
                    {new Intl.NumberFormat("th-TH").format(row.pricePerSqm)}
                    <span className="ml-0.5 text-xs font-normal text-slate-400">บาท</span>
                  </span>
                </td>
                <td className="px-5 py-4 text-xs text-slate-400">{row.updatedAt}</td>
                <td className="px-5 py-4">
                  <div className="inline-flex items-center gap-1">
                    <button
                      type="button"
                      aria-label="แก้ไข"
                      onClick={() => onEdit(row.id)}
                      className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-blue-600"
                    >
                      <PencilSquareIcon className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      aria-label="ลบ"
                      onClick={() => onDelete(row.id)}
                      className="rounded-lg p-1.5 text-slate-500 transition hover:bg-rose-50 hover:text-rose-600"
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
            <p className="mt-4 font-medium text-slate-600">ไม่พบข้อมูลราคา</p>
            <p className="mt-1 text-sm text-slate-400">
              {keyword ? "ลองเปลี่ยนคำค้นหาหรือตัวกรอง" : "เริ่มต้นเพิ่มช่วงราคาใหม่ได้เลย"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
