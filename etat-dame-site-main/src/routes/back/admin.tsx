import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getCurrentUser, logout } from "@/lib/api/auth.functions";
import { seedFakeOrders } from "@/lib/api/dev-tools.functions";
import { OrdersPanel } from "@/components/admin/OrdersPanel";
import { DashboardPanel } from "@/components/admin/DashboardPanel";
import { UsersPanel } from "@/components/admin/UsersPanel";

export const Route = createFileRoute("/back/admin")({
  beforeLoad: async () => {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      throw redirect({ to: "/back/login" });
    }
    return { user };
  },
  head: () => ({
    meta: [{ title: "Admin — ÉTAT DAME" }, { name: "robots", content: "noindex,nofollow" }],
  }),
  component: AdminPage,
});

function AdminPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const seedMutation = useMutation({
    mutationFn: () => seedFakeOrders({ data: { count: 8 } }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["orders"] }),
    onError: () => console.error("Erreur seedFakeOrders"),
  });

  const logoutMutation = useMutation({
    mutationFn: () => logout(),
    onSuccess: () => navigate({ to: "/back/login" }),
  });

  return (
    <main className="min-h-screen bg-cream p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black text-cocoa">Back-office admin</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => seedMutation.mutate()}
            disabled={seedMutation.isPending}
            className="rounded-lg border border-cocoa/20 text-cocoa text-sm font-bold px-4 py-2 disabled:opacity-50 hover:bg-cocoa/10"
          >
            {seedMutation.isPending ? "Génération…" : "Simuler des commandes"}
          </button>
          <button
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
            className="rounded-lg bg-cocoa text-cream text-sm font-bold px-4 py-2 disabled:opacity-50"
          >
            Déconnexion
          </button>
        </div>
      </div>
      <OrdersPanel />
      <DashboardPanel />
      <UsersPanel />
    </main>
  );
}
