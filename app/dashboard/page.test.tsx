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

  it("does not show cancelled meetings in the overview schedule", async () => {
    listMeetingsInRangeMock.mockResolvedValue([
      {
        id: "75a767bf-50e9-4d4d-9d0a-4dc0ad2d25c2",
        subject: "保留的会议",
        startAt: new Date("2026-08-13T01:00:00Z"),
        endAt: new Date("2026-08-13T02:00:00Z"),
        status: "approved",
        rejectionReason: null,
        roomId: "8d96b18d-19ff-495d-adbe-63b63a027f2c",
        roomName: "第一会议室",
        roomNumber: "1007",
        applicantId: "f5384153-dfea-41ef-88a2-bb2d103bc817",
        applicantName: "测试教师",
        participants: [],
      },
      {
        id: "c95b2472-0dbd-4420-88b9-c9ea700bca8a",
        subject: "已删除的会议",
        startAt: new Date("2026-08-13T02:00:00Z"),
        endAt: new Date("2026-08-13T03:00:00Z"),
        status: "cancelled",
        rejectionReason: null,
        roomId: "8d96b18d-19ff-495d-adbe-63b63a027f2c",
        roomName: "第一会议室",
        roomNumber: "1007",
        applicantId: "f5384153-dfea-41ef-88a2-bb2d103bc817",
        applicantName: "测试教师",
        participants: [],
      },
    ]);

    const page = await Reflect.apply(DashboardPage, undefined, [
      { searchParams: Promise.resolve({}) },
    ]);
    const html = renderToStaticMarkup(page);

    expect(html).toContain("保留的会议");
    expect(html).not.toContain("已删除的会议");
  });
});
