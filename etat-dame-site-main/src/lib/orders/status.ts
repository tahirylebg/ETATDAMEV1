export type OrderStatus = "recue" | "en_preparation" | "prete" | "servie" | "annulee";

// Définit les transitions possibles entre les statuts des commandes. Chaque statut peut évoluer vers un autre statut ou rester inchangé (null).
export const STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus | null> = {
  recue: "en_preparation",
  en_preparation: "prete",
  prete: "servie",
  servie: null,
  annulee: null,
};

// Définit les couleurs associées à chaque statut des commandes pour l'affichage dans l'interface utilisateur.
export const STATUS_TIMESTAMP_FIELD: Partial<
  Record<OrderStatus, "startedAt" | "readyAt" | "completedAt">
> = {
  en_preparation: "startedAt",
  prete: "readyAt",
  servie: "completedAt",
};

// Définit la couleur à afficher en fonction du temps écoulé depuis la réception de la commande.
export function elapsedColorBucket(receivedAt: string): "green" | "orange" | "red" {
  const elapsedMin = (Date.now() - new Date(receivedAt).getTime()) / 60000;
  if (elapsedMin < 8) return "green";
  if (elapsedMin < 15) return "orange";
  return "red";
}
