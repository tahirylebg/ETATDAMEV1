import { eq } from "drizzle-orm";
import { getDb } from "../db/server";
import { sessions, users } from "../db/schema";
import { getSessionCookie, setSessionCookie, clearSessionCookie } from "./cookie.server";

const SESSION_TTL_MS = 1000 * 60 * 60 * 12; // 12h

export async function createSession(userId: string) {
  const db = getDb();
  const id = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
  await db.insert(sessions).values({ id, userId, expiresAt: expiresAt.toISOString() });
  setSessionCookie(id, expiresAt);
  return id;
}

export async function getCurrentSessionUser() {
  const sessionId = getSessionCookie();
  if (!sessionId) return null;

  const db = getDb();
  const [row] = await db
    .select({ user: users, session: sessions })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(eq(sessions.id, sessionId))
    .limit(1);

  if (!row) return null;
  if (new Date(row.session.expiresAt).getTime() < Date.now()) return null;
  if (!row.user.active) return null;

  return row.user;
}

export async function destroyCurrentSession() {
  const sessionId = getSessionCookie();
  if (sessionId) {
    const db = getDb();
    await db.delete(sessions).where(eq(sessions.id, sessionId));
  }
  clearSessionCookie();
}
