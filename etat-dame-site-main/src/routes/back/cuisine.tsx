import { createFileRoute, redirect } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { getCurrentUser } from "@/lib/api/auth.functions";
import { listOrders, updateOrderStatus, flagOrderProblem } from "@/lib/api/orders.functions";
import { elapsedColorBucket } from "@/lib/orders/status";

export const Route = createFileRoute("/back/cuisine")({
  beforeLoad: async () => {
    const user = await getCurrentUser();
    if (!user || user.role !== "cuisine") {
      throw redirect({ to: "/back/login" });
    }
    return { user };
  },
  head: () => ({
    meta: [{ title: "Cuisine — ÉTAT DAME" }, { name: "robots", content: "noindex,nofollow" }],
  }),
  component: KdsPage,
});

const COLUMNS = [
  { status: "recue", label: "Nouvelles" },
  { status: "en_preparation", label: "En préparation" },
  { status: "prete", label: "Prêtes" },
] as const;

const COLOR_CLASSES: Record<string, string> = {
  green: "bg-green-600",
  orange: "bg-orange-500",
  red: "bg-red-600",
};

function playBeep() {
  const ctx = new AudioContext();
  const osc = ctx.createOscillator();
  osc.frequency.value = 880;
  osc.connect(ctx.destination);
  osc.start();
  setTimeout(() => {
    osc.stop();
    ctx.close();
  }, 200);
}

function KdsPage() {
  const queryClient = useQueryClient();
  const seenIds = useRef<Set<string>>(new Set());
  const [problemOrderId, setProblemOrderId] = useState<string | null>(null);
  const [problemNote, setProblemNote] = useState("");

  const { data: orders = [] } = useQuery({
    queryKey: ["orders"],
    queryFn: () => listOrders(),
    refetchInterval: 4000,
  });

  useEffect(() => {
    const currentIds = new Set(orders.map((o) => o.id));
    const isFirstLoad = seenIds.current.size === 0;
    const hasNew = !isFirstLoad && orders.some((o) => !seenIds.current.has(o.id));
    if (hasNew) playBeep();
    seenIds.current = currentIds;
  }, [orders]);

  const advanceMutation = useMutation({
    mutationFn: (orderId: string) => updateOrderStatus({ data: { orderId } }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["orders"] }),
  });

  const problemMutation = useMutation({
    mutationFn: (vars: { orderId: string; note: string }) => flagOrderProblem({ data: vars }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      setProblemOrderId(null);
      setProblemNote("");
    },
  });

  return (
    <main className="min-h-screen bg-neutral-950 text-white p-4">
      <h1 className="text-3xl font-black mb-4">Écran cuisine</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {COLUMNS.map((col) => (
          <div key={col.status} className="bg-neutral-900 rounded-2xl p-3">
            <h2 className="text-xl font-bold mb-3">{col.label}</h2>
            <div className="space-y-3">
              {orders
                .filter((o) => o.status === col.status)
                .map((order) => {
                  const color = elapsedColorBucket(order.receivedAt);
                  return (
                    <div key={order.id} className="rounded-xl bg-neutral-800 p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-lg font-bold">{order.reference}</span>
                        <span
                          className={`text-xs font-bold px-2 py-1 rounded-full ${COLOR_CLASSES[color]}`}
                        >
                          {color}
                        </span>
                      </div>
                      <p className="text-sm text-neutral-300 mb-2">
                        {order.type === "sur_place"
                          ? `Table ${order.tableNumber ?? "?"}`
                          : "À emporter"}
                      </p>
                      {order.problemFlag && (
                        <p className="text-sm text-red-400 font-bold mb-2">⚠ {order.problemNote}</p>
                      )}
                      <div className="flex gap-2">
                        {col.status !== "prete" && (
                          <button
                            onClick={() => advanceMutation.mutate(order.id)}
                            className="flex-1 rounded-lg bg-green-600 py-3 text-lg font-bold"
                          >
                            Étape suivante
                          </button>
                        )}
                        <button
                          onClick={() => setProblemOrderId(order.id)}
                          className="rounded-lg bg-red-700 px-4 py-3 text-lg font-bold"
                        >
                          ⚠
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        ))}
      </div>

      {problemOrderId && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-neutral-900 rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-3">Signaler un problème</h3>
            <textarea
              className="w-full rounded-lg bg-neutral-800 p-3 mb-3"
              value={problemNote}
              onChange={(e) => setProblemNote(e.target.value)}
              placeholder="Ex: rupture de bacon"
            />
            <div className="flex gap-2">
              <button
                onClick={() =>
                  problemOrderId &&
                  problemMutation.mutate({ orderId: problemOrderId, note: problemNote })
                }
                className="flex-1 rounded-lg bg-red-700 py-3 font-bold"
              >
                Confirmer
              </button>
              <button
                onClick={() => setProblemOrderId(null)}
                className="rounded-lg bg-neutral-700 px-4 py-3"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
