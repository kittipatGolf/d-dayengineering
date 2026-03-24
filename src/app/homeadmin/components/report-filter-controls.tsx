import { SearchableSelect } from "@/components/searchable-select";

type PeriodOption = {
  value: string;
  label: string;
};

type ReportFilterControlsProps = {
  idPrefix: string;
  period: string;
  year: number;
  selectedMonth: number;
  showMonth: boolean;
  periodOptions: readonly PeriodOption[];
  years: number[];
  monthOptions: readonly string[];
  onPeriodChange: (value: string) => void;
  onYearChange: (value: number) => void;
  onMonthChange: (value: number) => void;
  className?: string;
  selectClassName?: string;
};

export function ReportFilterControls({
  idPrefix,
  period,
  year,
  selectedMonth,
  showMonth,
  periodOptions,
  years,
  monthOptions,
  onPeriodChange,
  onYearChange,
  onMonthChange,
  className = "mt-4 flex flex-wrap gap-3",
}: ReportFilterControlsProps) {
  return (
    <div className={className}>
      <SearchableSelect
        id={`${idPrefix}-period`}
        options={periodOptions.map((o) => ({ value: o.value, label: o.label }))}
        value={period}
        onChange={onPeriodChange}
        searchable={false}
        size="sm"
        className="w-32"
      />

      <SearchableSelect
        id={`${idPrefix}-year`}
        options={years.map((y) => ({ value: String(y), label: `ปี ${y}` }))}
        value={String(year)}
        onChange={(v) => onYearChange(Number(v))}
        searchable={false}
        size="sm"
        className="w-32"
      />

      {showMonth && (
        <SearchableSelect
          id={`${idPrefix}-month`}
          options={monthOptions.map((m, i) => ({ value: String(i), label: m }))}
          value={String(selectedMonth)}
          onChange={(v) => onMonthChange(Number(v))}
          size="sm"
          className="w-32"
        />
      )}
    </div>
  );
}
