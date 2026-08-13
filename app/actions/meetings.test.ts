import { beforeEach, describe, expect, it, vi } from "vitest";

const { getDbMock, headersMock, redirectMock, requireUserMock } = vi.hoisted(() => ({
  getDbMock: vi.fn(),
  headersMock: vi.fn(),
  redirectMock: vi.fn(),
  requireUserMock: vi.fn(),
}));

vi.mock("@/db", () => ({ getDb: getDbMock }));
vi.mock("@/lib/auth", () => ({ requireUser: requireUserMock }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("next/headers", () => ({ headers: headersMock }));
vi.mock("next/navigation", () => ({ redirect: redirectMock }));

import { cancelMeetingAction, createMeetingAction, updateMeetingAction } from "./meetings";

describe("meeting booking completion", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("takes the user to the overview with a success notice after booking", async () => {
    const roomId = "8d96b18d-19ff-495d-adbe-63b63a027f2c";
    const limit = vi.fn().mockResolvedValueOnce([{ id: roomId }]).mockResolvedValueOnce([]);
    const query = {
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      limit,
    };
    const transaction = vi.fn(async (callback: (tx: unknown) => Promise<void>) => {
      const returning = vi.fn().mockResolvedValue([{ id: "75a767bf-50e9-4d4d-9d0a-4dc0ad2d25c2" }]);
      const tx = {
        insert: vi.fn(() => ({ values: vi.fn(() => ({ returning })) })),
      };
      await callback(tx);
    });

    getDbMock.mockReturnValue({ select: vi.fn(() => query), transaction });
    requireUserMock.mockResolvedValue({ id: "f5384153-dfea-41ef-88a2-bb2d103bc817" });
    headersMock.mockResolvedValue(new Headers({ "user-agent": "Mobile Safari" }));

    const formData = new FormData();
    formData.set("subject", "移动端预约回归测试");
    formData.set("roomId", roomId);
    formData.set("startAt", "2099-08-17T09:00");
    formData.set("endAt", "2099-08-17T10:00");

    await createMeetingAction({}, formData);

    expect(redirectMock).toHaveBeenCalledWith("/dashboard?booking=success");
  });
});

describe("meeting cancellation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("allows the applicant to remove an upcoming booking", async () => {
    const returning = vi.fn().mockResolvedValue([{ id: "75a767bf-50e9-4d4d-9d0a-4dc0ad2d25c2" }]);
    const where = vi.fn(() => ({ returning }));
    const set = vi.fn(() => ({ where }));
    getDbMock.mockReturnValue({ update: vi.fn(() => ({ set })) });
    requireUserMock.mockResolvedValue({ id: "f5384153-dfea-41ef-88a2-bb2d103bc817" });

    const formData = new FormData();
    formData.set("id", "75a767bf-50e9-4d4d-9d0a-4dc0ad2d25c2");

    const result = await cancelMeetingAction({}, formData);

    expect(result).toEqual({ success: "预约已删除" });
  });
});

describe("meeting editing", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("updates the applicant's booking and returns to their meeting list", async () => {
    const roomId = "8d96b18d-19ff-495d-adbe-63b63a027f2c";
    const meetingId = "75a767bf-50e9-4d4d-9d0a-4dc0ad2d25c2";
    const limit = vi.fn().mockResolvedValueOnce([{ id: roomId }]).mockResolvedValueOnce([]);
    const query = {
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      limit,
    };
    const transaction = vi.fn(async (callback: (tx: unknown) => Promise<boolean>) => {
      const updateReturning = vi.fn().mockResolvedValue([{ id: meetingId }]);
      const tx = {
        update: vi.fn(() => ({
          set: vi.fn(() => ({
            where: vi.fn(() => ({ returning: updateReturning })),
          })),
        })),
        delete: vi.fn(() => ({ where: vi.fn().mockResolvedValue(undefined) })),
      };
      return callback(tx);
    });
    getDbMock.mockReturnValue({ select: vi.fn(() => query), transaction });
    requireUserMock.mockResolvedValue({ id: "f5384153-dfea-41ef-88a2-bb2d103bc817" });

    const formData = new FormData();
    formData.set("id", meetingId);
    formData.set("subject", "更新后的周会");
    formData.set("roomId", roomId);
    formData.set("startAt", "2099-08-17T10:00");
    formData.set("endAt", "2099-08-17T11:00");

    await updateMeetingAction({}, formData);

    expect(redirectMock).toHaveBeenCalledWith("/dashboard/my-meetings?updated=success");
  });
});
