import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "../db/server";
import { users } from "../db/schema";
import { verifySecret } from "../auth/hash.server";
import {
  createSession,
  destroyCurrentSession,
  getCurrentSessionUser,
} from "../auth/session.server";

const adminLoginInput = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});

export const loginAdmin = createServerFn({ method: "POST" })
  .inputValidator(adminLoginInput)
  .handler(async ({ data }) => {
    const db = getDb();
    const [user] = await db.select().from(users).where(eq(users.email, data.email)).limit(1);
    if (!user || user.role !== "admin" || !user.active || !user.passwordHash) {
      throw new Error("Identifiants invalides.");
    }
    const valid = await verifySecret(data.password, user.passwordHash);
    if (!valid) throw new Error("Identifiants invalides.");
    await createSession(user.id);
    return { ok: true, role: "admin" as const };
  });

const cuisineLoginInput = z.object({
  pin: z.string().trim().min(4).max(8),
});

export const loginCuisine = createServerFn({ method: "POST" })
  .inputValidator(cuisineLoginInput)
  .handler(async ({ data }) => {
    const db = getDb();
    const candidates = await db.select().from(users).where(eq(users.role, "cuisine"));
    for (const user of candidates) {
      if (!user.active || !user.pinHash) continue;
      if (await verifySecret(data.pin, user.pinHash)) {
        await createSession(user.id);
        return { ok: true, role: "cuisine" as const };
      }
    }
    throw new Error("Code PIN invalide.");
  });

export const logout = createServerFn({ method: "POST" }).handler(async () => {
  await destroyCurrentSession();
  return { ok: true };
});

export const getCurrentUser = createServerFn({ method: "GET" }).handler(async () => {
  const user = await getCurrentSessionUser();
  if (!user) return null;
  return { id: user.id, name: user.name, role: user.role };
});
