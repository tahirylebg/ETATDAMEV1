import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listUsers, createUser, toggleUserActive } from "@/lib/api/users.functions";

export function UsersPanel() {
  const queryClient = useQueryClient();
  const [role, setRole] = useState<"admin" | "cuisine">("cuisine");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pin, setPin] = useState("");

  const { data: users = [] } = useQuery({ queryKey: ["users"], queryFn: () => listUsers() });

  const createMutation = useMutation({
    mutationFn: () =>
      role === "admin"
        ? createUser({ data: { role: "admin", name, email, password } })
        : createUser({ data: { role: "cuisine", name, pin } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setName("");
      setEmail("");
      setPassword("");
      setPin("");
    },
  });

  const toggleMutation = useMutation({
    mutationFn: (vars: { userId: string; active: boolean }) => toggleUserActive({ data: vars }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });

  return (
    <section className="mt-8">
      <h2 className="text-xl font-black text-cocoa mb-3">Utilisateurs</h2>

      <div className="rounded-2xl bg-card border border-cocoa/14 p-5 shadow-paper mb-4">
        <ul className="space-y-2">
          {users.map((u) => (
            <li
              key={u.id}
              className="flex items-center justify-between gap-3 rounded-xl bg-cocoa/4 px-4 py-2.5"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-black ${u.role === "admin" ? "bg-terracotta/15 text-terracotta" : "bg-cocoa/10 text-cocoa"}`}>
                  {u.role}
                </span>
                <span className="text-sm font-medium text-cocoa truncate">{u.name}</span>
                {u.email && <span className="text-xs text-cocoa/40 truncate hidden sm:block">({u.email})</span>}
                {!u.active && <span className="text-xs text-cocoa/30">(désactivé)</span>}
              </div>
              <button
                onClick={() => toggleMutation.mutate({ userId: u.id, active: !u.active })}
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold transition-colors ${u.active ? "bg-red-100 text-red-700 hover:bg-red-200" : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"}`}
              >
                {u.active ? "Désactiver" : "Activer"}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-xl bg-card p-4 border border-cocoa/14 max-w-sm">
        <h3 className="font-bold text-cocoa mb-2">Créer un compte</h3>
        <div className="flex gap-2 mb-2">
          <button
            type="button"
            onClick={() => setRole("admin")}
            className={role === "admin" ? "font-bold underline" : ""}
          >
            Admin
          </button>
          <button
            type="button"
            onClick={() => setRole("cuisine")}
            className={role === "cuisine" ? "font-bold underline" : ""}
          >
            Cuisine
          </button>
        </div>
        <input
          className="field-input mb-2 w-full"
          placeholder="Nom"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {role === "admin" ? (
          <>
            <input
              className="field-input mb-2 w-full"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="field-input mb-2 w-full"
              placeholder="Mot de passe"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </>
        ) : (
          <input
            className="field-input mb-2 w-full"
            placeholder="Code PIN"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
          />
        )}
        <button
          onClick={() => createMutation.mutate()}
          className="rounded-lg bg-cocoa text-cream font-bold px-4 py-2 w-full"
        >
          Créer
        </button>
      </div>
    </section>
  );
}
