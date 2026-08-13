import { describe, expect, it } from "vitest";
import { databaseConnectionOptions, validateDatabaseUrl } from "./database-config";

describe("database runtime configuration", () => {
  it("limits each serverless instance to one transaction-pool connection", () => {
    expect(databaseConnectionOptions).toMatchObject({ prepare: false, max: 1 });
  });

  it("accepts the Supabase transaction pooler on Vercel", () => {
    expect(() =>
      validateDatabaseUrl(
        "postgresql://postgres.example:password@aws-0-region.pooler.supabase.com:6543/postgres",
        true,
      ),
    ).not.toThrow();
  });

  it("rejects the Supabase session pooler on Vercel", () => {
    expect(() =>
      validateDatabaseUrl(
        "postgresql://postgres.example:password@aws-0-region.pooler.supabase.com:5432/postgres",
        true,
      ),
    ).toThrow(/6543/);
  });
});
