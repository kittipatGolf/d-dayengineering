"use client";

import { SearchableSelect } from "@/components/searchable-select";

type RepairSelectFieldProps = {
  id: string;
  label: string;
  placeholder: string;
  options: string[];
  value?: string;
  onSelect?: (value: string) => void;
  disabled?: boolean;
};

export function RepairSelectField({ id, label, placeholder, options, value, onSelect, disabled = false }: RepairSelectFieldProps) {
  return (
    <SearchableSelect
      id={id}
      label={label}
      placeholder={placeholder}
      options={options}
      value={value ?? ""}
      onChange={(v) => onSelect?.(v)}
      disabled={disabled}
    />
  );
}
