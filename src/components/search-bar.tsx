import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

type SearchBarProps = {
  placeholder?: string;
  className?: string;
  name?: string;
};

export function SearchBar({
  placeholder = "ค้นหา",
  className = "",
  name = "q",
}: SearchBarProps) {
  return (
    <form
      role="search"
      className={`mx-auto flex w-full max-w-md items-center rounded-full border border-slate-300 bg-white px-4 py-2 shadow-sm ${className}`}
    >
      <input
        type="search"
        name={name}
        placeholder={placeholder}
        className="w-full border-none bg-transparent text-slate-700 outline-none placeholder:text-slate-400"
      />
      <button
        type="submit"
        aria-label="ค้นหา"
        className="ml-2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white"
      >
        <MagnifyingGlassIcon className="h-5 w-5" />
      </button>
    </form>
  );
}
