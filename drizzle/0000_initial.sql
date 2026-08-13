CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS btree_gist;

DO $$ BEGIN CREATE TYPE "user_role" AS ENUM ('admin', 'teacher'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE "meeting_status" AS ENUM ('approved', 'rejected', 'cancelled'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE "device_type" AS ENUM ('desktop', 'mobile', 'tablet', 'unknown'); EXCEPTION WHEN duplicate_object THEN null; END $$;

CREATE TABLE IF NOT EXISTS "users" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "username" text NOT NULL,
  "display_name" text NOT NULL,
  "password_hash" text NOT NULL,
  "role" "user_role" DEFAULT 'teacher' NOT NULL,
  "must_change_password" boolean DEFAULT true NOT NULL,
  "is_active" boolean DEFAULT true NOT NULL,
  "device_type" "device_type" DEFAULT 'unknown' NOT NULL,
  "created_at" timestamptz DEFAULT now() NOT NULL,
  "updated_at" timestamptz DEFAULT now() NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS "users_username_unique" ON "users" ("username");

CREATE TABLE IF NOT EXISTS "rooms" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "name" text NOT NULL,
  "room_number" text NOT NULL,
  "capacity" text DEFAULT '待设置' NOT NULL,
  "facilities" text DEFAULT '' NOT NULL,
  "is_active" boolean DEFAULT true NOT NULL,
  "created_at" timestamptz DEFAULT now() NOT NULL,
  "updated_at" timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "meetings" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "subject" text NOT NULL,
  "room_id" uuid NOT NULL REFERENCES "rooms"("id") ON DELETE restrict,
  "applicant_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE restrict,
  "start_at" timestamptz NOT NULL,
  "end_at" timestamptz NOT NULL,
  "status" "meeting_status" DEFAULT 'approved' NOT NULL,
  "rejection_reason" text,
  "device_type" "device_type" DEFAULT 'unknown' NOT NULL,
  "created_at" timestamptz DEFAULT now() NOT NULL,
  "updated_at" timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT "meetings_valid_time" CHECK ("end_at" > "start_at")
);
CREATE INDEX IF NOT EXISTS "meetings_room_start_idx" ON "meetings" ("room_id", "start_at");
CREATE INDEX IF NOT EXISTS "meetings_applicant_idx" ON "meetings" ("applicant_id");
CREATE INDEX IF NOT EXISTS "meetings_status_idx" ON "meetings" ("status");

DO $$ BEGIN
  ALTER TABLE "meetings" ADD CONSTRAINT "meetings_no_room_overlap"
  EXCLUDE USING gist ("room_id" WITH =, tstzrange("start_at", "end_at", '[)') WITH &&)
  WHERE ("status" = 'approved');
EXCEPTION WHEN duplicate_object THEN null; END $$;

CREATE TABLE IF NOT EXISTS "meeting_participants" (
  "meeting_id" uuid NOT NULL REFERENCES "meetings"("id") ON DELETE cascade,
  "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE restrict,
  PRIMARY KEY ("meeting_id", "user_id")
);

CREATE TABLE IF NOT EXISTS "knowledge_documents" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "content" text NOT NULL,
  "embedding" vector(1536),
  "device_type" "device_type" DEFAULT 'unknown' NOT NULL,
  "created_at" timestamptz DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS "knowledge_embedding_idx" ON "knowledge_documents" USING hnsw ("embedding" vector_cosine_ops);
