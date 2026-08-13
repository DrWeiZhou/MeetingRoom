import { describe, expect, it } from "vitest";
import { resolveActiveSessionUser } from "./auth-policy";

const session = {
  id: "8d96b18d-19ff-495d-adbe-63b63a027f2c",
  username: "teacher",
  displayName: "测试教师",
  role: "teacher" as const,
  mustChangePassword: false,
};

describe("session account policy", () => {
  it("rejects a session after the account is disabled", () => {
    expect(resolveActiveSessionUser(session, { ...session, isActive: false })).toBeNull();
  });

  it("uses current database authorization fields instead of stale JWT fields", () => {
    expect(
      resolveActiveSessionUser(session, {
        ...session,
        displayName: "新姓名",
        role: "admin",
        mustChangePassword: true,
        isActive: true,
      }),
    ).toEqual({ ...session, displayName: "新姓名", role: "admin", mustChangePassword: true });
  });
});
