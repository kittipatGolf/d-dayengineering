"use client";

import { ChevronDownIcon, MagnifyingGlassIcon, CheckIcon } from "@heroicons/react/24/outline";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

export type SelectOption = {
  value: string;
  label: string;
};

type SearchableSelectProps = {
  id?: string;
  label?: string;
  placeholder?: string;
  options: SelectOption[] | string[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  searchable?: boolean;
  size?: "sm" | "md";
  className?: string;
};

function normalizeOptions(options: SelectOption[] | string[]): SelectOption[] {
  if (options.length === 0) return [];
  if (typeof options[0] === "string") {
    return (options as string[]).map((o) => ({ value: o, label: o }));
  }
  return options as SelectOption[];
}

export function SearchableSelect({
  id,
  label,
  placeholder = "เลือก...",
  options: rawOptions,
  value,
  onChange,
  disabled = false,
  searchable = true,
  size = "md",
  className = "",
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});

  const options = useMemo(() => normalizeOptions(rawOptions), [rawOptions]);

  const filtered = useMemo(() => {
    if (!query.trim()) return options;
    const q = query.trim().toLowerCase();
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, query]);

  const selectedLabel = useMemo(() => {
    const found = options.find((o) => o.value === value);
    return found?.label ?? "";
  }, [options, value]);

  // Position the dropdown relative to the trigger button
  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const dropUp = spaceBelow < 250 && rect.top > spaceBelow;

    setDropdownStyle({
      position: "fixed",
      left: rect.left,
      width: rect.width,
      ...(dropUp
        ? { bottom: window.innerHeight - rect.top + 6 }
        : { top: rect.bottom + 6 }),
      zIndex: 9999,
    });
  }, []);

  useLayoutEffect(() => {
    if (isOpen) updatePosition();
  }, [isOpen, updatePosition]);

  // Reposition on scroll/resize
  useEffect(() => {
    if (!isOpen) return;
    const onReposition = () => updatePosition();
    window.addEventListener("scroll", onReposition, true);
    window.addEventListener("resize", onReposition);
    return () => {
      window.removeEventListener("scroll", onReposition, true);
      window.removeEventListener("resize", onReposition);
    };
  }, [isOpen, updatePosition]);

  // Click outside handler — checks both root and portal dropdown
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (rootRef.current?.contains(target)) return;
      if (dropdownRef.current?.contains(target)) return;
      setIsOpen(false);
      setQuery("");
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && searchable && searchRef.current) {
      searchRef.current.focus();
    }
  }, [isOpen, searchable]);

  const handleSelect = (opt: SelectOption) => {
    onChange(opt.value);
    setIsOpen(false);
    setQuery("");
  };

  const toggleOpen = () => {
    if (disabled) return;
    setIsOpen((prev) => !prev);
    setQuery("");
  };

  const sizeClasses = size === "sm"
    ? "px-3 py-2 text-xs"
    : "px-4 py-2.5 text-sm";

  const dropdownSizeClasses = size === "sm"
    ? "text-xs"
    : "text-sm";

  const dropdownContent = isOpen ? (
    <div
      ref={dropdownRef}
      style={dropdownStyle}
      className={`overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg ${dropdownSizeClasses}`}
    >
      {/* Search input */}
      {searchable && options.length > 4 && (
        <div className="border-b border-slate-100 p-2">
          <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2">
            <MagnifyingGlassIcon className="h-4 w-4 shrink-0 text-slate-400" />
            <input
              ref={searchRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ค้นหา..."
              className="w-full bg-transparent text-slate-700 placeholder:text-slate-400 focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* Options list */}
      <ul
        ref={listRef}
        className="max-h-56 overflow-y-auto overscroll-contain py-1"
      >
        {filtered.length === 0 ? (
          <li className="px-4 py-3 text-center text-slate-400">
            ไม่พบรายการที่ค้นหา
          </li>
        ) : (
          filtered.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <li
                key={opt.value}
                className={`flex cursor-pointer items-center gap-2 px-4 py-2.5 transition ${
                  isSelected
                    ? "bg-blue-50 font-medium text-blue-700"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSelect(opt);
                }}
              >
                <span className="flex-1 truncate">{opt.label}</span>
                {isSelected && (
                  <CheckIcon className="h-4 w-4 shrink-0 text-blue-600" />
                )}
              </li>
            );
          })
        )}
      </ul>
    </div>
  ) : null;

  return (
    <div className={`relative ${className}`} ref={rootRef}>
      {label && (
        <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}

      {/* Trigger button */}
      <button
        id={id}
        ref={triggerRef}
        type="button"
        disabled={disabled}
        onClick={toggleOpen}
        className={`flex w-full items-center justify-between rounded-xl border bg-slate-50 transition ${sizeClasses} ${
          disabled
            ? "cursor-not-allowed border-slate-200 text-slate-400"
            : isOpen
              ? "border-blue-500 bg-white ring-2 ring-blue-500/20"
              : "border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-white"
        }`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className={selectedLabel ? "truncate text-slate-800" : "truncate text-slate-400"}>
          {selectedLabel || placeholder}
        </span>
        <ChevronDownIcon
          className={`ml-2 h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Portal dropdown to avoid overflow clipping */}
      {typeof document !== "undefined" && dropdownContent
        ? createPortal(dropdownContent, document.body)
        : dropdownContent}
    </div>
  );
}
