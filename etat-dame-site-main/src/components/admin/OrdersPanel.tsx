import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listOrders, getOrder, cancelOrder } from "@/lib/api/orders.functions";

const STATUS_LABELS: Record<string, string> = {
  recue: "Reçue",
  en_preparation: "En préparation",
  prete: "Prête",
  servie: "Servie",
  annulee: "Annulée",
};

export function OrdersPanel() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const { data: orders = [] } = useQuery({
    queryKey: ["orders"],
    queryFn: () => listOrders(),
  });

  const { data: detail } = useQuery({
    queryKey: ["order", selectedOrderId],
    queryFn: () => getOrder({ data: { orderId: selectedOrderId! } }),
    enabled: !!selectedOrderId,
  });

  const cancelMutation = useMutation({
    mutationFn: (orderId: string) => cancelOrder({ data: { orderId } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      setSelectedOrderId(null);
    },
  });

  const filtered = orders.filter((o) => statusFilter === "all" || o.status === statusFilter);

  return (
    <section className="mt-6">
      <div className="flex items-center gap-2 mb-3">
        <h2 className="text-xl font-black text-cocoa">Commandes</h2>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="ml-auto rounded-lg border border-cocoa/20 px-3 py-1"
        >
          <option value="all">Tous les statuts</option>
          {Object.entries(STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="text-left border-b border-cocoa/20">
            <th className="py-2">Référence</th>
            <th>Statut</th>
            <th>Type</th>
            <th>Total</th>
            <th>Reçue à</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((order) => (
            <tr key={order.id} className="border-b border-cocoa/10">
              <td className="py-2">{order.reference}</td>
              <td>{STATUS_LABELS[order.status]}</td>
              <td>{order.type === "sur_place" ? "Sur place" : "À emporter"}</td>
              <td>{(order.totalCents / 100).toFixed(2)}€</td>
              <td>{new Date(order.receivedAt).toLocaleString("fr-FR")}</td>
              <td>
                <button
                  onClick={() => setSelectedOrderId(order.id)}
                  className="text-terracotta underline"
                >
                  Détail
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedOrderId && detail && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-black text-cocoa mb-2">{detail.order.reference}</h3>
            <p className="text-sm text-muted-foreground mb-3">
              {STATUS_LABELS[detail.order.status]}
            </p>
            <ul className="text-sm space-y-1 mb-4">
              {detail.items.map((item) => (
                <li key={item.id}>
                  {item.quantity}× {item.name} {item.garniture ? `(${item.garniture})` : ""} —{" "}
                  {(item.unitPriceCents / 100).toFixed(2)}€
                </li>
              ))}
            </ul>
            <div className="flex gap-2">
              {detail.order.status !== "servie" && detail.order.status !== "annulee" && (
                <button
                  onClick={() => cancelMutation.mutate(detail.order.id)}
                  className="rounded-lg bg-red-700 text-white px-4 py-2 font-bold"
                >
                  Annuler la commande
                </button>
              )}
              <button
                onClick={() => setSelectedOrderId(null)}
                className="rounded-lg bg-neutral-200 px-4 py-2"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
