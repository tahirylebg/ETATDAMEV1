import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/$")({
  head: () => ({
    meta: [
      { title: "Page introuvable — ÉTAT DAME" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: NotFoundPage,
});

function NotFoundPage() {
  return (
    <main className="min-h-screen bg-cream flex flex-col items-center justify-center px-4 text-center">
      <p className="text-8xl font-black text-cocoa/10 leading-none select-none">404</p>
      <h1 className="text-2xl font-black text-cocoa mt-2 mb-2">Page introuvable</h1>
      <p className="text-muted-foreground mb-8 max-w-xs">
        Cette page n'existe pas ou a été déplacée.
      </p>
      <Link
        to="/"
        className="rounded-full bg-cocoa text-cream font-bold px-6 py-3 hover:bg-cocoa/90 transition-colors"
      >
        Retour à l'accueil
      </Link>
    </main>
  );
}
