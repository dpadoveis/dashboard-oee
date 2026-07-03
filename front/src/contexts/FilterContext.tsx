import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

interface FilterContextType {
  startDate: string;
  endDate: string;
  setStartDate: (d: string) => void;
  setEndDate: (d: string) => void;
  applied: { startDate: string; endDate: string };
  apply: () => void;
}

const FilterContext = createContext<FilterContextType | null>(null);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [startDate, setStartDate] = useState("2026-04-05");
  const [endDate, setEndDate] = useState("2026-04-11");
  const [applied, setApplied] = useState({
    startDate: "2026-04-05",
    endDate: "2026-04-11",
  });

  function apply() {
    setApplied({ startDate, endDate });
  }

  return (
    <FilterContext.Provider
      value={{ startDate, endDate, setStartDate, setEndDate, applied, apply }}
    >
      {children}
    </FilterContext.Provider>
  );
}

export function useFilter() {
  const ctx = useContext(FilterContext);
  if (!ctx) throw new Error("useFilter fora do FilterProvider");
  return ctx;
}
