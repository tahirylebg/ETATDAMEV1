import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { getDb } from "../db/server";
import { orders, orderItems, users } from "../db/schema";
import { requireRole } from "../auth/guard.server";
import { buildFakeOrder } from "../dev/fake-orders";
import { hashSecret } from "../auth/hash.server";

const INIT_TOKEN = "ED-INIT-2026-SUPPRIMER-APRES";

export const initAdminPassword = createServerFn({ method: "POST" })
  .inputValidator(z.object({ token: z.string(), password: z.string().min(8) }))
  .handler(async ({ data }) => {
    if (data.token !== INIT_TOKEN) throw new Error("Token invalide.");
    const db = getDb();
    const hash = await hashSecret(data.password);
    await db
      .update(users)
      .set({ passwordHash: hash, active: true })
      .where(eq(users.email, "admin@etatdame.fr"));
    return { ok: true };
  });

function buildReference(date: Date) {
  const ymd = date.toISOString().slice(0, 10).replace(/-/g, "");
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `ED-${ymd}-${rand}`;
}

const seedInput = z.object({ count: z.number().int().min(1).max(50).default(5) });

export const seedFakeOrders = createServerFn({ method: "POST" })
  .inputValidator(seedInput)
  .handler(async ({ data }) => {
    await requireRole("admin");

    const db = getDb();
    for (let i = 0; i < data.count; i++) {
      const fake = buildFakeOrder();
      const orderId = crypto.randomUUID();

      await db.insert(orders).values({
        id: orderId,
        reference: buildReference(fake.receivedAt),
        status: fake.status,
        type: fake.type,
        tableNumber: fake.tableNumber,
        pickupLabel: fake.pickupLabel,
        totalCents: fake.totalCents,
        receivedAt: fake.receivedAt.toISOString(),
        startedAt: fake.startedAt?.toISOString(),
        readyAt: fake.readyAt?.toISOString(),
        completedAt: fake.completedAt?.toISOString(),
      });

      for (const item of fake.items) {
        await db.insert(orderItems).values({ id: crypto.randomUUID(), orderId, ...item });
      }
    }

    return { ok: true, count: data.count };
  });
