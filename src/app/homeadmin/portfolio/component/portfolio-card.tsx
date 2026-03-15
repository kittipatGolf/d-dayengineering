import { MagnifyingGlassIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import type { PortfolioItem } from "./types";

type PortfolioCardProps = {
  item: PortfolioItem;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

export function PortfolioCard({ item, onEdit, onDelete }: PortfolioCardProps) {
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="relative aspect-[4/3] w-full bg-slate-100">
        {item.images?.[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.images[0]} alt={item.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-400">
            <MagnifyingGlassIcon className="h-7 w-7" />
          </div>
        )}
      </div>

      <div className="space-y-2 p-4">
        <h3 className="line-clamp-1 text-lg font-semibold text-slate-900">{item.title}</h3>
        <p className="line-clamp-2 text-sm text-slate-500">{item.description}</p>

        <div className="pt-2">
          <div className="inline-flex items-center gap-1">
            <button
              type="button"
              onClick={() => onEdit(item.id)}
              className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-50"
              aria-label="แก้ไขผลงาน"
            >
              <PencilSquareIcon className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(item.id)}
              className="rounded-lg p-2 text-rose-600 transition hover:bg-rose-50"
              aria-label="ลบผลงาน"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
