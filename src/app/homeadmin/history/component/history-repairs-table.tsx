import Image from "next/image";
import { InboxIcon, MapPinIcon } from "@heroicons/react/24/outline";
import type { HistoryStatus, RepairHistoryItem } from "./types";

type HistoryRepairsTableProps = {
  rows: RepairHistoryItem[];
  onOpenAddress: (item: RepairHistoryItem) => void;
};

function statusClassName(status: HistoryStatus) {
  if (status === "สำเร็จ") return "bg-emerald-50 text-emerald-700";
  return "bg-rose-50 text-rose-700";
}

export function HistoryRepairsTable({
  rows,
  onOpenAddress,
}: HistoryRepairsTableProps) {
  return (
    <div className="mt-4 overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
            <th className="px-5 py-3 font-semibold">ชื่อผู้ใช้</th>
            <th className="px-5 py-3 font-semibold">รูปภาพ</th>
            <th className="px-5 py-3 font-semibold">ประเภทการซ่อม</th>
            <th className="px-5 py-3 font-semibold">สินค้าแจ้งซ่อม</th>
            <th className="px-5 py-3 font-semibold">รายละเอียด</th>
            <th className="px-5 py-3 font-semibold">วันที่</th>
            <th className="px-5 py-3 font-semibold">ที่อยู่</th>
            <th className="px-5 py-3 font-semibold">สถานะ</th>
            <th className="px-5 py-3 font-semibold">ราคาซ่อม</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((row) => (
            <tr key={row.id} className="transition-colors hover:bg-blue-50/40">
              <td className="px-5 py-4 font-semibold text-slate-800">{row.username}</td>
              <td className="px-5 py-4">
                <div className="flex flex-wrap gap-1.5">
                  {row.images.map((image, index) => (
                    <Image
                      key={`${row.id}-${index}`}
                      src={image}
                      alt={row.repairItem}
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-lg border border-slate-200 object-cover"
                    />
                  ))}
                </div>
              </td>
              <td className="px-5 py-4 text-slate-700">{row.repairType}</td>
              <td className="px-5 py-4 text-slate-700">{row.repairItem}</td>
              <td className="px-5 py-4 text-slate-700">{row.detail}</td>
              <td className="px-5 py-4 text-slate-700">{row.repairDate}</td>
              <td className="px-5 py-4">
                <button
                  type="button"
                  onClick={() => onOpenAddress(row)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                >
                  <MapPinIcon className="h-3.5 w-3.5" />
                  ดูที่อยู่
                </button>
              </td>
              <td className="px-5 py-4">
                <span className={`inline-flex rounded-lg px-2.5 py-1 text-xs font-semibold ${statusClassName(row.status)}`}>
                  {row.status}
                </span>
              </td>
              <td className="px-5 py-4">
                <span className="font-semibold text-slate-900">
                  {new Intl.NumberFormat("th-TH").format(row.price)}
                  <span className="ml-0.5 text-xs font-normal text-slate-400">บาท</span>
                </span>
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
          <p className="mt-4 font-medium text-slate-600">ไม่พบประวัติแจ้งซ่อม</p>
          <p className="mt-1 text-sm text-slate-400">ลองเปลี่ยนตัวกรองหรือคำค้นหา</p>
        </div>
      )}
    </div>
  );
}
