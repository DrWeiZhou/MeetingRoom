import { describe, expect, it } from "vitest";
import { getChinaWeekRange, getWeekDays } from "./calendar";

describe("China week calendar", () => {
  it("starts on Monday and includes Sunday", () => {
    const { start } = getChinaWeekRange(new Date("2026-08-13T03:00:00Z"));
    const days = getWeekDays(start);
    expect(days[0]).toMatchObject({ key: "2026-08-10", label: "周一" });
    expect(days[6]).toMatchObject({ key: "2026-08-16", label: "周日" });
  });
});
