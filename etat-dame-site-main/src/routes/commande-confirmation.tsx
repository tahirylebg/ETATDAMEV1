import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";

const confirmationSearchSchema = z.object({
  ref: z.string().optional(),
  table: z.string().optional(),
});

export const Route = createFileRoute("/commande-confirmation")({
  validateSearch: confirmationSearchSchema,
  head: () => ({
    meta: [{ title: "Commande confirmée — ÉTAT DAME" }, { name: "robots", content: "noindex,nofollow" }],
  }),
  component: ConfirmationPage,
});

function ConfirmationPage() {
  const { table } = Route.useSearch();

  return (
    <main className="min-h-screen bg-cream flex flex-col items-center justify-center px-6 text-center">
      <div className="text-6xl mb-4">🎉</div>
      <p className="text-xs font-bold text-terracotta uppercase tracking-widest mb-2">Commande envoyée</p>
      <h1 className="text-3xl font-black text-cocoa mb-3">C'est parti !</h1>
      <p className="text-cocoa/60 max-w-xs leading-relaxed mb-8">
        {table
          ? `Ta commande a bien été transmise en cuisine. Elle sera servie à la table ${table}.`
          : "Ta commande a bien été transmise en cuisine. Elle sera prête sous peu."}
      </p>
      <Link
        to="/commande"
        search={{ table }}
        className="rounded-full border border-cocoa/20 text-cocoa font-bold px-6 py-3 text-sm hover:bg-cocoa/6 transition-colors"
      >
        Passer une autre commande
      </Link>
    </main>
  );
}
