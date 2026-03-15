import {
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
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <ListHeaderActions
        title="จัดการราคาต่อ ตร.ม. รายสินค้า"
        icon={TagIcon}
        addLabel="เพิ่มช่วงราคา"
        onAdd={onAdd}
      />

      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
          />
        </label>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-200 text-slate-500">
            <tr>
              <th className="px-3 py-2 font-medium">สินค้า</th>
              <th className="px-3 py-2 font-medium">ความหนา</th>
              <th className="px-3 py-2 font-medium">พื้นที่ต่ำสุด</th>
              <th className="px-3 py-2 font-medium">พื้นที่สูงสุด</th>
              <th className="px-3 py-2 font-medium">ราคา / ตร.ม.</th>
              <th className="px-3 py-2 font-medium">อัปเดตล่าสุด</th>
              <th className="px-3 py-2 font-medium">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-slate-100">
                <td className="px-3 py-3 font-medium text-slate-800">{row.categoryName}</td>
                <td className="px-3 py-3 text-slate-700">{row.thickness}</td>
                <td className="px-3 py-3 text-slate-700">{row.minArea}</td>
                <td className="px-3 py-3 text-slate-700">{row.maxArea}</td>
                <td className="px-3 py-3 font-semibold text-slate-900">
                  {new Intl.NumberFormat("th-TH").format(row.pricePerSqm)} บาท
                </td>
                <td className="px-3 py-3 text-slate-500">{row.updatedAt}</td>
                <td className="px-3 py-3">
                  <div className="inline-flex items-center gap-1">
                    <button
                      type="button"
                      aria-label="แก้ไข"
                      onClick={() => onEdit(row.id)}
                      className="rounded-lg p-1.5 text-slate-600 transition hover:bg-slate-100"
                    >
                      <PencilSquareIcon className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      aria-label="ลบ"
                      onClick={() => onDelete(row.id)}
                      className="rounded-lg p-1.5 text-rose-600 transition hover:bg-rose-50"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
