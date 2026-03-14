import { TagIcon } from "@heroicons/react/24/outline";
import type { CategoryKind, ProductCategory } from "./types";

type ProductCategoriesTableProps = {
  rows: ProductCategory[];
  activeTab: "ทั้งหมด" | CategoryKind;
  onTabChange: (tab: "ทั้งหมด" | CategoryKind) => void;
  onToggleStatus: (id: string) => void;
};

export function ProductCategoriesTable({
  rows,
  activeTab,
  onTabChange,
  onToggleStatus,
}: ProductCategoriesTableProps) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <TagIcon className="h-5 w-5 text-slate-500" />
          <h2 className="text-base font-semibold text-slate-900">รายการประเภทสินค้า</h2>
        </div>

        <div className="flex items-center gap-2 rounded-xl bg-slate-100 p-1 text-sm">
          {(["ทั้งหมด", "ประตูม้วน", "อะไหล่"] as const).map((tab) => (
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
              <th className="px-3 py-2 font-medium">รหัส</th>
              <th className="px-3 py-2 font-medium">ชื่อประเภท</th>
              <th className="px-3 py-2 font-medium">กลุ่ม</th>
              <th className="px-3 py-2 font-medium">สีที่รองรับ</th>
              <th className="px-3 py-2 font-medium">สถานะ</th>
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
                <td className="px-3 py-3 text-slate-500">{item.updatedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
