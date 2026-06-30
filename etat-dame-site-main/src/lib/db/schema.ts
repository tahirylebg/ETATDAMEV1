import { sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role", { enum: ["admin", "cuisine"] }).notNull(),
  email: text("email").unique(),
  passwordHash: text("password_hash"),
  pinHash: text("pin_hash"),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(current_timestamp)`),
});

export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  expiresAt: text("expires_at").notNull(),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(current_timestamp)`),
});

export const orders = sqliteTable("orders", {
  id: text("id").primaryKey(),
  reference: text("reference").notNull().unique(),
  status: text("status", {
    enum: ["recue", "en_preparation", "prete", "servie", "annulee"],
  })
    .notNull()
    .default("recue"),
  type: text("type", { enum: ["sur_place", "a_emporter"] }).notNull(),
  tableNumber: text("table_number"),
  pickupLabel: text("pickup_label"),
  notes: text("notes"),
  problemFlag: integer("problem_flag", { mode: "boolean" }).notNull().default(false),
  problemNote: text("problem_note"),
  totalCents: integer("total_cents").notNull(),
  receivedAt: text("received_at")
    .notNull()
    .default(sql`(current_timestamp)`),
  startedAt: text("started_at"),
  readyAt: text("ready_at"),
  completedAt: text("completed_at"),
  cancelledAt: text("cancelled_at"),
});

export const orderItems = sqliteTable("order_items", {
  id: text("id").primaryKey(),
  orderId: text("order_id")
    .notNull()
    .references(() => orders.id),
  menuItemId: text("menu_item_id"),
  name: text("name").notNull(),
  category: text("category").notNull(),
  unitPriceCents: integer("unit_price_cents").notNull(),
  quantity: integer("quantity").notNull().default(1),
  garniture: text("garniture"),
  status: text("status", { enum: ["en_attente", "prete"] })
    .notNull()
    .default("en_attente"),
});
