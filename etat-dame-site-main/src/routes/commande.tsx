import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const commandeSearchSchema = z.object({
  table: z.string().optional(),
});

export const Route = createFileRoute("/commande")({
  validateSearch: commandeSearchSchema,
  head: () => ({
    meta: [{ title: "Commander — ÉTAT DAME" }, { name: "robots", content: "noindex,nofollow" }],
  }),
  component: CommandePage,
});

function CommandePage() {
  const { table } = Route.useSearch();

  return (
    <main className="min-h-screen bg-cream flex items-center justify-center px-4 text-center">
      <div className="max-w-md">
        <p className="section-kicker text-terracotta">Commande</p>
        <h1 className="heading-readable mt-3 text-4xl text-cocoa">Commande bientôt disponible</h1>
        <p className="mt-4 text-cocoa/78">
          {table ? `Table ${table} — ` : ""}La commande en ligne arrive prochainement. En attendant,
          consultez notre carte.
        </p>
        <a
          href="/menu"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-cocoa px-6 py-3 text-sm font-black text-cream"
        >
          Voir le menu
        </a>
      </div>
    </main>
  );
}
