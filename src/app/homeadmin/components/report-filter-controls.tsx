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
  selectClassName = "rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200",
}: ReportFilterControlsProps) {
  return (
    <div className={className}>
      <label className="sr-only" htmlFor={`${idPrefix}-period`}>
        ประเภทรายงาน
      </label>
      <select
        id={`${idPrefix}-period`}
        value={period}
        onChange={(event) => onPeriodChange(event.target.value)}
        className={selectClassName}
      >
        {periodOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <label className="sr-only" htmlFor={`${idPrefix}-year`}>
        ปี
      </label>
      <select
        id={`${idPrefix}-year`}
        value={year}
        onChange={(event) => onYearChange(Number(event.target.value))}
        className={selectClassName}
      >
        {years.map((yearOption) => (
          <option key={yearOption} value={yearOption}>
            ปี {yearOption}
          </option>
        ))}
      </select>

      {showMonth && (
        <>
          <label className="sr-only" htmlFor={`${idPrefix}-month`}>
            เดือน
          </label>
          <select
            id={`${idPrefix}-month`}
            value={selectedMonth}
            onChange={(event) => onMonthChange(Number(event.target.value))}
            className={selectClassName}
          >
            {monthOptions.map((month, index) => (
              <option key={month} value={index}>
                {month}
              </option>
            ))}
          </select>
        </>
      )}
    </div>
  );
}
