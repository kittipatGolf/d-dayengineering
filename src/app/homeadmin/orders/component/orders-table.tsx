import { EyeIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { SearchableSelect } from "@/components/searchable-select";
import type { OrderRecord, OrderStatus } from "./types";

type OrdersTableProps = {
  rows: OrderRecord[];
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
  if (status === "สำเร็จ") return "bg-emerald-100 text-emerald-800";
  if (status === "ยกเลิก") return "bg-rose-100 text-rose-700";
  if (status === "ได้รับการยืนยัน") return "bg-blue-100 text-blue-700";
  return "bg-amber-100 text-amber-800";
}

export function OrdersTable({ rows, onOpenAddress, onOpenItems, onOpenSummary, onChangeStatus }: OrdersTableProps) {
  return (
    <div className="mt-4 overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-slate-200 bg-slate-50 text-slate-700">
          <tr>
            <th className="px-3 py-3 font-semibold">หมายเลขคำสั่งซื้อ</th>
            <th className="px-3 py-3 font-semibold">ชื่อจริง</th>
            <th className="px-3 py-3 font-semibold">นามสกุล</th>
            <th className="px-3 py-3 font-semibold">เบอร์โทรศัพท์</th>
            <th className="px-3 py-3 font-semibold">ที่อยู่</th>
            <th className="px-3 py-3 font-semibold">รายการสินค้า</th>
            <th className="px-3 py-3 font-semibold">ยอดรวมทั้งหมด</th>
            <th className="px-3 py-3 font-semibold">สถานะ</th>
            <th className="px-3 py-3 font-semibold">เปลี่ยนสถานะ</th>
            <th className="px-3 py-3 font-semibold">สรุปออเดอร์</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-slate-100">
              <td className="px-3 py-4 font-medium text-slate-800">{row.id}</td>
              <td className="px-3 py-4 text-slate-700">{row.firstName}</td>
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
              <td className="px-3 py-4">
                <span className={`inline-flex rounded-md px-2 py-1 text-xs font-semibold ${statusClassName(row.status)}`}>
                  {row.status}
                </span>
              </td>
              <td className="px-3 py-4">
                <SearchableSelect
                  options={statusOptions}
                  value={row.status}
                  onChange={(v) => onChangeStatus(row.id, v as OrderStatus)}
                  searchable={false}
                  size="sm"
                  className="min-w-36"
                />
              </td>
              <td className="px-3 py-4">
                <button
                  type="button"
                  onClick={() => onOpenSummary(row)}
                  className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200"
                >
                  ดูสรุป
                </button>
              </td>
            </tr>
          ))}
          {rows.length === 0 ? (
            <tr>
              <td colSpan={10} className="px-3 py-8 text-center text-slate-500">
                ไม่พบข้อมูลคำสั่งซื้อ
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}
