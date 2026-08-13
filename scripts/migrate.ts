import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import postgres from "postgres";

async function main() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required");
  const sql = postgres(process.env.DATABASE_URL, { prepare: false, max: 1 });
  const migrationsDirectory = path.join(process.cwd(), "drizzle");
  const migrations = (await readdir(migrationsDirectory))
    .filter((file) => file.endsWith(".sql"))
    .sort();
  await sql`
    CREATE TABLE IF NOT EXISTS "app_migrations" (
      "name" text PRIMARY KEY,
      "applied_at" timestamptz NOT NULL DEFAULT now()
    )
  `;
  const appliedRows = await sql<{ name: string }[]>`SELECT "name" FROM "app_migrations"`;
  const applied = new Set(appliedRows.map(({ name }) => name));
  let appliedCount = 0;
  for (const migration of migrations) {
    if (applied.has(migration)) continue;
    const contents = await readFile(path.join(migrationsDirectory, migration), "utf8");
    await sql.begin(async (transaction) => {
      await transaction.unsafe(contents);
      await transaction`INSERT INTO "app_migrations" ("name") VALUES (${migration})`;
    });
    appliedCount += 1;
  }
  await sql.end();
  console.log(`Database migration completed (${appliedCount} new, ${migrations.length} total).`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
