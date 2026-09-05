import { useCallback, useContext, useMemo, useRef, useState } from "react";
import { FilterContext } from "./FilterProvider";
import type { MuralDate } from "../lib/types";
import { Tooltip } from "react-tooltip";

interface TimelineProps {
  max: number;
  baseDate: MuralDate;
}

const convertSliderValueToXCoordinate = (
  value: number,
  max: number,
  sliderWidth: number,
  sliderOffset: number,
) => {
  const sliderPosition = (value / max) * sliderWidth;

  return sliderPosition + sliderOffset;
};

export const Timeline = ({ max, baseDate }: TimelineProps) => {
  const sliderRef = useRef<HTMLInputElement>(null);
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

  const tooltipString = useMemo(() => {
    const month = new Date(2026, timelineFilter.month, 1).toLocaleString(
      "default",
      { month: "short" },
    );
    return (
      <span>
        {month} {timelineFilter.year}
      </span>
    );
  }, [timelineFilter]);

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
        ref={sliderRef}
      />
      <Tooltip
        anchorSelect="#timeline"
        content={tooltipString}
        position={{
          x: convertSliderValueToXCoordinate(
            timelineValue,
            max,
            sliderRef.current?.getBoundingClientRect().width || 0,
            sliderRef.current?.getBoundingClientRect().left || 0,
          ),
          y: sliderRef.current?.getBoundingClientRect().top || 0,
        }}
      />
    </div>
  );
};
