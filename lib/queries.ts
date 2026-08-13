import "server-only";

import { and, asc, eq, gte, inArray, lt } from "drizzle-orm";
import { getDb } from "@/db";
import { meetingParticipants, meetings, rooms, users } from "@/db/schema";

export async function listActiveRooms() {
  return getDb().select().from(rooms).where(eq(rooms.isActive, true)).orderBy(asc(rooms.name));
}

export async function listActiveTeachers() {
  return getDb().select({ id: users.id, displayName: users.displayName, username: users.username }).from(users).where(eq(users.isActive, true)).orderBy(asc(users.displayName));
}

export async function listMeetingsInRange(start: Date, end: Date) {
  const db = getDb();
  const rows = await db
    .select({
      id: meetings.id,
      subject: meetings.subject,
      startAt: meetings.startAt,
      endAt: meetings.endAt,
      status: meetings.status,
      rejectionReason: meetings.rejectionReason,
      roomId: rooms.id,
      roomName: rooms.name,
      roomNumber: rooms.roomNumber,
      applicantId: users.id,
      applicantName: users.displayName,
    })
    .from(meetings)
    .innerJoin(rooms, eq(meetings.roomId, rooms.id))
    .innerJoin(users, eq(meetings.applicantId, users.id))
    .where(and(gte(meetings.startAt, start), lt(meetings.startAt, end)))
    .orderBy(asc(meetings.startAt));
  if (!rows.length) return [];
  const participantRows = await db
    .select({ meetingId: meetingParticipants.meetingId, displayName: users.displayName })
    .from(meetingParticipants)
    .innerJoin(users, eq(meetingParticipants.userId, users.id))
    .where(inArray(meetingParticipants.meetingId, rows.map((row) => row.id)));
  return rows.map((row) => ({ ...row, participants: participantRows.filter((p) => p.meetingId === row.id).map((p) => p.displayName) }));
}
