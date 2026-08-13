import { relations, sql } from "drizzle-orm";
import {
  boolean,
  index,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("user_role", ["admin", "teacher"]);
export const meetingStatusEnum = pgEnum("meeting_status", [
  "approved",
  "rejected",
  "cancelled",
]);
export const deviceTypeEnum = pgEnum("device_type", [
  "desktop",
  "mobile",
  "tablet",
  "unknown",
]);

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    username: text("username").notNull(),
    displayName: text("display_name").notNull(),
    passwordHash: text("password_hash").notNull(),
    role: roleEnum("role").notNull().default("teacher"),
    mustChangePassword: boolean("must_change_password").notNull().default(true),
    isActive: boolean("is_active").notNull().default(true),
    deviceType: deviceTypeEnum("device_type").notNull().default("unknown"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex("users_username_unique").on(table.username)],
);

export const rooms = pgTable("rooms", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  roomNumber: text("room_number").notNull(),
  capacity: text("capacity").notNull().default("待设置"),
  facilities: text("facilities").notNull().default(""),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const meetings = pgTable(
  "meetings",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    subject: text("subject").notNull(),
    roomId: uuid("room_id").notNull().references(() => rooms.id, { onDelete: "restrict" }),
    applicantId: uuid("applicant_id").notNull().references(() => users.id, { onDelete: "restrict" }),
    startAt: timestamp("start_at", { withTimezone: true }).notNull(),
    endAt: timestamp("end_at", { withTimezone: true }).notNull(),
    status: meetingStatusEnum("status").notNull().default("approved"),
    rejectionReason: text("rejection_reason"),
    deviceType: deviceTypeEnum("device_type").notNull().default("unknown"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("meetings_room_start_idx").on(table.roomId, table.startAt),
    index("meetings_applicant_idx").on(table.applicantId),
    index("meetings_status_idx").on(table.status),
    sql`constraint meetings_valid_time check (${table.endAt} > ${table.startAt})`,
  ],
);

export const meetingParticipants = pgTable(
  "meeting_participants",
  {
    meetingId: uuid("meeting_id").notNull().references(() => meetings.id, { onDelete: "cascade" }),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "restrict" }),
  },
  (table) => [primaryKey({ columns: [table.meetingId, table.userId] })],
);

export const usersRelations = relations(users, ({ many }) => ({
  applications: many(meetings),
  participations: many(meetingParticipants),
}));

export const roomsRelations = relations(rooms, ({ many }) => ({ meetings: many(meetings) }));

export const meetingsRelations = relations(meetings, ({ one, many }) => ({
  room: one(rooms, { fields: [meetings.roomId], references: [rooms.id] }),
  applicant: one(users, { fields: [meetings.applicantId], references: [users.id] }),
  participants: many(meetingParticipants),
}));

export const meetingParticipantsRelations = relations(meetingParticipants, ({ one }) => ({
  meeting: one(meetings, { fields: [meetingParticipants.meetingId], references: [meetings.id] }),
  user: one(users, { fields: [meetingParticipants.userId], references: [users.id] }),
}));
