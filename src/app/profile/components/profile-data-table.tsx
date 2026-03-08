import type { ReactNode } from "react";

type ProfileDataTableProps = {
  columns: string[];
  emptyText: string;
  topAction?: ReactNode;
  pagination?: boolean;
};

export function ProfileDataTable({ columns, emptyText, topAction, pagination = true }: ProfileDataTableProps) {
  return (
    <div className="mt-4">
      {topAction ? <div className="mb-4">{topAction}</div> : null}

      <div className="rounded-lg border border-slate-200 md:hidden">
        <div className="grid grid-cols-2 bg-slate-100 text-slate-700">
          {(columns.length > 2 ? columns.slice(0, 2) : columns).map((column) => (
            <div key={column} className="px-4 py-3 font-semibold">
              {column}
            </div>
          ))}
        </div>
        <div className="border-t border-slate-200 px-4 py-5 text-slate-600">{emptyText}</div>
      </div>

      <div className="hidden overflow-x-auto rounded-lg border border-slate-200 md:block">
        <table className="w-full min-w-[640px] border-collapse text-left lg:min-w-[980px]">
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
            <tr className="border-b border-slate-200">
              <td colSpan={columns.length} className="px-4 py-5 text-slate-600">
                {emptyText}
              </td>
            </tr>
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
