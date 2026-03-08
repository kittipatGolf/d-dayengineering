"use client";

import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";

type RepairSelectFieldProps = {
  id: string;
  label: string;
  placeholder: string;
  options: string[];
};

export function RepairSelectField({ id, label, placeholder, options }: RepairSelectFieldProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string>("");
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="space-y-2" ref={rootRef}>
      <label htmlFor={id} className="font-medium text-slate-700">
        {label}
      </label>

      <div className="relative">
        <button
          id={id}
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex w-full items-center justify-between rounded-md border border-slate-300 bg-white px-4 py-3 text-left text-slate-700 transition hover:border-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span className={selected ? "text-slate-700" : "text-slate-400"}>{selected || placeholder}</span>
          <ChevronDownIcon
            className={`h-5 w-5 text-slate-400 transition-transform ${isOpen ? "rotate-180" : "rotate-0"}`}
          />
        </button>

        {isOpen ? (
          <ul
            role="listbox"
            className="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-md border border-slate-200 bg-white py-1 shadow-lg"
          >
            {options.map((option) => (
              <li key={option}>
                <button
                  type="button"
                  className="block w-full px-4 py-2 text-left text-slate-700 transition hover:bg-sky-50 hover:text-sky-700"
                  onClick={() => {
                    setSelected(option);
                    setIsOpen(false);
                  }}
                >
                  {option}
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
