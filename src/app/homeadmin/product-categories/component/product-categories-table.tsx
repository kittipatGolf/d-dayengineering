import { MagnifyingGlassIcon, PencilSquareIcon, TagIcon, TrashIcon } from "@heroicons/react/24/outline";
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
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <ListHeaderActions
        title="รายการประเภทสินค้า"
        icon={TagIcon}
        addLabel="เพิ่มประเภทสินค้า"
        onAdd={onAddNew}
      />

      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
          />
        </label>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-200 text-slate-500">
            <tr>
              <th className="px-3 py-2 font-medium">รหัส</th>
              <th className="px-3 py-2 font-medium">ชื่อประเภท</th>
              <th className="px-3 py-2 font-medium">กลุ่ม</th>
              <th className="px-3 py-2 font-medium">สีที่รองรับ</th>
              <th className="px-3 py-2 font-medium">สถานะ</th>
              <th className="px-3 py-2 font-medium">การจัดการ</th>
              <th className="px-3 py-2 font-medium">อัปเดตล่าสุด</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((item) => (
              <tr key={item.id} className="border-b border-slate-100">
                <td className="px-3 py-3 font-medium text-slate-700">{item.id}</td>
                <td className="px-3 py-3 text-slate-800">{item.name}</td>
                <td className="px-3 py-3">
                  <span className="rounded-full bg-blue-50 px-2 py-1 text-xs text-blue-700">
                    {item.kind}
                  </span>
                </td>
                <td className="px-3 py-3 text-slate-600">
                  {item.kind === "ประตูม้วน" ? `${item.colors.length} สี` : "-"}
                </td>
                <td className="px-3 py-3">
                  <button
                    type="button"
                    aria-pressed={item.isActive}
                    onClick={() => onToggleStatus(item.id)}
                    className={`inline-flex items-center gap-2 rounded-full border px-2 py-1 text-xs font-medium transition ${
                      item.isActive
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border-slate-200 bg-slate-100 text-slate-600"
                    }`}
                  >
                    <span
                      className={`relative h-4 w-8 rounded-full transition ${
                        item.isActive ? "bg-emerald-500" : "bg-slate-300"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 h-3 w-3 rounded-full bg-white shadow transition ${
                          item.isActive ? "left-4" : "left-0.5"
                        }`}
                      />
                    </span>
                    <span>{item.isActive ? "ใช้งานอยู่" : "ปิดใช้งาน"}</span>
                  </button>
                </td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(item.id)}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs text-slate-700 transition hover:bg-slate-50"
                    >
                      <PencilSquareIcon className="h-4 w-4" />
                      แก้ไข
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(item.id)}
                      className="inline-flex items-center gap-1 rounded-lg border border-rose-200 px-2.5 py-1.5 text-xs text-rose-600 transition hover:bg-rose-50"
                    >
                      <TrashIcon className="h-4 w-4" />
                      ลบ
                    </button>
                  </div>
                </td>
                <td className="px-3 py-3 text-slate-500">{item.updatedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
