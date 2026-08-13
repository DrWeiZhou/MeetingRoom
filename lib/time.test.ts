import { describe, expect, it } from "vitest";
import { combineDateAndTime, getHalfHourTimeSlots, rangesOverlap, validateTimeRange } from "./time";

describe("meeting time rules", () => {
  it("accepts multiple consecutive half-hour blocks", () => {
    expect(validateTimeRange(new Date("2026-08-17T01:00:00Z"), new Date("2026-08-17T02:30:00Z"))).toBeNull();
  });

  it("rejects non half-hour boundaries", () => {
    expect(validateTimeRange(new Date("2026-08-17T01:10:00Z"), new Date("2026-08-17T02:30:00Z"))).toContain("半点");
  });

  it("only exposes the 48 half-hour time boundaries in the booking form", () => {
    const slots = getHalfHourTimeSlots();
    expect(slots).toHaveLength(48);
    expect(slots.slice(0, 4)).toEqual(["00:00", "00:30", "01:00", "01:30"]);
    expect(slots.at(-1)).toBe("23:30");
    expect(slots.every((slot) => /^(?:[01]\d|2[0-3]):(?:00|30)$/.test(slot))).toBe(true);
  });

  it("combines the selected date and half-hour boundary for submission", () => {
    expect(combineDateAndTime("2026-08-17", "09:30")).toBe("2026-08-17T09:30");
  });

  it("allows adjacent meetings but rejects overlap", () => {
    const start = new Date("2026-08-17T01:00:00Z");
    const end = new Date("2026-08-17T02:00:00Z");
    expect(rangesOverlap(start, end, end, new Date("2026-08-17T03:00:00Z"))).toBe(false);
    expect(rangesOverlap(start, end, new Date("2026-08-17T01:30:00Z"), new Date("2026-08-17T02:30:00Z"))).toBe(true);
  });
});
