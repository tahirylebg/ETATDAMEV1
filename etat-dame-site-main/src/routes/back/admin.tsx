import { createFileRoute, redirect } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getCurrentUser } from "@/lib/api/auth.functions";
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
  const queryClient = useQueryClient();
  const seedMutation = useMutation({
    mutationFn: () => seedFakeOrders({ data: { count: 8 } }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["orders"] }),
  });

  return (
    <main className="min-h-screen bg-cream p-6">
      <h1 className="text-2xl font-black text-cocoa mb-4">Back-office admin (en construction)</h1>
      <OrdersPanel />
      <DashboardPanel />
      <UsersPanel />
      {import.meta.env.DEV && (
        <button
          onClick={() => seedMutation.mutate()}
          className="rounded-lg bg-cocoa text-cream font-bold px-4 py-2"
        >
          Simuler des commandes
        </button>
      )}
    </main>
  );
}
