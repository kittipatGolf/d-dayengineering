import Image from "next/image";
import {
  InboxIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  PencilSquareIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";
import { FilterTabs } from "../../components/admin-shared/filter-tabs";
import { SearchableSelect } from "@/components/searchable-select";
import type { RepairRequestItem, RepairRequestStatus } from "./types";

type PartOption = { id: string; name: string; price: number | null };

type ActiveTab = "ทั้งหมด" | "รอการยืนยัน" | "ได้รับการยืนยัน";

type RepairRequestsTableProps = {
  rows: RepairRequestItem[];
  parts: PartOption[];
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  keyword: string;
  onKeywordChange: (value: string) => void;
  onOpenAddress: (item: RepairRequestItem) => void;
  onChangeStatus: (id: string, status: RepairRequestStatus) => void;
  onSelectPart: (id: string, partName: string) => void;
  onEditInitialPrice: () => void;
};

const statusOptions = [
  { value: "รอการยืนยัน", label: "รอการยืนยัน" },
  { value: "ได้รับการยืนยัน", label: "ได้รับการยืนยัน" },
  { value: "สำเร็จ", label: "สำเร็จ" },
  { value: "ยกเลิก", label: "ยกเลิก" },
];

function statusClassName(status: RepairRequestStatus) {
  if (status === "สำเร็จ") return "bg-emerald-50 text-emerald-700";
  if (status === "ยกเลิก") return "bg-rose-50 text-rose-700";
  if (status === "ได้รับการยืนยัน") return "bg-blue-50 text-blue-700";
  return "bg-amber-50 text-amber-700";
}

export function RepairRequestsTable({
  rows,
  parts,
  activeTab,
  onTabChange,
  keyword,
  onKeywordChange,
  onOpenAddress,
  onChangeStatus,
  onSelectPart,
  onEditInitialPrice,
}: RepairRequestsTableProps) {
  const partOptions = [
    { value: "", label: "-- เลือกอะไหล่ --" },
    ...parts.map((p) => ({
      value: p.name,
      label: p.price != null ? `${p.name} (฿${p.price.toLocaleString()})` : p.name,
    })),
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* header */}
      <div className="border-b border-slate-100 px-5 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <WrenchScrewdriverIcon className="h-5 w-5 text-slate-400" />
            <h2 className="text-base font-bold text-slate-900">รายการแจ้งซ่อม</h2>
          </div>
          <button
            type="button"
            onClick={onEditInitialPrice}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition hover:bg-blue-700 active:scale-[0.98]"
          >
            <PencilSquareIcon className="h-5 w-5" />
            แก้ไขราคาซ่อมเริ่มต้น
          </button>
        </div>
      </div>

      {/* toolbar: tabs + search */}
      <div className="flex flex-col gap-3 border-b border-slate-100 bg-slate-50/60 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
        <FilterTabs
          options={["ทั้งหมด", "รอการยืนยัน", "ได้รับการยืนยัน"] as const}
          value={activeTab}
          onChange={onTabChange}
          className=""
        />
        <label className="relative block w-full sm:max-w-56">
          <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={keyword}
            onChange={(e) => onKeywordChange(e.target.value)}
            placeholder="ค้นหาแจ้งซ่อม..."
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
        </label>
      </div>

      {/* table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
              <th className="px-5 py-3 font-semibold">ผู้ใช้</th>
              <th className="px-5 py-3 font-semibold">สินค้าแจ้งซ่อม</th>
              <th className="px-5 py-3 font-semibold">รายละเอียด</th>
              <th className="px-5 py-3 font-semibold">วันที่</th>
              <th className="px-5 py-3 font-semibold">ที่อยู่</th>
              <th className="px-5 py-3 font-semibold">รูปภาพ</th>
              <th className="px-5 py-3 font-semibold">อะไหล่</th>
              <th className="px-5 py-3 font-semibold">ราคาซ่อม</th>
              <th className="px-5 py-3 font-semibold">รับประกัน</th>
              <th className="px-5 py-3 font-semibold">สถานะ</th>
              <th className="px-5 py-3 font-semibold">เปลี่ยนสถานะ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row) => {
              const rowPartOptions = row.selectedPart && !parts.some((p) => p.name === row.selectedPart)
                ? [...partOptions, { value: row.selectedPart, label: row.selectedPart }]
                : partOptions;

              return (
                <tr key={row.id} className="transition-colors hover:bg-blue-50/40">
                  <td className="px-5 py-4">
                    <div>
                      <p className="font-semibold text-slate-800">
                        {row.user ? `${row.user.firstName} ${row.user.lastName}` : row.username}
                      </p>
                      {row.user?.phone && (
                        <p className="mt-0.5 text-xs text-slate-500">{row.user.phone}</p>
                      )}
                    </div>
                  </td>
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
                  <td className="px-5 py-4">
                    <SearchableSelect
                      options={rowPartOptions}
                      value={row.selectedPart}
                      onChange={(v) => onSelectPart(row.id, v)}
                      size="sm"
                      className="min-w-40"
                    />
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-semibold text-slate-900">
                      {new Intl.NumberFormat("th-TH").format(row.repairPrice)}
                      <span className="ml-0.5 text-xs font-normal text-slate-400">บาท</span>
                    </span>
                  </td>
                  <td className="px-5 py-4 text-slate-700">{row.warranty}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex rounded-lg px-2.5 py-1 text-xs font-semibold ${statusClassName(row.status)}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <SearchableSelect
                      options={statusOptions}
                      value={row.status}
                      onChange={(v) => onChangeStatus(row.id, v as RepairRequestStatus)}
                      searchable={false}
                      size="sm"
                      className="min-w-36"
                    />
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
            <p className="mt-4 font-medium text-slate-600">ไม่มีรายการแจ้งซ่อม</p>
            <p className="mt-1 text-sm text-slate-400">
              {keyword ? "ลองเปลี่ยนคำค้นหาหรือตัวกรอง" : "ยังไม่มีคำขอแจ้งซ่อม"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
