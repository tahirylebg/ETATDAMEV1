import { createServerFn } from "@tanstack/react-start";
import { eq, desc, gte, lte, and } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "../db/server";
import { orders, orderItems } from "../db/schema";
import { requireAuth, requireRole } from "../auth/guard.server";
import { STATUS_TRANSITIONS, STATUS_TIMESTAMP_FIELD, type OrderStatus } from "../orders/status";
import { getServerConfig } from "../config.server";

async function sendOrderConfirmationEmail(order: {
  reference: string;
  type: string;
  tableNumber?: string | null;
  totalCents: number;
  notes?: string | null;
}, items: { name: string; quantity: number; unitPriceCents: number; garniture?: string | null }[]) {
  const config = getServerConfig();
  if (!config.resendApiKey || !config.reservationEmailFrom || !config.reservationEmailTo) return;

  const itemLines = items.map(i =>
    `  • ${i.quantity}× ${i.name}${i.garniture ? ` (${i.garniture})` : ""} — ${(i.unitPriceCents / 100).toFixed(2)}€`
  ).join("\n");

  const typeLabel = order.type === "sur_place"
    ? order.tableNumber ? `Sur place — Table ${order.tableNumber}` : "Sur place"
    : "À emporter";

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { authorization: `Bearer ${config.resendApiKey}`, "content-type": "application/json" },
    body: JSON.stringify({
      from: config.reservationEmailFrom,
      to: [config.reservationEmailTo],
      subject: `Nouvelle commande ÉTAT DAME — ${order.reference}`,
      text: [
        `Nouvelle commande reçue : ${order.reference}`,
        `Type : ${typeLabel}`,
        ``,
        `Articles :`,
        itemLines,
        ``,
        `Total : ${(order.totalCents / 100).toFixed(2)}€`,
        order.notes ? `\nNote : ${order.notes}` : "",
      ].filter(s => s !== undefined).join("\n"),
    }),
  }).catch(() => {});
}

function buildReference() {
  const now = new Date();
  const ymd = now.toISOString().slice(0, 10).replace(/-/g, "");
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `ED-${ymd}-${rand}`;
}

const orderItemInput = z.object({
  menuItemId: z.string().optional(),
  name: z.string().min(1),
  category: z.string().min(1),
  unitPriceCents: z.number().int().nonnegative(),
  quantity: z.number().int().positive(),
  garniture: z.string().optional(),
});

const createOrderInput = z.object({
  type: z.enum(["sur_place", "a_emporter"]),
  tableNumber: z.string().max(10).optional(),
  pickupLabel: z.string().max(60).optional(),
  notes: z.string().max(500).optional(),
  items: z.array(orderItemInput).min(1).max(30),
});

export const createOrder = createServerFn({ method: "POST" })
  .inputValidator(createOrderInput)
  .handler(async ({ data }) => {
    const db = getDb();
    const orderId = crypto.randomUUID();
    const totalCents = data.items.reduce(
      (sum, item) => sum + item.unitPriceCents * item.quantity,
      0,
    );

    await db.insert(orders).values({
      id: orderId,
      reference: buildReference(),
      type: data.type,
      tableNumber: data.tableNumber,
      pickupLabel: data.pickupLabel,
      notes: data.notes,
      totalCents,
    });

    for (const item of data.items) {
      await db.insert(orderItems).values({ id: crypto.randomUUID(), orderId, ...item });
    }

    const [newOrder] = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
    if (newOrder) {
      await sendOrderConfirmationEmail(newOrder, data.items);
    }

    return { ok: true, orderId };
  });

const listOrdersInput = z.object({
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
}).optional();

export const listOrders = createServerFn({ method: "GET" })
  .inputValidator(listOrdersInput)
  .handler(async ({ data }) => {
    await requireAuth();
    const db = getDb();
    const conditions = [];
    if (data?.dateFrom) conditions.push(gte(orders.receivedAt, `${data.dateFrom}T00:00:00.000Z`));
    if (data?.dateTo) conditions.push(lte(orders.receivedAt, `${data.dateTo}T23:59:59.999Z`));
    const rows = await db.select().from(orders)
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(desc(orders.receivedAt))
      .limit(200);
    return rows;
  });

const orderIdInput = z.object({ orderId: z.string() });

export const getOrder = createServerFn({ method: "GET" })
  .inputValidator(orderIdInput)
  .handler(async ({ data }) => {
    await requireAuth();
    const db = getDb();
    const [order] = await db.select().from(orders).where(eq(orders.id, data.orderId)).limit(1);
    if (!order) throw new Error("Commande introuvable.");
    const items = await db.select().from(orderItems).where(eq(orderItems.orderId, data.orderId));
    return { order, items };
  });

const updateStatusInput = z.object({ orderId: z.string() });

export const updateOrderStatus = createServerFn({ method: "POST" })
  .inputValidator(updateStatusInput)
  .handler(async ({ data }) => {
    await requireAuth();
    const db = getDb();
    const [order] = await db.select().from(orders).where(eq(orders.id, data.orderId)).limit(1);
    if (!order) throw new Error("Commande introuvable.");

    const next = STATUS_TRANSITIONS[order.status as OrderStatus];
    if (!next) throw new Error("Aucune transition possible depuis ce statut.");

    const timestampField = STATUS_TIMESTAMP_FIELD[next];
    await db
      .update(orders)
      .set({
        status: next,
        ...(timestampField ? { [timestampField]: new Date().toISOString() } : {}),
      })
      .where(eq(orders.id, data.orderId));

    return { ok: true, status: next };
  });

const flagProblemInput = z.object({ orderId: z.string(), note: z.string().min(1).max(300) });

export const flagOrderProblem = createServerFn({ method: "POST" })
  .inputValidator(flagProblemInput)
  .handler(async ({ data }) => {
    await requireAuth();
    const db = getDb();
    await db
      .update(orders)
      .set({ problemFlag: true, problemNote: data.note })
      .where(eq(orders.id, data.orderId));
    return { ok: true };
  });

export const cancelOrder = createServerFn({ method: "POST" })
  .inputValidator(orderIdInput)
  .handler(async ({ data }) => {
    await requireRole("admin");
    const db = getDb();
    await db
      .update(orders)
      .set({ status: "annulee", cancelledAt: new Date().toISOString() })
      .where(eq(orders.id, data.orderId));
    return { ok: true };
  });
