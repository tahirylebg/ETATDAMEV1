import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "../db/server";
import { users } from "../db/schema";
import { requireRole } from "../auth/guard.server";
import { hashSecret } from "../auth/hash.server";

export const listUsers = createServerFn({ method: "GET" }).handler(async () => {
  await requireRole("admin");
  const db = getDb();
  const rows = await db.select().from(users);
  return rows.map((u) => ({
    id: u.id,
    name: u.name,
    role: u.role,
    email: u.email,
    active: u.active,
  }));
});

const createUserInput = z.discriminatedUnion("role", [
  z.object({
    role: z.literal("admin"),
    name: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(6),
  }),
  z.object({ role: z.literal("cuisine"), name: z.string().min(1), pin: z.string().min(4).max(8) }),
]);

export const createUser = createServerFn({ method: "POST" })
  .inputValidator(createUserInput)
  .handler(async ({ data }) => {
    await requireRole("admin");
    const db = getDb();
    const id = crypto.randomUUID();

    if (data.role === "admin") {
      await db.insert(users).values({
        id,
        name: data.name,
        role: "admin",
        email: data.email,
        passwordHash: await hashSecret(data.password),
      });
    } else {
      await db.insert(users).values({
        id,
        name: data.name,
        role: "cuisine",
        pinHash: await hashSecret(data.pin),
      });
    }

    return { ok: true, id };
  });

const toggleInput = z.object({ userId: z.string(), active: z.boolean() });

export const toggleUserActive = createServerFn({ method: "POST" })
  .inputValidator(toggleInput)
  .handler(async ({ data }) => {
    await requireRole("admin");
    const db = getDb();
    await db.update(users).set({ active: data.active }).where(eq(users.id, data.userId));
    return { ok: true };
  });
