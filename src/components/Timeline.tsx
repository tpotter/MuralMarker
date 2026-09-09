import { useCallback, useContext, useMemo, useRef, useState } from "react";
import { FilterContext } from "./FilterProvider";
import type { MuralDate } from "../lib/types";
import { Tooltip } from "react-tooltip";
import { getMonthLabel } from "../lib/utils";

const THUMB_WIDTH = 16;

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
  const sliderPosition =
    (value / max) * (sliderWidth - THUMB_WIDTH) + THUMB_WIDTH / 2;
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
    const month = getMonthLabel(timelineFilter.month);
    return (
      <span>
        {month} {timelineFilter.year}
      </span>
    );
  }, [timelineFilter]);

  return (
    <div className="absolute z-[1100] bottom-30 left-1/2 -translate-x-1/2 w-4/5 lg:w-1/2">
      <input
        type="range"
        id="timeline"
        min={0}
        max={max}
        step={1}
        className="w-full [&::-webkit-slider-thumb]:w-4 [&::-moz-range-thumb]:w-4"
        value={timelineValue}
        onChange={handleTimelineChange}
        ref={sliderRef}
      />
      <Tooltip
        anchorSelect="#timeline"
        content={tooltipString}
        openEvents={{ focus: true }}
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
