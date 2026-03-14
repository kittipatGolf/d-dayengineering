import { PencilSquareIcon, PhotoIcon, TagIcon } from "@heroicons/react/24/outline";
import type { ProductItem, ProductTab } from "./types";

type ProductsTableProps = {
  rows: ProductItem[];
  activeTab: ProductTab;
  onTabChange: (tab: ProductTab) => void;
  onToggleStatus: (id: string) => void;
  onEdit: (id: string) => void;
  toCurrency: (value: number) => string;
};

export function ProductsTable({
  rows,
  activeTab,
  onTabChange,
  onToggleStatus,
  onEdit,
  toCurrency,
}: ProductsTableProps) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <TagIcon className="h-5 w-5 text-slate-500" />
          <h2 className="text-base font-semibold text-slate-900">รายการสินค้า</h2>
        </div>

        <div className="flex items-center gap-2 rounded-xl bg-slate-100 p-1 text-sm">
          {(["ทั้งหมด", "ประตูม้วน", "อะไหล่ประตูม้วน"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => onTabChange(tab)}
              className={`rounded-lg px-3 py-1.5 transition ${
                activeTab === tab
                  ? "bg-white font-semibold text-blue-900 shadow-sm"
                  : "text-slate-600"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
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
            {rows.map((item) => (
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
                <td className="px-3 py-3 font-semibold text-slate-900">{toCurrency(item.price)} บาท</td>
                <td className="px-3 py-3 text-slate-700">{item.color}</td>
                <td className="px-3 py-3">
                  <button
                    type="button"
                    onClick={() => onToggleStatus(item.id)}
                    className={`rounded-full px-2.5 py-1 text-xs font-medium transition ${
                      item.status === "วางขาย"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-rose-100 text-rose-700"
                    }`}
                  >
                    {item.status}
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
