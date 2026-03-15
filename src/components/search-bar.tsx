import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

type SearchBarProps = {
  placeholder?: string;
  className?: string;
  name?: string;
  value?: string;
  onChange?: (value: string) => void;
};

export function SearchBar({
  placeholder = "ค้นหา",
  className = "",
  name = "q",
  value,
  onChange,
}: SearchBarProps) {
  return (
    <form
      role="search"
      onSubmit={(e) => e.preventDefault()}
      className={`mx-auto flex w-full max-w-md items-center rounded-full border border-slate-300 bg-white px-4 py-2 shadow-sm ${className}`}
    >
      <input
        type="search"
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        className="w-full border-none bg-transparent text-slate-700 outline-none placeholder:text-slate-400"
      />
      <button
        type="submit"
        aria-label="ค้นหา"
        className="ml-2 inline-flex h-10 w-10 min-h-10 min-w-10 items-center justify-center rounded-full bg-blue-600 text-white"
      >
        <MagnifyingGlassIcon className="h-5 w-5" />
      </button>
    </form>
  );
}
