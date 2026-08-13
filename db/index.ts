import "server-only";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { databaseConnectionOptions, validateDatabaseUrl } from "@/lib/database-config";
import * as schema from "./schema";

let connection: ReturnType<typeof postgres> | undefined;

export function getDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error("尚未配置 DATABASE_URL，请先连接 Supabase 数据库。");
  }
  validateDatabaseUrl(process.env.DATABASE_URL, process.env.VERCEL === "1");
  connection ??= postgres(process.env.DATABASE_URL, databaseConnectionOptions);
  return drizzle(connection, { schema });
}

export type Database = ReturnType<typeof getDb>;
