import { MagnifyingGlassIcon, PencilSquareIcon, PhotoIcon, TagIcon } from "@heroicons/react/24/outline";
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
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <ListHeaderActions
        title="รายการสินค้า"
        icon={TagIcon}
        addLabel="เพิ่มสินค้า"
        onAdd={onAddNew}
      />

      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
          />
        </label>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-200 text-slate-500">
            <tr>
              <th className="px-3 py-2 font-medium">สินค้า</th>
              <th className="px-3 py-2 font-medium">หมวดหมู่</th>
              <th className="px-3 py-2 font-medium">ราคา</th>
              <th className="px-3 py-2 font-medium">สี</th>
              <th className="px-3 py-2 font-medium">สถานะ</th>
              <th className="px-3 py-2 font-medium">การจัดการ</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((item) => {
              const isSelling = item.status === "วางขาย";
              return (
              <tr key={item.id} className="border-b border-slate-100">
                <td className="px-3 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-100 text-slate-400">
                      {item.images[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.images[0]} alt={item.name} className="h-11 w-11 rounded-lg object-cover" />
                      ) : (
                        <PhotoIcon className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">{item.name}</p>
                      <p className="text-xs text-slate-500">{item.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3 text-slate-700">{item.categoryName}</td>
                <td className="px-3 py-3 font-semibold text-slate-900">
                  {item.kind === "ประตูม้วน" ? "ราคาตามขนาด" : `${toCurrency(item.price ?? 0)} บาท`}
                </td>
                <td className="px-3 py-3 text-slate-700">
                  {item.colors.length > 0 ? (
                    <div className="inline-flex items-center gap-1.5">
                      {item.colors.map((color) => {
                        const colorValue = resolveColorValue(color);
                        return (
                          <span
                            key={`${item.id}-${color}`}
                            title={color}
                            className="h-4 w-4 rounded-full border border-slate-300"
                            style={{ backgroundColor: colorValue ?? "#94a3b8" }}
                          />
                        );
                      })}
                    </div>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="px-3 py-3">
                  <button
                    type="button"
                    aria-pressed={isSelling}
                    onClick={() => onToggleStatus(item.id)}
                    className={`inline-flex items-center gap-2 rounded-full border px-2 py-1 text-xs font-medium transition ${
                      isSelling
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border-slate-200 bg-slate-100 text-slate-600"
                    }`}
                  >
                    <span
                      className={`relative h-4 w-8 rounded-full transition ${
                        isSelling ? "bg-emerald-500" : "bg-slate-300"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 h-3 w-3 rounded-full bg-white shadow transition ${
                          isSelling ? "left-4" : "left-0.5"
                        }`}
                      />
                    </span>
                    <span>{isSelling ? "วางขาย" : "ยกเลิกการขาย"}</span>
                  </button>
                </td>
                <td className="px-3 py-3">
                  <button
                    type="button"
                    onClick={() => onEdit(item.id)}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs text-slate-700 transition hover:bg-slate-50"
                  >
                    <PencilSquareIcon className="h-4 w-4" />
                    แก้ไข
                  </button>
                </td>
              </tr>
            );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
