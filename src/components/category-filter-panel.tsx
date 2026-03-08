type CategoryFilterPanelProps = {
  title: string;
  items: string[];
  activeItem?: string;
  className?: string;
};

export function CategoryFilterPanel({
  title,
  items,
  activeItem,
  className = "",
}: CategoryFilterPanelProps) {
  return (
    <div className={`rounded-xl border border-slate-200 p-5 ${className}`}>
      <h2 className="mb-4 text-2xl font-bold text-slate-900">{title}</h2>
      <ul className="space-y-3 text-lg">
        {items.map((item) => {
          const isActive = activeItem ? activeItem === item : false;
          return (
            <li key={item}>
              <button
                type="button"
                className={isActive ? "font-semibold text-blue-700" : "text-slate-700 hover:text-blue-700"}
              >
                {item}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
