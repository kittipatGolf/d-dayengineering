"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronDownIcon, MagnifyingGlassIcon, CheckIcon } from "@heroicons/react/24/outline";
import {
  allProvinces,
  getAmphoes,
  getTambons,
  getZipcode,
} from "@/lib/thai-address";

export type ThaiAddressValue = {
  province: string;
  district: string; // amphoe/อำเภอ
  subdistrict: string; // tambon/ตำบล
  postalCode: string;
};

type ThaiAddressInputProps = {
  value: ThaiAddressValue;
  onChange: (value: ThaiAddressValue) => void;
  inputClassName?: string;
  labelClassName?: string;
};

function FilterableSelect({
  id,
  label,
  placeholder,
  options,
  value,
  onSelect,
  labelClassName,
  disabled = false,
}: {
  id: string;
  label: string;
  placeholder: string;
  options: string[];
  value: string;
  onSelect: (v: string) => void;
  inputClassName?: string;
  labelClassName?: string;
  disabled?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync query with external value changes
  useEffect(() => {
    setQuery(value);
  }, [value]);

  const filtered = useMemo(() => {
    const q = query.trim();
    if (!q || q === value) return options;
    return options.filter((opt) => opt.includes(q));
  }, [query, options, value]);

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
      setOpen(false);
      // Reset query to value if user didn't select
      if (query !== value) setQuery(value);
    }
  }, [query, value]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClickOutside]);

  return (
    <div ref={wrapperRef} className="relative">
      <label htmlFor={id} className={labelClassName}>
        {label}
      </label>
      <div className="relative">
        <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2">
          <MagnifyingGlassIcon className="h-4 w-4 text-slate-400" />
        </div>
        <input
          ref={inputRef}
          id={id}
          type="text"
          autoComplete="off"
          placeholder={placeholder}
          value={query}
          disabled={disabled}
          onChange={(e) => {
            if (disabled) return;
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => { if (!disabled) setOpen(true); }}
          className={`w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-10 text-sm text-slate-700 placeholder:text-slate-400 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${disabled ? "cursor-not-allowed bg-slate-100! text-slate-400!" : ""}`}
        />
        <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2">
          <ChevronDownIcon className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
        </div>
      </div>
      {open && filtered.length > 0 && (
        <div className="absolute z-50 mt-1.5 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
          <ul className="max-h-56 overflow-y-auto overscroll-contain py-1 text-sm">
            {filtered.slice(0, 50).map((opt) => {
              const isSelected = opt === value;
              return (
                <li
                  key={opt}
                  className={`flex cursor-pointer items-center gap-2 px-4 py-2.5 transition ${
                    isSelected
                      ? "bg-blue-50 font-medium text-blue-700"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    onSelect(opt);
                    setQuery(opt);
                    setOpen(false);
                  }}
                >
                  <span className="flex-1 truncate">{opt}</span>
                  {isSelected && (
                    <CheckIcon className="h-4 w-4 shrink-0 text-blue-600" />
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

export function ThaiAddressInput({
  value,
  onChange,
  inputClassName: _inputClassName,
  labelClassName = "mb-1.5 block text-sm font-medium text-slate-700",
}: ThaiAddressInputProps) {
  const amphoeOptions = useMemo(
    () => (value.province ? getAmphoes(value.province) : []),
    [value.province],
  );

  const tambonOptions = useMemo(
    () =>
      value.province && value.district
        ? getTambons(value.province, value.district)
        : [],
    [value.province, value.district],
  );

  const handleProvinceSelect = (province: string) => {
    onChange({ province, district: "", subdistrict: "", postalCode: "" });
  };

  const handleDistrictSelect = (district: string) => {
    onChange({ ...value, district, subdistrict: "", postalCode: "" });
  };

  const handleSubdistrictSelect = (subdistrict: string) => {
    const zip = getZipcode(value.province, value.district, subdistrict);
    onChange({ ...value, subdistrict, postalCode: zip });
  };

  return (
    <>
      <FilterableSelect
        id="thai-province"
        label="* จังหวัด"
        placeholder="พิมพ์เพื่อค้นหาจังหวัด"
        options={allProvinces}
        value={value.province}
        onSelect={handleProvinceSelect}
        labelClassName={labelClassName}
      />
      <FilterableSelect
        id="thai-district"
        label="* เขต/อำเภอ"
        placeholder={value.province ? "พิมพ์เพื่อค้นหาเขต/อำเภอ" : "เลือกจังหวัดก่อน"}
        options={amphoeOptions}
        value={value.district}
        onSelect={handleDistrictSelect}
        labelClassName={labelClassName}
        disabled={!value.province}
      />
      <FilterableSelect
        id="thai-subdistrict"
        label="* ตำบล/แขวง"
        placeholder={value.district ? "พิมพ์เพื่อค้นหาตำบล/แขวง" : "เลือกเขต/อำเภอก่อน"}
        options={tambonOptions}
        value={value.subdistrict}
        onSelect={handleSubdistrictSelect}
        labelClassName={labelClassName}
        disabled={!value.district}
      />
      <div>
        <label htmlFor="thai-postalCode" className={labelClassName}>
          * รหัสไปรษณีย์
        </label>
        <input
          id="thai-postalCode"
          type="text"
          readOnly
          disabled={!value.subdistrict}
          value={value.postalCode}
          placeholder="เลือกตำบลเพื่อกรอกอัตโนมัติ"
          className={`w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${!value.subdistrict ? "cursor-not-allowed bg-slate-100! text-slate-400!" : ""}`}
        />
      </div>
    </>
  );
}
