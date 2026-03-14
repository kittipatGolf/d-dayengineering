import { EyeIcon, MapPinIcon } from "@heroicons/react/24/outline";
import type { HistoryStatus, ProductHistoryItem } from "./types";

type HistoryProductsTableProps = {
  rows: ProductHistoryItem[];
  onOpenAddress: (item: ProductHistoryItem) => void;
  onOpenItems: (item: ProductHistoryItem) => void;
};

function statusClassName(status: HistoryStatus) {
  if (status === "สำเร็จ") {
    return "bg-emerald-100 text-emerald-800";
  }
  return "bg-rose-100 text-rose-700";
}

export function HistoryProductsTable({
  rows,
  onOpenAddress,
  onOpenItems,
}: HistoryProductsTableProps) {
  return (
    <div className="mt-4 overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-slate-200 bg-slate-50 text-slate-700">
          <tr>
            <th className="px-3 py-3 font-semibold">ID</th>
            <th className="px-3 py-3 font-semibold">ชื่อ</th>
            <th className="px-3 py-3 font-semibold">นามสกุล</th>
            <th className="px-3 py-3 font-semibold">เบอร์โทรศัพท์</th>
            <th className="px-3 py-3 font-semibold">ที่อยู่</th>
            <th className="px-3 py-3 font-semibold">รายการสินค้า</th>
            <th className="px-3 py-3 font-semibold">ยอดรวมทั้งหมด</th>
            <th className="px-3 py-3 font-semibold">วันที่เสร็จสิ้น</th>
            <th className="px-3 py-3 font-semibold">สถานะ</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-slate-100">
              <td className="px-3 py-4 text-slate-700">{row.id.replace("PH-", "")}</td>
              <td className="px-3 py-4 font-medium text-slate-800">{row.firstName}</td>
              <td className="px-3 py-4 text-slate-700">{row.lastName}</td>
              <td className="px-3 py-4 text-slate-700">{row.phone}</td>
              <td className="px-3 py-4">
                <button
                  type="button"
                  onClick={() => onOpenAddress(row)}
                  className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
                >
                  <MapPinIcon className="h-3.5 w-3.5" />
                  ดูที่อยู่
                </button>
              </td>
              <td className="px-3 py-4">
                <button
                  type="button"
                  onClick={() => onOpenItems(row)}
                  className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
                >
                  <EyeIcon className="h-3.5 w-3.5" />
                  ดูสินค้า
                </button>
              </td>
              <td className="px-3 py-4 font-medium text-slate-800">
                {new Intl.NumberFormat("th-TH").format(row.totalAmount)} บาท
              </td>
              <td className="px-3 py-4 text-slate-700">{row.completedAt}</td>
              <td className="px-3 py-4">
                <span className={`inline-flex rounded-md px-2 py-1 text-xs font-semibold ${statusClassName(row.status)}`}>
                  {row.status}
                </span>
              </td>
            </tr>
          ))}
          {rows.length === 0 ? (
            <tr>
              <td colSpan={9} className="px-3 py-8 text-center text-slate-500">
                ไม่พบประวัติสินค้าตามเงื่อนไขที่เลือก
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}
