import { useContext } from "react";
import { FilterContext } from "./FilterProvider";

export const DateDisplay = () => {
  const { timelineFilter } = useContext(FilterContext);

  const month = new Date(2026, timelineFilter.month, 1).toLocaleString(
    "default",
    { month: "short" },
  );

  return (
    <div className="absolute left-4 top-4 z-[1000]">
      <h3>Display Date:</h3>
      <h3 className="text-2xl">
        {month} {timelineFilter.year}
      </h3>
    </div>
  );
};
