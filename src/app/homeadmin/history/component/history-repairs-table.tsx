import Image from "next/image";
import { MapPinIcon } from "@heroicons/react/24/outline";
import type { HistoryStatus, RepairHistoryItem } from "./types";

type HistoryRepairsTableProps = {
  rows: RepairHistoryItem[];
  onOpenAddress: (item: RepairHistoryItem) => void;
};

function statusClassName(status: HistoryStatus) {
  if (status === "สำเร็จ") {
    return "bg-emerald-100 text-emerald-800";
  }
  return "bg-rose-100 text-rose-700";
}

export function HistoryRepairsTable({
  rows,
  onOpenAddress,
}: HistoryRepairsTableProps) {
  return (
    <div className="mt-4 overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-slate-200 bg-slate-50 text-slate-700">
          <tr>
            <th className="px-3 py-3 font-semibold">ชื่อผู้ใช้</th>
            <th className="px-3 py-3 font-semibold">รูปภาพ</th>
            <th className="px-3 py-3 font-semibold">ประเภทการซ่อม</th>
            <th className="px-3 py-3 font-semibold">สินค้าแจ้งซ่อม</th>
            <th className="px-3 py-3 font-semibold">รายละเอียด</th>
            <th className="px-3 py-3 font-semibold">วันที่แจ้งซ่อม</th>
            <th className="px-3 py-3 font-semibold">ที่อยู่</th>
            <th className="px-3 py-3 font-semibold">สถานะ</th>
            <th className="px-3 py-3 font-semibold">ราคาซ่อม</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-slate-100">
              <td className="px-3 py-4 font-medium text-slate-800">{row.username}</td>
              <td className="px-3 py-4">
                <div className="flex flex-wrap gap-1.5">
                  {row.images.map((image, index) => (
                    <Image
                      key={`${row.id}-${index}`}
                      src={image}
                      alt={row.repairItem}
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-md border border-slate-200 object-cover"
                    />
                  ))}
                </div>
              </td>
              <td className="px-3 py-4 text-slate-700">{row.repairType}</td>
              <td className="px-3 py-4 text-slate-700">{row.repairItem}</td>
              <td className="px-3 py-4 text-slate-700">{row.detail}</td>
              <td className="px-3 py-4 text-slate-700">{row.repairDate}</td>
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
                <span className={`inline-flex rounded-md px-2 py-1 text-xs font-semibold ${statusClassName(row.status)}`}>
                  {row.status}
                </span>
              </td>
              <td className="px-3 py-4 font-medium text-slate-800">
                {new Intl.NumberFormat("th-TH").format(row.price)} บาท
              </td>
            </tr>
          ))}
          {rows.length === 0 ? (
            <tr>
              <td colSpan={9} className="px-3 py-8 text-center text-slate-500">
                ไม่พบประวัติแจ้งซ่อมตามเงื่อนไขที่เลือก
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}
