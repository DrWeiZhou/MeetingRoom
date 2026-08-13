import { describe, expect, it } from "vitest";
import { rangesOverlap, validateTimeRange } from "./time";

describe("meeting time rules", () => {
  it("accepts multiple consecutive half-hour blocks", () => {
    expect(validateTimeRange(new Date("2026-08-17T01:00:00Z"), new Date("2026-08-17T02:30:00Z"))).toBeNull();
  });

  it("rejects non half-hour boundaries", () => {
    expect(validateTimeRange(new Date("2026-08-17T01:10:00Z"), new Date("2026-08-17T02:30:00Z"))).toContain("半点");
  });

  it("allows adjacent meetings but rejects overlap", () => {
    const start = new Date("2026-08-17T01:00:00Z");
    const end = new Date("2026-08-17T02:00:00Z");
    expect(rangesOverlap(start, end, end, new Date("2026-08-17T03:00:00Z"))).toBe(false);
    expect(rangesOverlap(start, end, new Date("2026-08-17T01:30:00Z"), new Date("2026-08-17T02:30:00Z"))).toBe(true);
  });
});
