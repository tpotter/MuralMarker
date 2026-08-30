import { createContext, useMemo, useState } from "react";

const currentMonth = new Date().getMonth();
const currentYear = new Date().getFullYear();

const noop = () => {};

interface FilterValue {
  timelineFilter: number[];
  setTimelineFilter: React.Dispatch<React.SetStateAction<number[]>>;
}

const initialValue = {
  timelineFilter: [0, 0],
  setTimelineFilter: noop,
};

export const FilterContext = createContext<FilterValue>(initialValue);

export const FilterProvider = ({ children }: { children: React.ReactNode }) => {
  // Default value for the timeline is the current month and year
  const [timelineFilter, setTimelineFilter] = useState<number[]>([
    currentMonth,
    currentYear,
  ]);

  const value = useMemo(
    () => ({
      timelineFilter,
      setTimelineFilter,
    }),
    [],
  );

  return (
    <FilterContext.Provider value={value}>{children}</FilterContext.Provider>
  );
};
