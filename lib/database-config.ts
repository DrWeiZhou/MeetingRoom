export const databaseConnectionOptions = {
  prepare: false,
  max: 1,
} as const;

export function validateDatabaseUrl(databaseUrl: string, isVercel: boolean) {
  if (!isVercel) return;

  const url = new URL(databaseUrl);
  if (url.hostname.endsWith(".pooler.supabase.com") && url.port === "5432") {
    throw new Error(
      "Vercel 必须使用 Supabase Transaction pooler（端口 6543），不能使用 Session pooler（端口 5432）。",
    );
  }
}
