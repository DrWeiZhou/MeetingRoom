import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

const { getOwnedMeetingMock, listActiveRoomsMock, listActiveTeachersMock, requireUserMock } = vi.hoisted(() => ({
  getOwnedMeetingMock: vi.fn(),
  listActiveRoomsMock: vi.fn(),
  listActiveTeachersMock: vi.fn(),
  requireUserMock: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({ requireUser: requireUserMock }));
vi.mock("@/lib/queries", () => ({
  getOwnedMeeting: getOwnedMeetingMock,
  listActiveRooms: listActiveRoomsMock,
  listActiveTeachers: listActiveTeachersMock,
}));
vi.mock("@/app/actions/meetings", () => ({ updateMeetingAction: vi.fn() }));

import EditMeetingPage from "./page";

describe("meeting edit page", () => {
  it("prefills an upcoming booking owned by the current user", async () => {
    const userId = "f5384153-dfea-41ef-88a2-bb2d103bc817";
    const meetingId = "75a767bf-50e9-4d4d-9d0a-4dc0ad2d25c2";
    const roomId = "8d96b18d-19ff-495d-adbe-63b63a027f2c";
    requireUserMock.mockResolvedValue({ id: userId });
    getOwnedMeetingMock.mockResolvedValue({
      id: meetingId,
      subject: "具身导航算法周会",
      roomId,
      startAt: new Date("2099-08-17T01:00:00Z"),
      endAt: new Date("2099-08-17T02:00:00Z"),
      participantIds: [],
    });
    listActiveRoomsMock.mockResolvedValue([{ id: roomId, name: "第一会议室", roomNumber: "1007", capacity: "12 人", facilities: "" }]);
    listActiveTeachersMock.mockResolvedValue([]);

    const page = await EditMeetingPage({ params: Promise.resolve({ id: meetingId }) });
    const html = renderToStaticMarkup(page);

    expect(html).toContain('value="具身导航算法周会"');
    expect(html).toContain("保存修改");
  });
});
