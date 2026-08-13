import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { listMeetingsInRangeMock, requireUserMock } = vi.hoisted(() => ({
  listMeetingsInRangeMock: vi.fn(),
  requireUserMock: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({ requireUser: requireUserMock }));
vi.mock("@/lib/queries", () => ({ listMeetingsInRange: listMeetingsInRangeMock }));
vi.mock("@/app/actions/meetings", () => ({ cancelMeetingAction: vi.fn() }));

import MyMeetingsPage from "./page";

describe("my weekly meetings", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    requireUserMock.mockResolvedValue({
      id: "f5384153-dfea-41ef-88a2-bb2d103bc817",
      displayName: "测试教师",
    });
  });

  it("lists the user's approved bookings with edit and delete controls", async () => {
    listMeetingsInRangeMock.mockResolvedValue([
      {
        id: "75a767bf-50e9-4d4d-9d0a-4dc0ad2d25c2",
        subject: "具身导航算法周会",
        startAt: new Date("2099-08-17T01:00:00Z"),
        endAt: new Date("2099-08-17T02:00:00Z"),
        status: "approved",
        rejectionReason: null,
        roomId: "8d96b18d-19ff-495d-adbe-63b63a027f2c",
        roomName: "第一会议室",
        roomNumber: "1007",
        applicantId: "f5384153-dfea-41ef-88a2-bb2d103bc817",
        applicantName: "测试教师",
        participants: ["王老师"],
      },
    ]);

    const page = await MyMeetingsPage({ searchParams: Promise.resolve({}) });
    const html = renderToStaticMarkup(page);

    expect(html).toContain("具身导航算法周会");
    expect(html).toContain('href="/dashboard/my-meetings/75a767bf-50e9-4d4d-9d0a-4dc0ad2d25c2/edit"');
    expect(html).toContain("删除预约");
  });
});
