import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { initAdminPassword } from "@/lib/api/dev-tools.functions";

export const Route = createFileRoute("/back/init")({
  head: () => ({ meta: [{ name: "robots", content: "noindex,nofollow" }] }),
  component: InitPage,
});

function InitPage() {
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function handle(e: React.FormEvent) {
    e.preventDefault();
    try {
      await initAdminPassword({ data: { token: "ED-INIT-2026-SUPPRIMER-APRES", password } });
      setStatus("ok");
      setMsg("Mot de passe défini. Supprime cette page du code maintenant.");
    } catch (err) {
      setStatus("error");
      setMsg(err instanceof Error ? err.message : "Erreur");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-cream px-4">
      <form onSubmit={handle} className="w-full max-w-sm rounded-2xl border border-cocoa/14 bg-card p-6 shadow-paper">
        <h1 className="text-xl font-black text-cocoa mb-4">Init mot de passe admin</h1>
        <input
          className="field-input mb-4 w-full"
          placeholder="Nouveau mot de passe (min 8 chars)"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {status === "ok" && <p className="text-green-700 text-sm mb-2">{msg}</p>}
        {status === "error" && <p className="text-red-600 text-sm mb-2">{msg}</p>}
        <button type="submit" className="w-full rounded-lg bg-cocoa text-cream font-bold py-2">
          Définir le mot de passe
        </button>
      </form>
    </main>
  );
}
