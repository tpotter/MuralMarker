import type { MuralEntry } from "./types";

/**
 *
 * @param murals
 *
 * Hook takes in a list of murals and returns props used to populate values for the range input.
 * Determines the earliest entry (min value) and calculates the number of months between then and now (max value).  
 */
export const useMuralRange = (murals: MuralEntry[]) => {
  // This should never happen
  if (!murals || murals.length === 0) {
    return {
      baseMonth: { month: 0, year: 0 },
      totalMonths: 0,
    };
  }

  const now = new Date();

  const earliestMural = murals.reduce((prev, curr) => {
    const prevStart = new Date(prev.dateStart.year, prev.dateStart.month || 1);
    const currStart = new Date(curr.dateStart.year, curr.dateStart.month || 1);

    return prevStart < currStart ? prev : curr;
  });

  const earliestMonth = (earliestMural.dateStart.month || 1) - 1;
  const earliestYear = earliestMural.dateStart.year;

  const earliestDate = new Date(earliestYear, earliestMonth);

  const totalMonths =
    (now.getFullYear() - earliestDate.getFullYear()) * 12 +
    (now.getMonth() - earliestDate.getMonth());

  return {
    baseMonth: { month: earliestMonth, year: earliestYear },
    totalMonths,
  };
};
