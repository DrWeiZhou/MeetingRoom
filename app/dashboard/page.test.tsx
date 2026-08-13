import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { getDbMock, listMeetingsInRangeMock, requireUserMock } = vi.hoisted(() => ({
  getDbMock: vi.fn(),
  listMeetingsInRangeMock: vi.fn(),
  requireUserMock: vi.fn(),
}));

vi.mock("@/db", () => ({ getDb: getDbMock }));
vi.mock("@/lib/auth", () => ({ requireUser: requireUserMock }));
vi.mock("@/lib/queries", () => ({ listMeetingsInRange: listMeetingsInRangeMock }));

import DashboardPage from "./page";

describe("dashboard booking feedback", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    requireUserMock.mockResolvedValue({
      id: "f5384153-dfea-41ef-88a2-bb2d103bc817",
      displayName: "测试教师",
    });
    listMeetingsInRangeMock.mockResolvedValue([]);
    getDbMock.mockReturnValue({
      select: vi.fn(() => ({
        from: vi.fn(() => ({ where: vi.fn().mockResolvedValue([]) })),
      })),
    });
  });

  it("shows booking success at the top of the overview", async () => {
    const page = await Reflect.apply(DashboardPage, undefined, [
      { searchParams: Promise.resolve({ booking: "success" }) },
    ]);
    const html = renderToStaticMarkup(page);

    expect(html).toContain('role="status"');
    expect(html).toContain("预约成功");
  });

  it("opens the user's weekly meeting list from the summary card", async () => {
    const page = await Reflect.apply(DashboardPage, undefined, [
      { searchParams: Promise.resolve({}) },
    ]);
    const html = renderToStaticMarkup(page);

    expect(html).toContain('href="/dashboard/my-meetings"');
  });
});
