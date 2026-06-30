import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { EMAIL, PHONE, SITE_URL } from "../lib/etat-dame";

function NotFoundComponent() {
  return (
    <div className="paper-grain flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="max-w-lg rounded-[2rem] border border-cocoa/12 bg-card p-7 text-center shadow-paper sm:p-10">
        <p className="section-kicker text-terracotta">Page introuvable</p>
        <h1 className="heading-readable mt-3 text-6xl text-cocoa">404</h1>
        <p className="mx-auto mt-4 max-w-sm leading-relaxed text-muted-foreground">
          Cette adresse ne correspond à aucune page ÉTAT DAME. Le menu et la réservation restent
          accessibles depuis l'accueil.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-warm transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
        >
          Revenir à l'accueil
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="paper-grain flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="max-w-lg rounded-[2rem] border border-cocoa/12 bg-card p-7 text-center shadow-paper sm:p-10">
        <p className="section-kicker text-terracotta">Incident temporaire</p>
        <h1 className="heading-readable mt-3 text-4xl text-cocoa">Une erreur est survenue</h1>
        <p className="mx-auto mt-4 max-w-sm leading-relaxed text-muted-foreground">
          La page n'a pas pu se charger correctement. Réessayez ou revenez à l'accueil.
        </p>
        <button
          onClick={() => {
            router.invalidate();
            reset();
          }}
          className="mt-6 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-warm transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
        >
          Réessayer
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "ÉTAT DAME, brunch fait maison à Nîmes" },
      {
        name: "description",
        content:
          "ÉTAT DAME, brunch fait maison, produits frais et de saison à Nîmes. Menu détaillé, bases gourmandes, garnitures et réservation rapide.",
      },
      { name: "author", content: "ÉTAT DAME" },
      { name: "theme-color", content: "#4a2a18" },
      { property: "og:title", content: "ÉTAT DAME, brunch fait maison à Nîmes" },
      {
        property: "og:description",
        content: "Consultez la carte digitale ÉTAT DAME, plats, boissons et infos pratiques.",
      },
      { property: "og:type", content: "restaurant" },
      { property: "og:locale", content: "fr_FR" },
      { property: "og:site_name", content: "ÉTAT DAME" },
      { property: "og:url", content: SITE_URL },
      { property: "og:image", content: `${SITE_URL}/og-image.jpg` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: `${SITE_URL}/og-image.jpg` },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.svg" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Restaurant",
          name: "ÉTAT DAME",
          image: "/og-image.jpg",
          description: "Brunch fait maison, produits frais et de saison à Nîmes.",
          servesCuisine: ["Brunch", "Cuisine maison", "Café"],
          priceRange: "€€",
          address: {
            "@type": "PostalAddress",
            streetAddress: "12 Rue Littré",
            addressLocality: "Nîmes",
            postalCode: "30000",
            addressCountry: "FR",
          },
          url: SITE_URL,
          telephone: PHONE,
          email: EMAIL,
          sameAs: ["https://www.instagram.com/Etatdame_Brunch/"],
          hasMenu: {
            "@type": "Menu",
            name: "Menu brunch ÉTAT DAME",
            hasMenuSection: [
              {
                "@type": "MenuSection",
                name: "Bases gourmandes",
                hasMenuItem: [
                  {
                    "@type": "MenuItem",
                    name: "Egg'n Deluxe",
                    offers: { "@type": "Offer", price: "15", priceCurrency: "EUR" },
                  },
                  {
                    "@type": "MenuItem",
                    name: "Pancake salé",
                    offers: { "@type": "Offer", price: "15", priceCurrency: "EUR" },
                  },
                  {
                    "@type": "MenuItem",
                    name: "Avocado Toast",
                    offers: { "@type": "Offer", price: "14", priceCurrency: "EUR" },
                  },
                ],
              },
            ],
          },
          openingHoursSpecification: [
            {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: "Monday",
              opens: "11:00",
              closes: "15:00",
            },
            {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: "Thursday",
              opens: "11:00",
              closes: "15:00",
            },
            {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: "Thursday",
              opens: "18:30",
              closes: "23:00",
            },
            {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: "Friday",
              opens: "11:00",
              closes: "15:00",
            },
            {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: "Friday",
              opens: "18:30",
              closes: "23:00",
            },
            {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: "Saturday",
              opens: "11:00",
              closes: "15:00",
            },
            {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: "Saturday",
              opens: "18:30",
              closes: "23:00",
            },
            {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: "Sunday",
              opens: "11:00",
              closes: "15:00",
            },
          ],
          acceptsReservations: "True",
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
