import { describe, expect, it } from "vitest";
import { usernameSchema } from "./user-validation";

describe("username validation", () => {
  it("accepts full-pinyin style usernames", () => {
    expect(usernameSchema.safeParse("zhangsan").success).toBe(true);
    expect(usernameSchema.safeParse("li_si2").success).toBe(true);
  });

  it("rejects Chinese and punctuation", () => {
    expect(usernameSchema.safeParse("中文账号").success).toBe(false);
    expect(usernameSchema.safeParse("li-si").success).toBe(false);
  });
});
