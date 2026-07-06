import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { createOrder } from "@/lib/api/orders.functions";

const commandeSearchSchema = z.object({
  table: z.string().optional(),
});

export const Route = createFileRoute("/commande")({
  validateSearch: commandeSearchSchema,
  head: () => ({
    meta: [{ title: "Commander — ÉTAT DAME" }, { name: "robots", content: "noindex,nofollow" }],
  }),
  component: CommandePage,
});

type CartItem = {
  key: string;
  name: string;
  category: string;
  unitPriceCents: number;
  quantity: number;
  garniture?: string;
};

// Menu statique inline (évite les imports images de etat-dame.ts)
const MENU_FOOD = [
  {
    category: "Bases",
    items: [
      { name: "Egg'n Deluxe — Aubergine confite", priceCents: 1500 },
      { name: "Egg'n Deluxe — Falafels", priceCents: 1600 },
      { name: "Egg'n Deluxe — Bacon", priceCents: 1600 },
      { name: "Egg'n Deluxe — Saumon gravlax", priceCents: 1700 },
      { name: "Egg'n Deluxe — Poulet mariné", priceCents: 1800 },
      { name: "Egg Roll — Nature", priceCents: 1200 },
      { name: "Egg Roll — Bacon", priceCents: 1600 },
      { name: "Egg Roll — Effiloché de boeuf", priceCents: 1800 },
      { name: "Pancake salé — Saumon gravlax", priceCents: 1700 },
      { name: "Pancake salé — Bacon fumé", priceCents: 1700 },
      { name: "Pancake salé — Effiloché de boeuf", priceCents: 1900 },
      { name: "Avocado Toast — Aubergine confite", priceCents: 1400 },
      { name: "Avocado Toast — Bacon", priceCents: 1600 },
      { name: "Avocado Toast — Saumon gravlax", priceCents: 1700 },
      { name: "Avocado Toast — Poulet mariné", priceCents: 1700 },
    ],
  },
  {
    category: "Gourmandises",
    items: [
      { name: "Shawarma — Poulet mariné", priceCents: 1900 },
      { name: "Shawarma — Effiloché de boeuf", priceCents: 2100 },
      { name: "Yaourt Bowl — Classic", priceCents: 1200 },
      { name: "Yaourt Bowl — Crème de Bueno", priceCents: 1300 },
      { name: "Yaourt Bowl — Crème de pistache", priceCents: 1600 },
      { name: "Pancake sucré — Caramel beurre salé", priceCents: 1500 },
      { name: "Pancake sucré — Nutella banane", priceCents: 1500 },
      { name: "Pancake sucré — Mangue rôtie", priceCents: 1600 },
      { name: "Pancake sucré — Crème Bueno", priceCents: 1600 },
      { name: "Pancake sucré — Crème pistache", priceCents: 1700 },
      { name: "Cake perdu", priceCents: 1200 },
      { name: "Cookie — Caramel beurre salé", priceCents: 500 },
      { name: "Cookie — Crème de pistache", priceCents: 500 },
    ],
  },
];

const MENU_DRINKS = [
  {
    category: "Cafés & Thés",
    items: [
      { name: "Café court", priceCents: 300 },
      { name: "Café long", priceCents: 400 },
      { name: "American Breakfast", priceCents: 500 },
      { name: "Thé à la menthe", priceCents: 500 },
      { name: "Chaï latte", priceCents: 700 },
    ],
  },
  {
    category: "Lattes glacés",
    items: [
      { name: "Iced coffee latte", priceCents: 600 },
      { name: "Iced mango latte", priceCents: 700 },
      { name: "Iced passion latte", priceCents: 800 },
      { name: "Iced pistachio latte", priceCents: 800 },
      { name: "Matcha latte", priceCents: 600 },
      { name: "Iced matcha latte", priceCents: 600 },
      { name: "Iced berry matcha", priceCents: 700 },
      { name: "Iced mango matcha", priceCents: 800 },
    ],
  },
  {
    category: "Limonades & Jus",
    items: [
      { name: "Limonade citron vert", priceCents: 500 },
      { name: "Limonade orange sanguine", priceCents: 600 },
      { name: "Limonade passion", priceCents: 700 },
      { name: "Jus passion", priceCents: 600 },
      { name: "Jus fruit du dragon", priceCents: 700 },
      { name: "Eau Orezza", priceCents: 500 },
      { name: "Bière Corona", priceCents: 600 },
    ],
  },
];

const MENU_COCKTAILS = [
  {
    category: "Cocktails signature",
    items: [
      { name: "Mango Passion", priceCents: 1100 },
      { name: "Espresso Martini", priceCents: 1500 },
      { name: "Koso Dry", priceCents: 1300 },
      { name: "Ginger'n Matcha", priceCents: 1500 },
      { name: "Pitaya bliss", priceCents: 1300 },
      { name: "Mexican Kick", priceCents: 1200 },
      { name: "Tiramisu", priceCents: 1500 },
      { name: "Miel & Tabac", priceCents: 1300 },
      { name: "Fresh Gin", priceCents: 1500 },
      { name: "Sakura Negroni", priceCents: 1500 },
      { name: "Pink Panther", priceCents: 1500 },
    ],
  },
];

const TABS = [
  { id: "food" as const, label: "Carte" },
  { id: "drinks" as const, label: "Boissons" },
  { id: "cocktails" as const, label: "Cocktails" },
];

function CommandePage() {
  const { table } = Route.useSearch();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"food" | "drinks" | "cocktails">("food");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [notes, setNotes] = useState("");
  const [showCart, setShowCart] = useState(false);

  const totalCents = cart.reduce((s, i) => s + i.unitPriceCents * i.quantity, 0);
  const totalItems = cart.reduce((s, i) => s + i.quantity, 0);

  function addItem(key: string, name: string, category: string, priceCents: number) {
    setCart((prev) => {
      const existing = prev.find((c) => c.key === key);
      if (existing) return prev.map((c) => c.key === key ? { ...c, quantity: c.quantity + 1 } : c);
      return [...prev, { key, name, category, unitPriceCents: priceCents, quantity: 1 }];
    });
  }

  function removeItem(key: string) {
    setCart((prev) => {
      const existing = prev.find((c) => c.key === key);
      if (!existing) return prev;
      if (existing.quantity === 1) return prev.filter((c) => c.key !== key);
      return prev.map((c) => c.key === key ? { ...c, quantity: c.quantity - 1 } : c);
    });
  }

  const orderMutation = useMutation({
    mutationFn: () =>
      createOrder({
        data: {
          type: table ? "sur_place" : "a_emporter",
          tableNumber: table,
          notes: notes || undefined,
          items: cart.map((c) => ({
            name: c.name,
            category: c.category,
            unitPriceCents: c.unitPriceCents,
            quantity: c.quantity,
            garniture: c.garniture,
          })),
        },
      }),
    onSuccess: (res) => {
      navigate({ to: "/commande-confirmation", search: { ref: res.orderId, table } });
    },
  });

  const currentMenu = tab === "food" ? MENU_FOOD : tab === "drinks" ? MENU_DRINKS : MENU_COCKTAILS;

  return (
    <main className="min-h-screen bg-cream pb-32">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-cream/95 backdrop-blur border-b border-cocoa/10 px-4 py-3 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-terracotta uppercase tracking-widest">ÉTAT DAME</p>
          <p className="text-sm font-black text-cocoa">{table ? `Table ${table}` : "À emporter"}</p>
        </div>
        <button
          onClick={() => setShowCart(true)}
          className="relative rounded-full bg-cocoa text-cream font-black px-4 py-2 text-sm"
          aria-label={`Voir le panier, ${totalItems} article${totalItems > 1 ? "s" : ""}`}
        >
          Panier
          {totalItems > 0 && (
            <span className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-terracotta text-white text-xs font-black flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </button>
      </header>

      {/* Tabs */}
      <div className="flex gap-2 px-4 pt-4 pb-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            aria-pressed={tab === t.id}
            className={`rounded-full px-4 py-1.5 text-sm font-bold transition-colors ${
              tab === t.id ? "bg-cocoa text-cream" : "bg-cocoa/8 text-cocoa/60 hover:bg-cocoa/14"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Menu */}
      <div className="px-4 space-y-6 pt-2">
        {currentMenu.map((group) => (
          <section key={group.category}>
            <h2 className="text-base font-black text-cocoa mb-2 uppercase tracking-wide text-xs text-cocoa/50">{group.category}</h2>
            <div className="space-y-2">
              {group.items.map((item) => {
                const key = `${group.category}::${item.name}`;
                const inCart = cart.find((c) => c.key === key);
                return (
                  <div
                    key={item.name}
                    className="flex items-center justify-between rounded-xl bg-card border border-cocoa/10 px-4 py-3 gap-3"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-cocoa">{item.name}</p>
                      <p className="text-sm font-black text-terracotta mt-0.5">{(item.priceCents / 100).toFixed(2)}€</p>
                    </div>
                    {inCart ? (
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => removeItem(key)}
                          aria-label={`Retirer un ${item.name}`}
                          className="h-8 w-8 rounded-full bg-cocoa/10 text-cocoa font-black text-lg flex items-center justify-center"
                        >−</button>
                        <span className="text-sm font-black text-cocoa w-4 text-center">{inCart.quantity}</span>
                        <button
                          onClick={() => addItem(key, item.name, group.category, item.priceCents)}
                          aria-label={`Ajouter un ${item.name}`}
                          className="h-8 w-8 rounded-full bg-cocoa text-cream font-black text-lg flex items-center justify-center"
                        >+</button>
                      </div>
                    ) : (
                      <button
                        onClick={() => addItem(key, item.name, group.category, item.priceCents)}
                        aria-label={`Ajouter ${item.name} au panier`}
                        className="shrink-0 h-8 w-8 rounded-full bg-cocoa text-cream font-black text-lg flex items-center justify-center"
                      >+</button>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {/* Cart drawer */}
      {showCart && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cart-title"
          className="fixed inset-0 z-40 flex flex-col justify-end"
        >
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowCart(false)} />
          <div className="relative bg-cream rounded-t-3xl p-5 max-h-[80vh] overflow-y-auto">
            <h2 id="cart-title" className="text-lg font-black text-cocoa mb-4">Mon panier</h2>

            {cart.length === 0 ? (
              <p className="text-cocoa/40 text-sm text-center py-8">Ton panier est vide.</p>
            ) : (
              <>
                <ul className="space-y-2 mb-4">
                  {cart.map((item) => (
                    <li key={item.key} className="flex items-center justify-between gap-3 rounded-xl bg-card border border-cocoa/10 px-4 py-3">
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-cocoa truncate">{item.name}</p>
                        <p className="text-xs text-cocoa/40">{item.category}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button onClick={() => removeItem(item.key)} aria-label={`Retirer ${item.name}`}
                          className="h-7 w-7 rounded-full bg-cocoa/10 text-cocoa font-black flex items-center justify-center text-base">−</button>
                        <span className="text-sm font-black text-cocoa w-4 text-center">{item.quantity}</span>
                        <button onClick={() => addItem(item.key, item.name, item.category, item.unitPriceCents)} aria-label={`Ajouter ${item.name}`}
                          className="h-7 w-7 rounded-full bg-cocoa text-cream font-black flex items-center justify-center text-base">+</button>
                        <span className="text-sm font-bold text-cocoa w-14 text-right">
                          {((item.unitPriceCents * item.quantity) / 100).toFixed(2)}€
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="mb-3">
                  <label htmlFor="order-notes" className="block text-xs font-bold text-cocoa/60 mb-1 uppercase tracking-wide">Note (optionnel)</label>
                  <textarea
                    id="order-notes"
                    className="w-full rounded-xl border border-cocoa/20 bg-white px-3 py-2 text-sm placeholder:text-cocoa/30 focus:outline-none resize-none"
                    rows={2}
                    placeholder="Allergie, préférence…"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>

                <div className="flex items-center justify-between mb-4 pt-2 border-t border-cocoa/10">
                  <span className="font-black text-cocoa">Total</span>
                  <span className="font-black text-cocoa text-lg">{(totalCents / 100).toFixed(2)}€</span>
                </div>

                {orderMutation.isError && (
                  <p role="alert" className="text-red-600 text-sm mb-3">Une erreur est survenue. Réessaie.</p>
                )}

                <button
                  onClick={() => orderMutation.mutate()}
                  disabled={orderMutation.isPending}
                  className="w-full rounded-full bg-cocoa text-cream font-black py-4 text-base disabled:opacity-60"
                >
                  {orderMutation.isPending ? "Envoi…" : `Commander · ${(totalCents / 100).toFixed(2)}€`}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Bottom bar */}
      {totalItems > 0 && !showCart && (
        <div className="fixed bottom-0 inset-x-0 z-30 p-4 bg-gradient-to-t from-cream via-cream/90 to-transparent">
          <button
            onClick={() => setShowCart(true)}
            className="w-full rounded-full bg-cocoa text-cream font-black py-4 text-base shadow-warm"
          >
            Voir le panier · {totalItems} article{totalItems > 1 ? "s" : ""} · {(totalCents / 100).toFixed(2)}€
          </button>
        </div>
      )}
    </main>
  );
}
