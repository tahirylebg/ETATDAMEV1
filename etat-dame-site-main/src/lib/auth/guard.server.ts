import { getCurrentSessionUser } from "./session.server";

// Le guard server est utilisé pour protéger les routes côté serveur. Il vérifie si l'utilisateur est authentifié et s'il a le rôle requis pour accéder à certaines fonctionnalités. Si l'utilisateur n'est pas autorisé, une erreur est levée.
export async function requireRole(role: "admin" | "cuisine") {
  const user = await getCurrentSessionUser();
  if (!user || user.role !== role) {
    throw new Error("Non autorisé.");
  }
  return user;
}

export async function requireAuth() {
  const user = await getCurrentSessionUser();
  if (!user) throw new Error("Non autorisé.");
  return user;
}
