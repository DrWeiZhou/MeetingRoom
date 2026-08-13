import "server-only";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { getDb } from "@/db";
import { users } from "@/db/schema";
import { resolveActiveSessionUser } from "@/lib/auth-policy";
import { getSession } from "@/lib/session";

export { createSession, destroySession, getSession } from "@/lib/session";
export type { SessionUser } from "@/lib/session";

export async function requireUser(options?: { allowPasswordChange?: boolean }) {
  const session = await getSession();
  if (!session) redirect("/login");
  const [account] = await getDb()
    .select({
      id: users.id,
      username: users.username,
      displayName: users.displayName,
      role: users.role,
      mustChangePassword: users.mustChangePassword,
      isActive: users.isActive,
    })
    .from(users)
    .where(eq(users.id, session.id))
    .limit(1);
  const user = resolveActiveSessionUser(session, account ?? null);
  if (!user) redirect("/login");
  if (user.mustChangePassword && !options?.allowPasswordChange) redirect("/change-password");
  return user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== "admin") redirect("/dashboard");
  return user;
}
