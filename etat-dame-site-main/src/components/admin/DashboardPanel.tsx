import { useQuery } from "@tanstack/react-query";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { getDashboardStats } from "@/lib/api/analytics.functions";

export function DashboardPanel() {
  const { data } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: () => getDashboardStats(),
  });

  if (!data) return null;

  return (
    <section className="mt-8">
      <h2 className="text-xl font-black text-cocoa mb-3">Tableau de bord (7 derniers jours)</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="rounded-xl bg-card p-4 border border-cocoa/14">
          <p className="text-xs text-muted-foreground">Temps moyen prépa</p>
          <p className="text-2xl font-black text-cocoa">{data.avgPrepMinutes.toFixed(1)} min</p>
        </div>
        <div className="rounded-xl bg-card p-4 border border-cocoa/14">
          <p className="text-xs text-muted-foreground">Chiffre d'affaires</p>
          <p className="text-2xl font-black text-cocoa">{(data.revenueCents / 100).toFixed(2)}€</p>
        </div>
      </div>

      <div className="h-64 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data.ordersByDay}>
            <XAxis dataKey="day" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#4a2a18" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <h3 className="text-lg font-bold text-cocoa mb-2">Plats les plus vendus</h3>
      <ul className="text-sm space-y-1">
        {data.topDishes.map((dish) => (
          <li key={dish.name} className="flex justify-between border-b border-cocoa/10 py-1">
            <span>{dish.name}</span>
            <span className="font-bold">{dish.count}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
