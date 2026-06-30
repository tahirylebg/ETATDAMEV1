import { bases, garnitures, gourmandises, boissons } from "../etat-dame";
import type { OrderStatus } from "../orders/status";

type FakeOrderItem = {
  name: string;
  category: string;
  unitPriceCents: number;
  quantity: number;
  garniture?: string;
};

type FakeOrder = {
  status: OrderStatus;
  type: "sur_place" | "a_emporter";
  tableNumber?: string;
  pickupLabel?: string;
  totalCents: number;
  receivedAt: Date;
  startedAt?: Date;
  readyAt?: Date;
  completedAt?: Date;
  items: FakeOrderItem[];
};

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function parseEuroPrice(price: string): number {
  const cleaned = price.replace("€", "").replace(",", ".").trim();
  return Math.round(Number.parseFloat(cleaned) * 100);
}

function randomItems(): FakeOrderItem[] {
  const count = 1 + Math.floor(Math.random() * 3);
  const items: FakeOrderItem[] = [];
  for (let i = 0; i < count; i++) {
    if (Math.random() > 0.4) {
      const base = pick(bases);
      const garniture = Math.random() > 0.5 ? pick(garnitures) : undefined;
      items.push({
        name: base.name,
        category: "base",
        unitPriceCents: base.price,
        quantity: 1,
        garniture: garniture?.name,
      });
    } else {
      const sweet = pick([...gourmandises, ...boissons]);
      items.push({
        name: sweet.name,
        category: "extra",
        unitPriceCents: parseEuroPrice(sweet.price),
        quantity: 1,
      });
    }
  }
  return items;
}

const STATUS_POOL: OrderStatus[] = ["recue", "recue", "en_preparation", "prete", "servie"];

export function buildFakeOrder(): FakeOrder {
  const status = pick(STATUS_POOL);
  const items = randomItems();
  const totalCents = items.reduce((sum, i) => sum + i.unitPriceCents * i.quantity, 0);
  const receivedAt = new Date(Date.now() - Math.floor(Math.random() * 25) * 60_000);

  const order: FakeOrder = {
    status,
    type: Math.random() > 0.5 ? "sur_place" : "a_emporter",
    tableNumber: Math.random() > 0.5 ? String(1 + Math.floor(Math.random() * 12)) : undefined,
    pickupLabel: Math.random() > 0.5 ? undefined : "Comptoir",
    totalCents,
    receivedAt,
    items,
  };

  if (status !== "recue") order.startedAt = new Date(receivedAt.getTime() + 2 * 60_000);
  if (status === "prete" || status === "servie")
    order.readyAt = new Date(receivedAt.getTime() + 8 * 60_000);
  if (status === "servie") order.completedAt = new Date(receivedAt.getTime() + 12 * 60_000);

  return order;
}
