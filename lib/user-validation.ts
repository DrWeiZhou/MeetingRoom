import { z } from "zod";

export const usernameSchema = z
  .string()
  .trim()
  .toLowerCase()
  .regex(/^[a-z][a-z0-9_]{2,49}$/, "用户名需为 3–50 位英文字母、数字或下划线，并以字母开头");
