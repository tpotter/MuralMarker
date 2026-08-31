import { useContext } from "react";
import type { MuralEntry } from "./types";
import { FilterContext } from "../components/FilterProvider";

const SAMPLE_DATE = [6, 2025];

export const useFilters = (murals: MuralEntry[]) => {
  const { timelineFilter } = useContext(FilterContext);

  const filteredMurals = murals.filter((mural) => {
    const selectedDate = new Date(timelineFilter.year, timelineFilter.month);
    const muralStartMonth = mural.dateStart.month || 1;
    const muralStart = new Date(mural.dateStart.year, muralStartMonth - 1);

    const muralEndMonth = mural.dateEnd?.month || 1;
    const muralEnd = mural.dateEnd
      ? new Date(mural.dateEnd.year, muralEndMonth - 1)
      : undefined;

    if (
      (!muralEnd && muralStart <= selectedDate) ||
      (muralEnd && muralStart <= selectedDate && muralEnd >= selectedDate)
    ) {
      return true;
    }
    return false;
  });

  // TODO V2: Add additional, user selectable filters logic here

  return filteredMurals;
};
