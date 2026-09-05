import { useContext } from "react";
import { FilterContext } from "./FilterProvider";
import { getMonthLabel } from "../lib/utils";

export const DateDisplay = () => {
  const { timelineFilter } = useContext(FilterContext);

  const month = getMonthLabel(timelineFilter.month);

  return (
    <div className="absolute left-4 top-4 z-[1000] bg-neutral-100 p-2 rounded-xl">
      <h3>Display Date:</h3>
      <h3 className="text-2xl">
        {month} {timelineFilter.year}
      </h3>
    </div>
  );
};
