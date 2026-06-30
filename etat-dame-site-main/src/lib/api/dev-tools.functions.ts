import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getDb } from "../db/server";
import { orders, orderItems } from "../db/schema";
import { requireRole } from "../auth/guard.server";
import { buildFakeOrder } from "../dev/fake-orders";

function buildReference(date: Date) {
  const ymd = date.toISOString().slice(0, 10).replace(/-/g, "");
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `ED-${ymd}-${rand}`;
}

const seedInput = z.object({ count: z.number().int().min(1).max(50).default(5) });

export const seedFakeOrders = createServerFn({ method: "POST" })
  .inputValidator(seedInput)
  .handler(async ({ data }) => {
    if (process.env.NODE_ENV === "production") {
      throw new Error("Générateur de commandes de test indisponible en production.");
    }
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
