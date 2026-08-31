import { createContext, useMemo, useState } from "react";
import type { MuralDate } from "../lib/types";

const currentMonth = new Date().getMonth();
const currentYear = new Date().getFullYear();

const noop = () => {};

interface FilterValue {
  timelineFilter: MuralDate;
  setTimelineFilter: React.Dispatch<React.SetStateAction<MuralDate>>;
}

const initialValue = {
  timelineFilter: { month: 0, year: 0 },
  setTimelineFilter: noop,
};

export const FilterContext = createContext<FilterValue>(initialValue);

export const FilterProvider = ({ children }: { children: React.ReactNode }) => {
  // Default value for the timeline is the current month and year
  const [timelineFilter, setTimelineFilter] = useState<MuralDate>({
    month: currentMonth,
    year: currentYear,
  });

  const value = useMemo(
    () => ({
      timelineFilter,
      setTimelineFilter,
    }),
    [timelineFilter],
  );

  return (
    <FilterContext.Provider value={value}>{children}</FilterContext.Provider>
  );
};
