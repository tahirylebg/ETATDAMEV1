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

function printTicket(detail: { order: { reference: string; type: string; tableNumber?: string | null; totalCents: number; receivedAt: string; notes?: string | null }; items: { id: string; quantity: number; name: string; garniture?: string | null; unitPriceCents: number }[] }) {
  const { order, items } = detail;
  const win = window.open("", "_blank", "width=400,height=600");
  if (!win) return;
  win.document.write(`<!DOCTYPE html><html><head><title>Ticket ${order.reference}</title>
  <style>body{font-family:monospace;font-size:14px;margin:20px}hr{border:1px dashed #000}.total{font-weight:bold;font-size:16px}</style>
  </head><body>
  <h2 style="text-align:center">ÉTAT DAME</h2>
  <hr/>
  <p><b>${order.reference}</b></p>
  <p>${order.type === "sur_place" ? (order.tableNumber ? `Table ${order.tableNumber}` : "Sur place") : "À emporter"}</p>
  <p>${new Date(order.receivedAt).toLocaleString("fr-FR")}</p>
  <hr/>
  ${items.map(i => `<p>${i.quantity}× ${i.name}${i.garniture ? ` (${i.garniture})` : ""} <span style="float:right">${(i.unitPriceCents / 100).toFixed(2)}€</span></p>`).join("")}
  <hr/>
  <p class="total">Total <span style="float:right">${(order.totalCents / 100).toFixed(2)}€</span></p>
  ${order.notes ? `<hr/><p><i>Note : ${order.notes}</i></p>` : ""}
  <script>window.onload=()=>{window.print();window.close();}</script>
  </body></html>`);
  win.document.close();
}

function exportCSV(orders: { reference: string; status: string; type: string; totalCents: number; receivedAt: string }[]) {
  const header = "Référence,Statut,Type,Total (€),Reçue à";
  const rows = orders.map(o =>
    [o.reference, STATUS_LABELS[o.status], o.type === "sur_place" ? "Sur place" : "À emporter", (o.totalCents / 100).toFixed(2), new Date(o.receivedAt).toLocaleString("fr-FR")].join(",")
  );
  const csv = [header, ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `commandes-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function OrdersPanel() {
  const queryClient = useQueryClient();
  const today = new Date().toISOString().slice(0, 10);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState(today);
  const [dateTo, setDateTo] = useState(today);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [cancelNote, setCancelNote] = useState("");
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const { data: orders = [] } = useQuery({
    queryKey: ["orders", dateFrom, dateTo],
    queryFn: () => listOrders({ data: { dateFrom, dateTo } }),
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
      setShowCancelConfirm(false);
      setCancelNote("");
    },
  });

  const filtered = orders.filter((o) => {
    const matchStatus = statusFilter === "all" || o.status === statusFilter;
    const matchSearch = search === "" || o.reference.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <section className="mt-6">
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <h2 className="text-xl font-black text-cocoa">Commandes</h2>
        <label htmlFor="orders-date-from" className="sr-only">Du</label>
        <input id="orders-date-from" type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
          className="rounded-lg border border-cocoa/20 px-3 py-1 text-sm" />
        <span className="text-cocoa/40 text-sm" aria-hidden="true">→</span>
        <label htmlFor="orders-date-to" className="sr-only">Au</label>
        <input id="orders-date-to" type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
          className="rounded-lg border border-cocoa/20 px-3 py-1 text-sm" />
        <label htmlFor="orders-search" className="sr-only">Rechercher par référence</label>
        <input
          id="orders-search"
          type="text"
          placeholder="Rechercher…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-lg border border-cocoa/20 px-3 py-1 text-sm"
        />
        <label htmlFor="orders-status" className="sr-only">Filtrer par statut</label>
        <select
          id="orders-status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-cocoa/20 px-3 py-1 text-sm"
        >
          <option value="all">Tous les statuts</option>
          {Object.entries(STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
        <button
          onClick={() => exportCSV(filtered)}
          className="ml-auto rounded-lg border border-cocoa/20 px-3 py-1 text-sm font-bold hover:bg-cocoa/10"
        >
          Export CSV
        </button>
      </div>

      <div className="rounded-2xl border border-cocoa/14 bg-card shadow-paper overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-cocoa/6 text-left">
              <th className="px-4 py-3 font-black text-cocoa/70 text-xs uppercase tracking-wide">Référence</th>
              <th className="px-4 py-3 font-black text-cocoa/70 text-xs uppercase tracking-wide">Statut</th>
              <th className="px-4 py-3 font-black text-cocoa/70 text-xs uppercase tracking-wide">Type</th>
              <th className="px-4 py-3 font-black text-cocoa/70 text-xs uppercase tracking-wide">Total</th>
              <th className="px-4 py-3 font-black text-cocoa/70 text-xs uppercase tracking-wide">Reçue à</th>
              <th className="px-4 py-3" aria-label="Actions"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cocoa/8">
            {filtered.map((order) => (
              <tr key={order.id} className="hover:bg-cocoa/4 transition-colors">
                <td className="px-4 py-3 font-mono font-bold text-cocoa text-xs">{order.reference}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold ${
                    order.status === "recue"         ? "bg-orange-100 text-orange-700" :
                    order.status === "en_preparation" ? "bg-blue-100 text-blue-700" :
                    order.status === "prete"          ? "bg-emerald-100 text-emerald-700" :
                    order.status === "servie"         ? "bg-cocoa/10 text-cocoa/60" :
                                                        "bg-red-100 text-red-700"
                  }`}>
                    {STATUS_LABELS[order.status]}
                  </span>
                </td>
                <td className="px-4 py-3 text-cocoa/70">{order.type === "sur_place" ? "🪑 Sur place" : "📦 À emporter"}</td>
                <td className="px-4 py-3 font-bold text-cocoa">{(order.totalCents / 100).toFixed(2)}€</td>
                <td className="px-4 py-3 text-cocoa/50 text-xs">{new Date(order.receivedAt).toLocaleString("fr-FR")}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => setSelectedOrderId(order.id)}
                    className="rounded-lg bg-cocoa/8 hover:bg-cocoa/14 text-cocoa text-xs font-bold px-3 py-1.5 transition-colors"
                  >
                    Détail
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedOrderId && detail && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="order-dialog-title"
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
        >
          <div className="bg-card rounded-2xl p-6 w-full max-w-md">
            <h3 id="order-dialog-title" className="text-lg font-black text-cocoa mb-1">{detail.order.reference}</h3>
            <p className="text-sm text-muted-foreground mb-3">{STATUS_LABELS[detail.order.status]}</p>
            <ul className="text-sm space-y-1 mb-4">
              {detail.items.map((item) => (
                <li key={item.id}>
                  {item.quantity}× {item.name} {item.garniture ? `(${item.garniture})` : ""} —{" "}
                  {(item.unitPriceCents / 100).toFixed(2)}€
                </li>
              ))}
            </ul>

            {showCancelConfirm ? (
              <div className="mb-4">
                <label htmlFor="cancel-note" className="block text-sm font-bold text-red-700 mb-2">Motif d'annulation (optionnel)</label>
                <textarea
                  id="cancel-note"
                  className="w-full rounded-lg border border-cocoa/20 p-2 text-sm mb-2"
                  rows={2}
                  placeholder="Ex: client absent, rupture produit…"
                  value={cancelNote}
                  onChange={(e) => setCancelNote(e.target.value)}
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => cancelMutation.mutate(detail.order.id)}
                    className="flex-1 rounded-lg bg-red-700 text-white px-4 py-2 font-bold"
                  >
                    Confirmer l'annulation
                  </button>
                  <button
                    onClick={() => { setShowCancelConfirm(false); setCancelNote(""); }}
                    className="rounded-lg bg-neutral-200 px-4 py-2"
                  >
                    Retour
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => printTicket(detail)}
                  className="rounded-lg bg-cocoa text-cream px-4 py-2 font-bold"
                >
                  🖨 Imprimer
                </button>
                {detail.order.status !== "servie" && detail.order.status !== "annulee" && (
                  <button
                    onClick={() => setShowCancelConfirm(true)}
                    className="rounded-lg bg-red-700 text-white px-4 py-2 font-bold"
                  >
                    Annuler
                  </button>
                )}
                <button
                  onClick={() => { setSelectedOrderId(null); setShowCancelConfirm(false); }}
                  className="rounded-lg bg-neutral-200 px-4 py-2"
                >
                  Fermer
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
