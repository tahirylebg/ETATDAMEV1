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

      <div className="rounded-2xl bg-card border border-cocoa/14 p-5 shadow-paper mb-4">
        <h3 className="text-base font-black text-cocoa mb-3">Commandes par jour</h3>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.ordersByDay}>
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#4a2a18" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-2xl bg-card border border-cocoa/14 p-5 shadow-paper">
        <h3 className="text-base font-black text-cocoa mb-3">Plats les plus vendus</h3>
        <ul className="space-y-2">
          {data.topDishes.map((dish, i) => (
            <li key={dish.name} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-xs font-black text-cocoa/30 w-4 shrink-0">{i + 1}</span>
                <span className="text-sm text-cocoa truncate">{dish.name}</span>
              </div>
              <span className="shrink-0 rounded-full bg-cocoa/10 text-cocoa text-xs font-black px-2.5 py-0.5">
                {dish.count}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
