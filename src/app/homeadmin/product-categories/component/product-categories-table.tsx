import {
  InboxIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
  TagIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { FilterTabs } from "../../components/admin-shared/filter-tabs";
import { ListHeaderActions } from "../../components/admin-shared/list-header-actions";
import type { CategoryKind, ProductCategory } from "./types";

type ProductCategoriesTableProps = {
  rows: ProductCategory[];
  activeTab: "ทั้งหมด" | CategoryKind;
  onTabChange: (tab: "ทั้งหมด" | CategoryKind) => void;
  onToggleStatus: (id: string) => void;
  onAddNew: () => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  keyword: string;
  onKeywordChange: (value: string) => void;
};

export function ProductCategoriesTable({
  rows,
  activeTab,
  onTabChange,
  onToggleStatus,
  onAddNew,
  onEdit,
  onDelete,
  keyword,
  onKeywordChange,
}: ProductCategoriesTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* header */}
      <div className="border-b border-slate-100 px-5 py-4">
        <ListHeaderActions
          title="รายการประเภทสินค้า"
          icon={TagIcon}
          addLabel="เพิ่มประเภทสินค้า"
          onAdd={onAddNew}
        />
      </div>

      {/* toolbar: tabs + search */}
      <div className="flex flex-col gap-3 border-b border-slate-100 bg-slate-50/60 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
        <FilterTabs
          options={["ทั้งหมด", "ประตูม้วน", "อะไหล่"] as const}
          value={activeTab}
          onChange={onTabChange}
          className=""
        />
        <label className="relative block w-full sm:max-w-56">
          <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={keyword}
            onChange={(e) => onKeywordChange(e.target.value)}
            placeholder="ค้นหาประเภทสินค้า..."
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
        </label>
      </div>

      {/* table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
              <th className="px-5 py-3 font-semibold">รหัส</th>
              <th className="px-5 py-3 font-semibold">ชื่อประเภท</th>
              <th className="px-5 py-3 font-semibold">กลุ่ม</th>
              <th className="px-5 py-3 font-semibold">สีที่รองรับ</th>
              <th className="px-5 py-3 font-semibold">สถานะ</th>
              <th className="px-5 py-3 font-semibold">การจัดการ</th>
              <th className="px-5 py-3 font-semibold">อัปเดตล่าสุด</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((item) => {
              const isActive = item.isActive;
              return (
                <tr key={item.id} className="transition-colors hover:bg-blue-50/40">
                  <td className="px-5 py-4 text-xs text-slate-400">{item.id}</td>
                  <td className="px-5 py-4 font-semibold text-slate-800">{item.name}</td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                      {item.kind}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-slate-600">
                    {item.kind === "ประตูม้วน" ? `${item.colors.length} สี` : "—"}
                  </td>
                  <td className="px-5 py-4">
                    <button
                      type="button"
                      aria-pressed={isActive}
                      aria-label="สลับสถานะ"
                      onClick={() => onToggleStatus(item.id)}
                      className="inline-flex items-center gap-2.5"
                    >
                      <span
                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ${
                          isActive ? "bg-emerald-500" : "bg-slate-300"
                        }`}
                      >
                        <span
                          className={`pointer-events-none absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm ring-1 ring-black/5 transition-transform duration-200 ${
                            isActive ? "translate-x-4" : "translate-x-0.5"
                          }`}
                        />
                      </span>
                      <span className={`text-xs font-medium ${isActive ? "text-emerald-700" : "text-slate-500"}`}>
                        {isActive ? "ใช้งานอยู่" : "ปิดใช้งาน"}
                      </span>
                    </button>
                  </td>
                  <td className="px-5 py-4">
                    <div className="inline-flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => onEdit(item.id)}
                        className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-blue-600"
                        aria-label={`แก้ไข ${item.name}`}
                      >
                        <PencilSquareIcon className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(item.id)}
                        className="rounded-lg p-1.5 text-slate-500 transition hover:bg-rose-50 hover:text-rose-600"
                        aria-label={`ลบ ${item.name}`}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-xs text-slate-400">{item.updatedAt}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* empty state */}
        {rows.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
              <InboxIcon className="h-8 w-8 text-slate-400" />
            </div>
            <p className="mt-4 font-medium text-slate-600">ไม่พบประเภทสินค้า</p>
            <p className="mt-1 text-sm text-slate-400">
              {keyword ? "ลองเปลี่ยนคำค้นหาหรือตัวกรอง" : "เริ่มต้นเพิ่มประเภทสินค้าใหม่ได้เลย"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
