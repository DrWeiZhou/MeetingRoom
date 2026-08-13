import "server-only";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

let connection: ReturnType<typeof postgres> | undefined;

export function getDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error("尚未配置 DATABASE_URL，请先连接 Supabase 数据库。");
  }
  connection ??= postgres(process.env.DATABASE_URL, { prepare: false, max: 5 });
  return drizzle(connection, { schema });
}

export type Database = ReturnType<typeof getDb>;
