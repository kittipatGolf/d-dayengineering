type FilterTabsProps<T extends string> = {
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
};

export function FilterTabs<T extends string>({
  options,
  value,
  onChange,
  className,
}: FilterTabsProps<T>) {
  return (
    <div className={className ?? "mt-3"}>
      <div className="md:hidden">
        <div className="overflow-x-auto pb-1">
          <div className="inline-flex w-max min-w-full items-center gap-1 rounded-xl bg-slate-100 p-1 text-sm">
            {options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => onChange(option)}
                className={`shrink-0 whitespace-nowrap rounded-lg px-3 py-1.5 transition ${
                  value === option
                    ? "bg-white font-semibold text-blue-900 shadow-sm"
                    : "text-slate-600"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="hidden flex-wrap items-center gap-1 rounded-xl bg-slate-100 p-1 text-sm md:flex">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`rounded-lg px-3 py-1.5 transition ${
              value === option
                ? "bg-white font-semibold text-blue-900 shadow-sm"
                : "text-slate-600"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
