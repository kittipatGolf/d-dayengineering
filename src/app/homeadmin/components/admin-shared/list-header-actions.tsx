import { PlusIcon } from "@heroicons/react/24/outline";
import type { ComponentType } from "react";

type ListHeaderActionsProps = {
  title: string;
  icon?: ComponentType<{ className?: string }>;
  addLabel: string;
  onAdd: () => void;
};

export function ListHeaderActions({
  title,
  icon: Icon,
  addLabel,
  onAdd,
}: ListHeaderActionsProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        {Icon ? <Icon className="h-5 w-5 text-slate-500" /> : null}
        <h2 className="text-base font-semibold text-slate-900">{title}</h2>
      </div>

      <button
        type="button"
        onClick={onAdd}
        className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-4 py-2.5 text-base font-semibold text-white transition hover:bg-blue-800"
      >
        <PlusIcon className="h-5 w-5" />
        {addLabel}
      </button>
    </div>
  );
}
