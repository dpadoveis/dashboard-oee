import { useFilter } from "../../features/filters/FilterContext";

interface DateFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
}

function DateField({ label, value, onChange }: DateFieldProps) {
  return (
    <div className="date-field">
      <div className="l">{label}</div>
      <div className="v">
        <input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            background: "transparent",
            border: "none",
            color: "var(--paper)",
            fontSize: "13px",
            fontFamily: "inherit",
            cursor: "pointer",
            width: "100%",
          }}
        />
      </div>
    </div>
  );
}

export function PeriodFilter() {
  const { startDate, endDate, setStartDate, setEndDate } = useFilter();

  return (
    <div className="date-block">
      <DateField
        label="Data início"
        value={startDate}
        onChange={setStartDate}
      />
      <DateField label="Data final" value={endDate} onChange={setEndDate} />
    </div>
  );
}
