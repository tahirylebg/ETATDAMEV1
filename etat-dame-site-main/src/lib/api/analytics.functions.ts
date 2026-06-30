import { createServerFn } from "@tanstack/react-start";
import { sql } from "drizzle-orm";
import { getDb } from "../db/server";
import { orders, orderItems } from "../db/schema";
import { requireAuth } from "../auth/guard.server";

export const getDashboardStats = createServerFn({ method: "GET" }).handler(async () => {
  await requireAuth();
  const db = getDb();
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const avgPrepRow = await db.get<{ avgMinutes: number | null }>(sql`
    SELECT AVG((julianday(ready_at) - julianday(received_at)) * 24 * 60) AS avgMinutes
    FROM orders
    WHERE ready_at IS NOT NULL AND received_at >= ${since}
  `);

  const ordersByDay = await db.all<{ day: string; count: number }>(sql`
    SELECT date(received_at) AS day, COUNT(*) AS count
    FROM orders
    WHERE received_at >= ${since}
    GROUP BY day
    ORDER BY day
  `);

  const revenueRow = await db.get<{ total: number | null }>(sql`
    SELECT SUM(total_cents) AS total
    FROM orders
    WHERE received_at >= ${since} AND status != 'annulee'
  `);

  const topDishes = await db.all<{ name: string; count: number }>(sql`
    SELECT order_items.name AS name, SUM(order_items.quantity) AS count
    FROM order_items
    JOIN orders ON orders.id = order_items.order_id
    WHERE orders.received_at >= ${since}
    GROUP BY order_items.name
    ORDER BY count DESC
    LIMIT 5
  `);

  return {
    avgPrepMinutes: avgPrepRow?.avgMinutes ?? 0,
    ordersByDay,
    revenueCents: revenueRow?.total ?? 0,
    topDishes,
  };
});
