import { describe, expect, it } from "vitest";
import { renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { useFilters } from "./useFilters";
import { FilterContext } from "../components/FilterProvider";
import type { MuralDate, MuralEntry } from "./types";

// Wraps renderHook with a FilterContext supplying an arbitrary timeline value,
// independent of FilterProvider's own state wiring.
const withTimeline = (timelineFilter: MuralDate) => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <FilterContext.Provider
      value={{ timelineFilter, setTimelineFilter: () => {} }}
    >
      {children}
    </FilterContext.Provider>
  );
  return wrapper;
};

let idCounter = 0;
const makeMural = (overrides: Partial<MuralEntry> = {}): MuralEntry => ({
  id: `mural-${idCounter++}`,
  artists: [{ name: "Test Artist" }],
  description: "A test mural",
  location: { lat: 38.9, lng: -77.0 },
  status: "existing",
  dateStart: { year: 2020, month: 1, precision: "exact" },
  lastUpdated: "2024-01-01",
  photos: [],
  sources: [],
  removalDateUncertain: false,
  ...overrides,
});

describe("useFilters", () => {
  it("includes an existing mural whose start date is before the selected date", () => {
    const mural = makeMural({
      status: "existing",
      dateStart: { year: 2020, month: 1, precision: "exact" },
    });
    // Selected timeline: June 2025
    const { result } = renderHook(() => useFilters([mural]), {
      wrapper: withTimeline({ month: 5, year: 2025 }),
    });

    expect(result.current).toEqual([mural]);
  });

  it("excludes an existing mural whose start date is after the selected date", () => {
    const mural = makeMural({
      status: "existing",
      dateStart: { year: 2030, month: 1, precision: "exact" },
    });
    // Selected timeline: June 2025, before the mural existed
    const { result } = renderHook(() => useFilters([mural]), {
      wrapper: withTimeline({ month: 5, year: 2025 }),
    });

    expect(result.current).toEqual([]);
  });

  it("includes a removed mural when the selected date falls within its start/end range", () => {
    const mural = makeMural({
      status: "removed",
      dateStart: { year: 2018, month: 1, precision: "exact" },
      dateEnd: { year: 2022, month: 1, precision: "exact" },
    });
    // Selected timeline: June 2020, between start and end
    const { result } = renderHook(() => useFilters([mural]), {
      wrapper: withTimeline({ month: 5, year: 2020 }),
    });

    expect(result.current).toEqual([mural]);
  });

  it("excludes a removed mural once the selected date is after its removal", () => {
    const mural = makeMural({
      status: "removed",
      dateStart: { year: 2018, month: 1, precision: "exact" },
      dateEnd: { year: 2020, month: 1, precision: "exact" },
    });
    // Selected timeline: June 2025, well after the mural was removed
    const { result } = renderHook(() => useFilters([mural]), {
      wrapper: withTimeline({ month: 5, year: 2025 }),
    });

    expect(result.current).toEqual([]);
  });

  it("excludes a removed mural when the selected date is before it was ever installed", () => {
    const mural = makeMural({
      status: "removed",
      dateStart: { year: 2018, month: 1, precision: "exact" },
      dateEnd: { year: 2020, month: 1, precision: "exact" },
    });
    // Selected timeline: June 2015, before the mural was installed
    const { result } = renderHook(() => useFilters([mural]), {
      wrapper: withTimeline({ month: 5, year: 2015 }),
    });

    expect(result.current).toEqual([]);
  });

  it("filters a mixed list down to only the murals present at the selected date", () => {
    const stillUp = makeMural({
      status: "existing",
      dateStart: { year: 2019, month: 1, precision: "exact" },
    });
    const notYetPainted = makeMural({
      status: "existing",
      dateStart: { year: 2027, month: 1, precision: "exact" },
    });
    const removedBeforeSelected = makeMural({
      status: "removed",
      dateStart: { year: 2015, month: 1, precision: "exact" },
      dateEnd: { year: 2016, month: 1, precision: "exact" },
    });
    const removedDuringSelected = makeMural({
      status: "removed",
      dateStart: { year: 2015, month: 1, precision: "exact" },
      dateEnd: { year: 2030, month: 1, precision: "exact" },
    });

    const { result } = renderHook(
      () =>
        useFilters([
          stillUp,
          notYetPainted,
          removedBeforeSelected,
          removedDuringSelected,
        ]),
      { wrapper: withTimeline({ month: 5, year: 2025 }) },
    );

    expect(result.current).toEqual([stillUp, removedDuringSelected]);
  });

  it("returns an empty array when given no murals", () => {
    const { result } = renderHook(() => useFilters([]), {
      wrapper: withTimeline({ month: 5, year: 2025 }),
    });

    expect(result.current).toEqual([]);
  });
});
