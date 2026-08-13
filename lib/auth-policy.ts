import type { SessionUser } from "./session";

type AccountState = SessionUser & { isActive: boolean };

export function resolveActiveSessionUser(session: SessionUser, account: AccountState | null) {
  if (!account || !account.isActive || account.id !== session.id) return null;
  return {
    id: account.id,
    username: account.username,
    displayName: account.displayName,
    role: account.role,
    mustChangePassword: account.mustChangePassword,
  } satisfies SessionUser;
}
