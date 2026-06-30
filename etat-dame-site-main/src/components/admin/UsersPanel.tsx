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

      <ul className="text-sm mb-4 space-y-1">
        {users.map((u) => (
          <li
            key={u.id}
            className="flex items-center justify-between border-b border-cocoa/10 py-1"
          >
            <span>
              {u.name} — {u.role} {u.email ? `(${u.email})` : ""} {!u.active && "(désactivé)"}
            </span>
            <button
              onClick={() => toggleMutation.mutate({ userId: u.id, active: !u.active })}
              className="text-terracotta underline text-xs"
            >
              {u.active ? "Désactiver" : "Activer"}
            </button>
          </li>
        ))}
      </ul>

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
