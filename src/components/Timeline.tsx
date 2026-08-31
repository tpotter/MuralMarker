import { useCallback, useContext, useState } from "react";
import { FilterContext } from "./FilterProvider";
import type { MuralDate } from "../lib/types";

interface TimelineProps {
  max: number;
  baseDate: MuralDate;
}

export const Timeline = ({ max, baseDate }: TimelineProps) => {
  const [timelineValue, setTimelineValue] = useState<number>(max);
  const { timelineFilter, setTimelineFilter } = useContext(FilterContext);

  const handleTimelineChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedValue = parseInt(e.target.value, 10);

      const bdObj = new Date(baseDate.year, baseDate.month);
      const calculatedFilterDateObj = new Date(
        bdObj.setMonth(bdObj.getMonth() + selectedValue),
      );

      setTimelineFilter({
        month: calculatedFilterDateObj.getMonth(),
        year: calculatedFilterDateObj.getFullYear(),
      });
      setTimelineValue(selectedValue);
    },
    [baseDate],
  );

  return (
    <div className="absolute z-[1100] bottom-24 left-1/2 -translate-x-1/2 w-4/5">
      <input
        type="range"
        id="timeline"
        min={0}
        max={max}
        step={1}
        className="w-full"
        value={timelineValue}
        onChange={handleTimelineChange}
      />
    </div>
  );
};
