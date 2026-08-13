"use server";

import { and, eq, gt, inArray, lt } from "drizzle-orm";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getDb } from "@/db";
import { meetingParticipants, meetings, rooms, users } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { inferDeviceType } from "@/lib/device";
import { validateTimeRange } from "@/lib/time";

export type ActionState = { error?: string; success?: string };

const meetingSchema = z.object({
  subject: z.string().trim().min(2, "会议主题至少 2 个字符").max(120),
  roomId: z.string().uuid("请选择会议室"),
  startAt: z.string().min(1, "请选择开始时间"),
  endAt: z.string().min(1, "请选择结束时间"),
});

function fromChinaLocal(value: string) {
  return new Date(`${value}:00+08:00`);
}

export async function createMeetingAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireUser();
  const parsed = meetingSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  const startAt = fromChinaLocal(parsed.data.startAt);
  const endAt = fromChinaLocal(parsed.data.endAt);
  if (Number.isNaN(startAt.getTime()) || Number.isNaN(endAt.getTime())) return { error: "时间格式不正确" };
  const timeError = validateTimeRange(startAt, endAt);
  if (timeError) return { error: timeError };
  if (startAt < new Date()) return { error: "不能预约已经过去的时间" };

  const db = getDb();
  const [room] = await db.select({ id: rooms.id }).from(rooms).where(and(eq(rooms.id, parsed.data.roomId), eq(rooms.isActive, true))).limit(1);
  if (!room) return { error: "会议室不存在或已停用" };
  const [conflict] = await db.select({ id: meetings.id }).from(meetings).where(and(eq(meetings.roomId, room.id), eq(meetings.status, "approved"), lt(meetings.startAt, endAt), gt(meetings.endAt, startAt))).limit(1);
  if (conflict) return { error: "该会议室在所选时段已被预约，请更换时间或会议室" };

  const requestedParticipants = [...new Set(formData.getAll("participantIds").map(String))].filter((id) => id !== user.id);
  const validParticipants = requestedParticipants.length
    ? await db.select({ id: users.id }).from(users).where(and(inArray(users.id, requestedParticipants), eq(users.isActive, true)))
    : [];
  const deviceType = inferDeviceType((await headers()).get("user-agent"));
  try {
    await db.transaction(async (tx) => {
      const [meeting] = await tx.insert(meetings).values({ subject: parsed.data.subject, roomId: room.id, applicantId: user.id, startAt, endAt, status: "approved", deviceType }).returning({ id: meetings.id });
      if (validParticipants.length) await tx.insert(meetingParticipants).values(validParticipants.map(({ id }) => ({ meetingId: meeting.id, userId: id })));
    });
  } catch (error) {
    if (typeof error === "object" && error && "code" in error && error.code === "23P01") return { error: "刚刚有人预约了这个时段，请重新选择" };
    throw error;
  }
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/book");
  return { success: "会议室已自动预约成功" };
}
