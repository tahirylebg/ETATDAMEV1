import { drizzle } from "drizzle-orm/d1";
import type { D1Database } from "@cloudflare/workers-types";
import { getRequest } from "@tanstack/react-start/server";
import * as schema from "./schema";

export function getDb() {
  const req = getRequest() as Request & {
    runtime?: { cloudflare?: { env?: { DB?: D1Database } } };
  };
  const db = req.runtime?.cloudflare?.env?.DB;
  if (!db) {
    throw new Error("Binding D1 'DB' introuvable. Utilise `wrangler pages dev` pour le dev local.");
  }
  return drizzle(db, { schema });
}
