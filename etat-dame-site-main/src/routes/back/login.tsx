import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { loginAdmin, loginCuisine } from "@/lib/api/auth.functions";

export const Route = createFileRoute("/back/login")({
  head: () => ({
    meta: [{ title: "Connexion — ÉTAT DAME" }, { name: "robots", content: "noindex,nofollow" }],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"admin" | "cuisine">("admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      if (mode === "admin") {
        await loginAdmin({ data: { email, password } });
        navigate({ to: "/back/admin" });
      } else {
        await loginCuisine({ data: { pin } });
        navigate({ to: "/back/cuisine" });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de connexion.");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-cream px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-cocoa/14 bg-card p-6 shadow-paper"
      >
        <h1 className="text-xl font-black text-cocoa mb-4">Connexion back-office</h1>
        <div className="flex gap-2 mb-4">
          <button
            type="button"
            onClick={() => setMode("admin")}
            className={mode === "admin" ? "font-bold underline" : ""}
          >
            Admin
          </button>
          <button
            type="button"
            onClick={() => setMode("cuisine")}
            className={mode === "cuisine" ? "font-bold underline" : ""}
          >
            Cuisine
          </button>
        </div>
        {mode === "admin" ? (
          <>
            <input
              className="field-input mb-2 w-full"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="field-input mb-4 w-full"
              placeholder="Mot de passe"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </>
        ) : (
          <input
            className="field-input mb-4 w-full"
            placeholder="Code PIN"
            inputMode="numeric"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
          />
        )}
        {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
        <button type="submit" className="w-full rounded-lg bg-cocoa text-cream font-bold py-2">
          Se connecter
        </button>
      </form>
    </main>
  );
}
