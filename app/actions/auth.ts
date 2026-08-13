"use server";

import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getDb } from "@/db";
import { users } from "@/db/schema";
import { createSession, destroySession, requireUser } from "@/lib/auth";
import { inferDeviceType } from "@/lib/device";
import { usernameSchema } from "@/lib/user-validation";

export type AuthState = { error?: string };

const credentialsSchema = z.object({
  username: usernameSchema,
  password: z.string().min(6, "密码至少 6 位").max(128),
});

export async function loginAction(_: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = credentialsSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  const db = getDb();
  const [user] = await db.select().from(users).where(eq(users.username, parsed.data.username)).limit(1);
  if (!user || !user.isActive || !(await bcrypt.compare(parsed.data.password, user.passwordHash))) {
    return { error: "用户名或密码不正确" };
  }
  const deviceType = inferDeviceType((await headers()).get("user-agent"));
  await db.update(users).set({ deviceType, updatedAt: new Date() }).where(eq(users.id, user.id));
  await createSession({ id: user.id, username: user.username, displayName: user.displayName, role: user.role, mustChangePassword: user.mustChangePassword });
  redirect(user.mustChangePassword ? "/change-password" : "/dashboard");
}

const registerSchema = credentialsSchema.extend({ displayName: z.string().trim().min(2, "请输入姓名").max(30) });

export async function registerAction(_: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = registerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  const db = getDb();
  const [exists] = await db.select({ id: users.id }).from(users).where(eq(users.username, parsed.data.username)).limit(1);
  if (exists) return { error: "该用户名已被使用" };
  const passwordHash = await bcrypt.hash(parsed.data.password, 12);
  const [user] = await db.insert(users).values({ ...parsed.data, passwordHash, mustChangePassword: false, role: "teacher" }).returning();
  await createSession({ id: user.id, username: user.username, displayName: user.displayName, role: user.role, mustChangePassword: false });
  redirect("/dashboard");
}

export async function changePasswordAction(_: AuthState, formData: FormData): Promise<AuthState> {
  const user = await requireUser({ allowPasswordChange: true });
  const schema = z.object({ password: z.string().min(8, "新密码至少 8 位").max(128), confirmation: z.string() }).refine((v) => v.password === v.confirmation, { message: "两次输入的密码不一致" });
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  const passwordHash = await bcrypt.hash(parsed.data.password, 12);
  await getDb().update(users).set({ passwordHash, mustChangePassword: false, updatedAt: new Date() }).where(eq(users.id, user.id));
  await createSession({ ...user, mustChangePassword: false });
  redirect("/dashboard");
}

export async function logoutAction() {
  await destroySession();
  redirect("/login");
}
