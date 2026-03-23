import { TrashIcon } from "@heroicons/react/24/outline";
import type { ReactNode } from "react";

const statusColors: Record<string, string> = {
  "รอการยืนยัน": "bg-amber-50 text-amber-700 border-amber-200",
  "ได้รับการยืนยัน": "bg-blue-50 text-blue-700 border-blue-200",
  "สำเร็จ": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "ยกเลิก": "bg-rose-50 text-rose-700 border-rose-200",
};

function isStatus(text: string): boolean {
  return text in statusColors;
}

type ProfileDataTableProps = {
  columns: string[];
  rows?: string[][];
  emptyText: string;
  topAction?: ReactNode;
  pagination?: boolean;
  sectionType?: "orders" | "address" | "repair";
  onDeleteAddress?: (id: string) => void;
  onRowClick?: (rowIndex: number) => void;
};

function statusBadgeClass(status: string): string | null {
  switch (status) {
    case "รอการยืนยัน": return "inline-flex rounded-lg px-2.5 py-1 text-xs font-semibold bg-amber-50 text-amber-700";
    case "ได้รับการยืนยัน": return "inline-flex rounded-lg px-2.5 py-1 text-xs font-semibold bg-blue-50 text-blue-700";
    case "สำเร็จ": return "inline-flex rounded-lg px-2.5 py-1 text-xs font-semibold bg-emerald-50 text-emerald-700";
    case "ยกเลิก": return "inline-flex rounded-lg px-2.5 py-1 text-xs font-semibold bg-rose-50 text-rose-700";
    default: return null;
  }
}

export function ProfileDataTable({
  columns,
  rows = [],
  emptyText,
  topAction,
  pagination = true,
  sectionType,
  onDeleteAddress,
  onRowClick,
}: ProfileDataTableProps) {
  const hasRows = rows.length > 0;

  return (
    <div className="mt-4">
      {topAction ? <div className="mb-4">{topAction}</div> : null}

      {/* Mobile card layout */}
      <div className="space-y-3 md:hidden">
        {hasRows ? (
          rows.map((row, rowIndex) => (
            <div key={rowIndex} className={`rounded-lg border border-slate-200 p-4${onRowClick ? " cursor-pointer hover:bg-slate-50" : ""}`} onClick={() => onRowClick?.(rowIndex)}>
              {columns.map((col, colIndex) => {
                // For address section, last column is the delete action
                if (sectionType === "address" && colIndex === columns.length - 1) {
                  return (
                    <div key={col} className="mt-2 flex justify-end">
                      <button
                        type="button"
                        onClick={() => onDeleteAddress?.(row[colIndex])}
                        className="inline-flex items-center gap-1 rounded bg-red-500 px-3 py-1.5 text-sm font-semibold text-white hover:bg-red-400"
                      >
                        <TrashIcon className="h-4 w-4" />
                        ลบ
                      </button>
                    </div>
                  );
                }

                const badge = statusBadgeClass(row[colIndex] ?? "");
                return (
                  <div key={col} className="flex items-start gap-2 py-1">
                    <span className="shrink-0 font-semibold text-slate-700">{col}:</span>
                    {badge ? (
                      <span className={badge}>{row[colIndex]}</span>
                    ) : (
                      <span className="text-slate-600">{row[colIndex] ?? "-"}</span>
                    )}
                  </div>
                );
              })}
            </div>
          ))
        ) : (
          <div className="rounded-lg border border-slate-200 px-4 py-5 text-slate-600">
            {emptyText}
          </div>
        )}
      </div>

      {/* Desktop table layout */}
      <div className="hidden overflow-x-auto rounded-lg border border-slate-200 md:block">
        <table className="w-full min-w-[800px] border-collapse text-left lg:min-w-[1100px]">
          <thead>
            <tr className="bg-slate-100 text-slate-700">
              {columns.map((column) => (
                <th key={column} className="whitespace-nowrap px-4 py-3 font-semibold">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {hasRows ? (
              rows.map((row, rowIndex) => (
                <tr key={rowIndex} className={`border-b border-slate-200 hover:bg-slate-50${onRowClick ? " cursor-pointer" : ""}`} onClick={() => onRowClick?.(rowIndex)}>
                  {row.map((cell, colIndex) => {
                    // For address section, last column is the delete action
                    if (sectionType === "address" && colIndex === columns.length - 1) {
                      return (
                        <td key={colIndex} className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => onDeleteAddress?.(cell)}
                            className="inline-flex items-center gap-1 rounded bg-red-500 px-3 py-1.5 text-sm font-semibold text-white hover:bg-red-400"
                          >
                            <TrashIcon className="h-4 w-4" />
                            ลบ
                          </button>
                        </td>
                      );
                    }

                    const badge = statusBadgeClass(cell);
                    return (
                      <td key={colIndex} className="px-4 py-3 text-slate-600">
                        {badge ? <span className={badge}>{cell}</span> : cell}
                      </td>
                    );
                  })}
                </tr>
              ))
            ) : (
              <tr className="border-b border-slate-200">
                <td colSpan={columns.length} className="px-4 py-5 text-slate-600">
                  {emptyText}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pagination ? (
        <div className="mt-5 flex items-center justify-center gap-4 text-slate-400">
          <button type="button" className="hover:text-slate-600" aria-label="first page">«</button>
          <button type="button" className="hover:text-slate-600" aria-label="previous page">‹</button>
          <button type="button" className="hover:text-slate-600" aria-label="next page">›</button>
          <button type="button" className="hover:text-slate-600" aria-label="last page">»</button>
        </div>
      ) : null}
    </div>
  );
}
