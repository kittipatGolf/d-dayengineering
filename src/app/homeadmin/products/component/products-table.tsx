import {
  InboxIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
  PhotoIcon,
  TagIcon,
} from "@heroicons/react/24/outline";
import { FilterTabs } from "../../components/admin-shared/filter-tabs";
import { ListHeaderActions } from "../../components/admin-shared/list-header-actions";
import type { ProductItem, ProductTab } from "./types";

type ProductsTableProps = {
  rows: ProductItem[];
  activeTab: ProductTab;
  onTabChange: (tab: ProductTab) => void;
  onToggleStatus: (id: string) => void;
  onEdit: (id: string) => void;
  onAddNew: () => void;
  toCurrency: (value: number) => string;
  keyword: string;
  onKeywordChange: (value: string) => void;
};

const colorMap: Record<string, string> = {
  ขาว: "#ffffff",
  ครีม: "#f5f0da",
  เทาเข้ม: "#4b5563",
  ดำ: "#111827",
  น้ำเงิน: "#1d4ed8",
  แดง: "#ef4444",
  เขียว: "#16a34a",
  เงิน: "#9ca3af",
};

function resolveColorValue(color: string) {
  const trimmed = color.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith("#") || trimmed.startsWith("rgb") || trimmed.startsWith("hsl")) {
    return trimmed;
  }
  return colorMap[trimmed] ?? "#94a3b8";
}

export function ProductsTable({
  rows,
  activeTab,
  onTabChange,
  onToggleStatus,
  onEdit,
  onAddNew,
  toCurrency,
  keyword,
  onKeywordChange,
}: ProductsTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* header */}
      <div className="border-b border-slate-100 px-5 py-4">
        <ListHeaderActions
          title="รายการสินค้า"
          icon={TagIcon}
          addLabel="เพิ่มสินค้า"
          onAdd={onAddNew}
        />
      </div>

      {/* toolbar: tabs + search */}
      <div className="flex flex-col gap-3 border-b border-slate-100 bg-slate-50/60 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
        <FilterTabs
          options={["ทั้งหมด", "ประตูม้วน", "อะไหล่ประตูม้วน"] as const}
          value={activeTab}
          onChange={onTabChange}
          className=""
        />
        <label className="relative block w-full sm:max-w-56">
          <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={keyword}
            onChange={(e) => onKeywordChange(e.target.value)}
            placeholder="ค้นหาสินค้า..."
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
              <th className="px-5 py-3 font-semibold">หมวดหมู่</th>
              <th className="px-5 py-3 font-semibold">ราคา</th>
              <th className="px-5 py-3 font-semibold">สี</th>
              <th className="px-5 py-3 font-semibold">สถานะ</th>
              <th className="px-5 py-3 font-semibold">การจัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((item) => {
              const isSelling = item.status === "วางขาย";
              return (
                <tr key={item.id} className="transition-colors hover:bg-blue-50/40">
                  {/* product cell */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100 text-slate-400 ring-1 ring-slate-200">
                        {item.images[0] ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={item.images[0]} alt={item.name} className="h-12 w-12 object-cover" />
                        ) : (
                          <PhotoIcon className="h-5 w-5" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-slate-800">{item.name}</p>
                        <p className="mt-0.5 truncate text-xs text-slate-400">{item.id}</p>
                      </div>
                    </div>
                  </td>

                  {/* category */}
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                      {item.categoryName}
                    </span>
                  </td>

                  {/* price */}
                  <td className="px-5 py-4">
                    {item.kind === "ประตูม้วน" ? (
                      <span className="inline-flex items-center rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                        ราคาตามขนาด
                      </span>
                    ) : (
                      <span className="font-semibold text-slate-900">
                        {toCurrency(item.price ?? 0)}
                        <span className="ml-0.5 text-xs font-normal text-slate-400">บาท</span>
                      </span>
                    )}
                  </td>

                  {/* colors */}
                  <td className="px-5 py-4">
                    {item.colors.length > 0 ? (
                      <div className="inline-flex items-center gap-1">
                        {item.colors.map((color) => {
                          const colorValue = resolveColorValue(color);
                          return (
                            <span
                              key={`${item.id}-${color}`}
                              title={color}
                              className="h-5 w-5 rounded-full border-2 border-white shadow-sm ring-1 ring-slate-200"
                              style={{ backgroundColor: colorValue ?? "#94a3b8" }}
                            />
                          );
                        })}
                      </div>
                    ) : (
                      <span className="text-slate-300">—</span>
                    )}
                  </td>

                  {/* status toggle */}
                  <td className="px-5 py-4">
                    <button
                      type="button"
                      aria-pressed={isSelling ? "true" : "false"}
                      onClick={() => onToggleStatus(item.id)}
                      className="inline-flex items-center gap-2.5"
                    >
                      <span
                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ${
                          isSelling ? "bg-emerald-500" : "bg-slate-300"
                        }`}
                      >
                        <span
                          className={`pointer-events-none absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm ring-1 ring-black/5 transition-transform duration-200 ${
                            isSelling ? "translate-x-4" : "translate-x-0.5"
                          }`}
                        />
                      </span>
                      <span className={`text-xs font-medium ${isSelling ? "text-emerald-700" : "text-slate-500"}`}>
                        {isSelling ? "วางขาย" : "หยุดขาย"}
                      </span>
                    </button>
                  </td>

                  {/* actions */}
                  <td className="px-5 py-4">
                    <button
                      type="button"
                      onClick={() => onEdit(item.id)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                    >
                      <PencilSquareIcon className="h-3.5 w-3.5" />
                      แก้ไข
                    </button>
                  </td>
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
            <p className="mt-4 font-medium text-slate-600">ไม่พบข้อมูลสินค้า</p>
            <p className="mt-1 text-sm text-slate-400">
              {keyword ? "ลองเปลี่ยนคำค้นหาหรือตัวกรอง" : "เริ่มต้นเพิ่มสินค้าใหม่ได้เลย"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
