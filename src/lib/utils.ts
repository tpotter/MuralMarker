export const getMonthLabel = (month: number) => {
  return new Date(2026, month, 1).toLocaleString("default", { month: "short" });
};
