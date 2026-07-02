import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { getCurrentUser, logout } from "@/lib/api/auth.functions";
import { BEEP_WAV } from "@/lib/dev/beep";
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
  { status: "recue", label: "Nouvelles", topBar: "bg-orange-500", badge: "bg-orange-500 text-white", colBg: "bg-orange-950/20" },
  { status: "en_preparation", label: "En préparation", topBar: "bg-blue-500", badge: "bg-blue-500 text-white", colBg: "bg-blue-950/20" },
  { status: "prete", label: "Prêtes", topBar: "bg-emerald-500", badge: "bg-emerald-500 text-white", colBg: "bg-emerald-950/20" },
] as const;

const ELAPSED_COLORS: Record<string, { dot: string; border: string; cardBg: string; timeColor: string }> = {
  green:  { dot: "bg-emerald-400", border: "border-l-emerald-400", cardBg: "bg-emerald-950/30",  timeColor: "text-emerald-400" },
  orange: { dot: "bg-orange-400",  border: "border-l-orange-400",  cardBg: "bg-orange-950/30",   timeColor: "text-orange-400" },
  red:    { dot: "bg-red-400",     border: "border-l-red-400",     cardBg: "bg-red-950/40",      timeColor: "text-red-400" },
};

let beepAudio: HTMLAudioElement | null = null;

function playBeep() {
  if (!beepAudio) {
    beepAudio = new Audio(BEEP_WAV);
    beepAudio.volume = 0.7;
  }
  beepAudio.currentTime = 0;
  beepAudio.play().catch(() => {});
}

function KdsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const seenIds = useRef<Set<string>>(new Set());
  const logoutMutation = useMutation({
    mutationFn: () => logout(),
    onSuccess: () => navigate({ to: "/back/login" }),
  });
  const [problemOrderId, setProblemOrderId] = useState<string | null>(null);
  const [problemNote, setProblemNote] = useState("");
  const [soundEnabled, setSoundEnabled] = useState(false);
  const soundEnabledRef = useRef(false);

  function enableSound() {
    const ctx = new AudioContext();
    ctx.resume().then(() => ctx.close());
    setSoundEnabled(true);
    soundEnabledRef.current = true;
  }

  const { data: orders = [] } = useQuery({
    queryKey: ["orders"],
    queryFn: () => listOrders(),
    refetchInterval: 4000,
  });

  useEffect(() => {
    const currentIds = new Set(orders.map((o) => o.id));
    const isFirstLoad = seenIds.current.size === 0;
    const hasNew = !isFirstLoad && orders.some((o) => !seenIds.current.has(o.id));
    if (hasNew && soundEnabledRef.current) playBeep();
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

  const now = new Date();

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/8 bg-[#111]">
        <div className="flex items-center gap-3">
          <span className="text-xl font-black tracking-tight">ÉTAT DAME</span>
          <span className="text-white/30 text-lg">·</span>
          <span className="text-white/50 text-sm font-medium">Écran cuisine</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-white/30 text-sm">
            {now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
          </span>
          <button
            onClick={soundEnabled ? undefined : enableSound}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${soundEnabled ? "bg-green-600/20 text-green-400 border border-green-600/30" : "bg-white/6 text-white/40 border border-white/10 animate-pulse"}`}
          >
            {soundEnabled ? "🔔 Son activé" : "🔕 Son"}
          </button>
          {soundEnabled && (
            <button
              onClick={() => playBeep()}
              className="rounded-lg px-3 py-1.5 text-xs font-bold bg-white/6 border border-white/10 text-white/50"
            >
              Test
            </button>
          )}
          <button
            onClick={() => logoutMutation.mutate()}
            className="rounded-lg px-3 py-1.5 text-xs font-bold bg-white/6 border border-white/10 text-white/50 hover:text-white/80"
          >
            Déconnexion
          </button>
        </div>
      </header>

      {/* Columns */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-0 divide-x divide-white/6">
        {COLUMNS.map((col) => {
          const colOrders = orders.filter((o) => o.status === col.status);
          return (
            <div key={col.status} className={`flex flex-col ${col.colBg}`}>
              {/* Column header */}
              <div className="px-4 pt-0">
                <div className={`h-1 ${col.topBar} rounded-b-full mb-3`} />
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-xs font-black uppercase tracking-widest text-white/60">{col.label}</h2>
                  <span className={`text-xs font-black px-2.5 py-0.5 rounded-full ${col.badge}`}>
                    {colOrders.length}
                  </span>
                </div>
              </div>

              {/* Orders */}
              <div className="flex-1 px-3 pb-3 space-y-3 overflow-y-auto">
                {colOrders.length === 0 && (
                  <p className="text-center text-white/20 text-sm mt-8">Aucune commande</p>
                )}
                {colOrders.map((order) => {
                  const color = elapsedColorBucket(order.receivedAt);
                  const { dot, border, cardBg, timeColor } = ELAPSED_COLORS[color];
                  const receivedAt = new Date(order.receivedAt);
                  const elapsed = Math.floor((now.getTime() - receivedAt.getTime()) / 60000);

                  return (
                    <div
                      key={order.id}
                      className={`rounded-xl ${cardBg} border border-white/10 border-l-4 ${border}`}
                    >
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-1">
                          <span className="text-base font-black tracking-tight text-white">{order.reference}</span>
                          <div className="flex items-center gap-1.5">
                            <span className={`text-xs font-bold ${timeColor}`}>{elapsed}min</span>
                            <span className={`h-2.5 w-2.5 rounded-full ${dot}`} />
                          </div>
                        </div>
                        <p className="text-sm font-medium text-white/70 mb-3">
                          {order.type === "sur_place"
                            ? order.tableNumber ? `🪑 Table ${order.tableNumber}` : "🪑 Sur place"
                            : "📦 À emporter"}
                        </p>
                        {order.problemFlag && (
                          <p className="text-xs text-red-300 font-bold mb-3 bg-red-900/50 border border-red-700/40 rounded-lg px-3 py-2">
                            ⚠ {order.problemNote}
                          </p>
                        )}
                        <div className="flex gap-2">
                          {col.status !== "prete" && (
                            <button
                              onClick={() => advanceMutation.mutate(order.id)}
                              disabled={advanceMutation.isPending}
                              className={`flex-1 rounded-lg py-2.5 text-sm font-black transition-colors disabled:opacity-50 ${
                                col.status === "recue"
                                  ? "bg-orange-500 hover:bg-orange-400 text-white"
                                  : "bg-emerald-500 hover:bg-emerald-400 text-white"
                              }`}
                            >
                              {col.status === "recue" ? "▶ Démarrer" : "✓ Prête"}
                            </button>
                          )}
                          <button
                            onClick={() => setProblemOrderId(order.id)}
                            className="rounded-lg bg-red-900/50 border border-red-700/40 px-3 py-2.5 text-red-300 hover:bg-red-800/60 transition-colors text-base"
                          >
                            ⚠
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Problem modal */}
      {problemOrderId && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-black mb-1">Signaler un problème</h3>
            <p className="text-white/40 text-sm mb-4">Décris le problème rencontré sur cette commande.</p>
            <textarea
              className="w-full rounded-xl bg-white/5 border border-white/10 p-3 mb-4 text-sm placeholder:text-white/20 focus:outline-none focus:border-white/20 resize-none"
              rows={3}
              value={problemNote}
              onChange={(e) => setProblemNote(e.target.value)}
              placeholder="Ex: rupture de bacon, allergie détectée…"
            />
            <div className="flex gap-2">
              <button
                onClick={() => problemOrderId && problemMutation.mutate({ orderId: problemOrderId, note: problemNote })}
                className="flex-1 rounded-xl bg-red-600 hover:bg-red-500 py-3 font-bold transition-colors"
              >
                Confirmer
              </button>
              <button
                onClick={() => setProblemOrderId(null)}
                className="rounded-xl bg-white/8 hover:bg-white/12 px-4 py-3 transition-colors"
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
