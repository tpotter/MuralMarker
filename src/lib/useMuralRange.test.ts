import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useMuralRange } from "./useMuralRange";
import type { MuralEntry } from "./types";

// Fixed "now" so totalMonths assertions are deterministic: June 15, 2025.
const NOW = new Date(2025, 5, 15);

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(NOW);
});

afterEach(() => {
  vi.useRealTimers();
});

let idCounter = 0;
const makeMural = (
  dateStart: MuralEntry["dateStart"],
  overrides: Partial<MuralEntry> = {},
): MuralEntry => ({
  id: `mural-${idCounter++}`,
  artists: [{ name: "Test Artist" }],
  description: "A test mural",
  location: { lat: 38.9, lng: -77.0 },
  status: "existing",
  dateStart,
  lastUpdated: "2024-01-01",
  photos: [],
  sources: [],
  removalDateUncertain: false,
  ...overrides,
});

describe("useMuralRange", () => {
  it("converts the earliest mural's explicit month to a 0-indexed baseMonth", () => {
    // Schema month is 1-indexed: 3 == March.
    const mural = makeMural({ year: 2020, month: 3, precision: "exact" });
    const { result } = renderHook(() => useMuralRange([mural]));

    // 0-indexed March == 2.
    expect(result.current.baseMonth).toEqual({ month: 2, year: 2020 });
  });

  it("defaults to January (0-indexed month 0) when the earliest mural has no explicit month", () => {
    const mural = makeMural({ year: 2021, precision: "circa" });
    const { result } = renderHook(() => useMuralRange([mural]));

    expect(result.current.baseMonth).toEqual({ month: 0, year: 2021 });
  });

  it("computes totalMonths as the number of months between the earliest mural and now", () => {
    // March 2020 -> June 2025 is 63 months.
    const mural = makeMural({ year: 2020, month: 3, precision: "exact" });
    const { result } = renderHook(() => useMuralRange([mural]));

    expect(result.current.totalMonths).toBe(63);
  });

  it("returns totalMonths of 0 when the earliest mural starts in the current month", () => {
    const mural = makeMural({ year: 2025, month: 6, precision: "exact" });
    const { result } = renderHook(() => useMuralRange([mural]));

    expect(result.current.totalMonths).toBe(0);
  });

  it("selects the chronologically earliest mural out of a mixed list", () => {
    const earliest = makeMural({ year: 2018, month: 5, precision: "exact" });
    const middle = makeMural({ year: 2020, month: 1, precision: "exact" });
    const latest = makeMural({ year: 2023, month: 11, precision: "exact" });

    const { result } = renderHook(() =>
      useMuralRange([middle, latest, earliest]),
    );

    // May 2018, 0-indexed == 4.
    expect(result.current.baseMonth).toEqual({ month: 4, year: 2018 });
  });

  it("treats a December start date correctly when comparing against other murals", () => {
    // Dec 2019 is chronologically earlier than Jan 2020, despite December
    // being month index 12 in the 1-indexed schema.
    const decemberMural = makeMural({
      year: 2019,
      month: 12,
      precision: "exact",
    });
    const januaryMural = makeMural({
      year: 2020,
      month: 1,
      precision: "exact",
    });

    const { result } = renderHook(() =>
      useMuralRange([januaryMural, decemberMural]),
    );

    // December 2019, 0-indexed == 11.
    expect(result.current.baseMonth).toEqual({ month: 11, year: 2019 });
  });

  it("does not throw and returns a zeroed range when given no murals", () => {
    const { result } = renderHook(() => useMuralRange([]));

    expect(result.current.totalMonths).toBe(0);
    expect(result.current.baseMonth).toEqual({ month: 0, year: 0 });
  });
});
