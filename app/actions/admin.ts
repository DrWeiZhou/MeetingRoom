"use server";

import bcrypt from "bcryptjs";
import { and, eq, ne } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getDb } from "@/db";
import { meetings, rooms, users } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import type { ActionState } from "./meetings";

const roomSchema = z.object({
  name: z.string().trim().min(2, "会议室名称至少 2 个字符").max(50),
  roomNumber: z.string().trim().min(1, "请输入房间号").max(30),
  capacity: z.string().trim().min(1, "请输入容纳人数").max(30),
  facilities: z.string().trim().max(200),
});

export async function createRoomAction(_: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = roomSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  await getDb().insert(rooms).values(parsed.data);
  revalidatePath("/dashboard/admin/rooms");
  return { success: "会议室已添加" };
}

export async function updateRoomAction(formData: FormData) {
  await requireAdmin();
  const id = z.string().uuid().parse(formData.get("id"));
  const parsed = roomSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  await getDb().update(rooms).set({ ...parsed.data, updatedAt: new Date() }).where(eq(rooms.id, id));
  revalidatePath("/dashboard/admin/rooms");
}

export async function toggleRoomAction(formData: FormData) {
  await requireAdmin();
  const parsed = z.object({ id: z.string().uuid(), isActive: z.enum(["true", "false"]) }).parse(Object.fromEntries(formData));
  await getDb().update(rooms).set({ isActive: parsed.isActive !== "true", updatedAt: new Date() }).where(eq(rooms.id, parsed.id));
  revalidatePath("/dashboard/admin/rooms");
}

const teacherSchema = z.object({ username: z.string().trim().toLowerCase().regex(/^[a-z][a-z0-9_]{2,49}$/, "用户名需为 3–50 位英文字母或数字"), displayName: z.string().trim().min(2).max(30) });

export async function createTeacherAction(_: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = teacherSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  const db = getDb();
  const [exists] = await db.select({ id: users.id }).from(users).where(eq(users.username, parsed.data.username)).limit(1);
  if (exists) return { error: "用户名已存在" };
  await db.insert(users).values({ ...parsed.data, passwordHash: await bcrypt.hash("123456", 12), role: "teacher", mustChangePassword: true });
  revalidatePath("/dashboard/admin/teachers");
  return { success: "教师账号已创建，初始密码为 123456" };
}

export async function toggleTeacherAction(formData: FormData) {
  const admin = await requireAdmin();
  const parsed = z.object({ id: z.string().uuid(), isActive: z.enum(["true", "false"]) }).parse(Object.fromEntries(formData));
  if (parsed.id === admin.id) return;
  await getDb().update(users).set({ isActive: parsed.isActive !== "true", updatedAt: new Date() }).where(and(eq(users.id, parsed.id), ne(users.role, "admin")));
  revalidatePath("/dashboard/admin/teachers");
}

export async function rejectMeetingAction(_: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = z.object({ id: z.string().uuid(), rejectionReason: z.string().trim().min(4, "驳回理由至少 4 个字符").max(300) }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  const result = await getDb().update(meetings).set({ status: "rejected", rejectionReason: parsed.data.rejectionReason, updatedAt: new Date() }).where(and(eq(meetings.id, parsed.data.id), eq(meetings.status, "approved"))).returning({ id: meetings.id });
  if (!result.length) return { error: "该预约状态已变化，请刷新页面" };
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/admin/meetings");
  return { success: "预约已驳回，该时段现已释放" };
}
