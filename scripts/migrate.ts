import path from "node:path";
import postgres from "postgres";

async function main() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required");
  const sql = postgres(process.env.DATABASE_URL, { prepare: false, max: 1 });
  await sql.file(path.join(process.cwd(), "drizzle", "0000_initial.sql"));
  await sql.end();
  console.log("Database migration completed.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
