import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/outline";

type PortfolioToolbarProps = {
  query: string;
  onQueryChange: (query: string) => void;
  onAdd: () => void;
};

export function PortfolioToolbar({ query, onQueryChange, onAdd }: PortfolioToolbarProps) {
  return (
    <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
      <div className="relative w-full max-w-xs">
        <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
        <input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="ค้นหาผลงาน"
          className="w-full rounded-xl border border-slate-200 py-2 pl-10 pr-3 text-sm outline-none ring-blue-200 transition focus:ring"
        />
      </div>

      <button
        type="button"
        onClick={onAdd}
        className="inline-flex items-center gap-1.5 rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800"
      >
        <PlusIcon className="h-4 w-4" />
        เพิ่มผลงานใหม่
      </button>
    </div>
  );
}
