import { createFileRoute } from "@tanstack/react-router";
import React from "react";
import {
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  Mail,
  Phone,
  QrCode,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";

import { EMAIL, PHONE, PHONE_DISPLAY, SITE_URL } from "@/lib/etat-dame";

export const Route = createFileRoute("/securite")({
  head: () => ({
    meta: [
      { title: "Sécurité ÉTAT DAME, anti-arnaque et QR code officiel" },
      {
        name: "description",
        content:
          "Conseils de sécurité ÉTAT DAME: vérifier le site officiel, éviter les faux QR codes, les faux paiements et les tentatives d'hameçonnage.",
      },
    ],
    links: [{ rel: "canonical", href: "/securite" }],
  }),
  component: SecurityPage,
});

function SecurityPage() {
  return (
    <main className="min-h-screen bg-cream px-5 py-8 text-cocoa sm:px-8">
      <div className="mx-auto max-w-5xl">
        <a
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-cocoa/12 bg-card px-4 py-2 text-sm font-bold text-cocoa transition-colors hover:bg-cocoa/6"
        >
          <ArrowLeft className="h-4 w-4" />
          Accueil
        </a>

        <section className="mt-12 overflow-hidden rounded-[2rem] border border-cocoa/12 bg-card shadow-paper">
          <div className="grid gap-8 p-6 sm:p-9 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="section-kicker text-terracotta">Sécurité</p>
              <h1 className="heading-readable mt-3 text-5xl text-cocoa sm:text-6xl">
                QR code officiel, pas d'arnaque.
              </h1>
              <p className="mt-5 leading-relaxed text-cocoa/74">
                Cette page aide à reconnaître le vrai site ÉTAT DAME et à éviter les faux QR codes,
                faux liens de réservation, faux paiements et messages frauduleux.
              </p>

              <div className="mt-7 rounded-[1.35rem] bg-cocoa p-5 text-cream">
                <p className="inline-flex items-center gap-2 font-black">
                  <ShieldCheck className="h-5 w-5" strokeWidth={1.7} />
                  Règle simple
                </p>
                <p className="mt-3 text-sm leading-relaxed text-cream/84">
                  ÉTAT DAME ne demande jamais de code bancaire, de mot de passe, de virement urgent
                  ou de paiement par lien pour consulter le menu.
                </p>
              </div>
            </div>

            <div className="grid gap-4">
              <SecurityCard icon={QrCode} title="Vérifier le QR code">
                Le QR doit ouvrir le domaine officiel: <span className="font-bold">{SITE_URL}</span>{" "}
                ou une URL communiquée directement par ÉTAT DAME. Si l'adresse semble étrange,
                quittez la page.
              </SecurityCard>

              <SecurityCard icon={ShieldAlert} title="Reconnaître une tentative d'hameçonnage">
                Méfiez-vous des messages qui promettent une réduction, demandent un paiement rapide,
                réclament un code reçu par SMS ou poussent à cliquer sur un lien raccourci.
              </SecurityCard>

              <SecurityCard icon={CheckCircle2} title="Réservation">
                Une demande de réservation envoyée depuis le site n'est confirmée qu'après réponse
                de l'équipe. Aucun acompte n'est demandé par ce site.
              </SecurityCard>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-5 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-cocoa/12 bg-card p-6 shadow-paper sm:p-8">
            <h2 className="font-serif text-3xl text-cocoa">En cas de doute</h2>
            <div className="mt-5 grid gap-3">
              <a
                href={`tel:${PHONE}`}
                className="inline-flex items-center justify-between gap-4 rounded-2xl border border-cocoa/12 bg-cream/65 px-5 py-4 text-cocoa transition-colors hover:bg-beige/55"
              >
                <span className="inline-flex items-center gap-3 font-semibold">
                  <Phone className="h-5 w-5" strokeWidth={1.6} />
                  Appeler ÉTAT DAME
                </span>
                <span className="font-bold">{PHONE_DISPLAY}</span>
              </a>
              <a
                href={`mailto:${EMAIL}`}
                className="inline-flex items-center justify-between gap-4 rounded-2xl border border-cocoa/12 bg-cream/65 px-5 py-4 text-cocoa transition-colors hover:bg-beige/55"
              >
                <span className="inline-flex items-center gap-3 font-semibold">
                  <Mail className="h-5 w-5" strokeWidth={1.6} />
                  Écrire
                </span>
                <span className="font-bold">{EMAIL}</span>
              </a>
            </div>
          </div>

          <div className="rounded-[2rem] border border-cocoa/12 bg-card p-6 shadow-paper sm:p-8">
            <h2 className="font-serif text-3xl text-cocoa">Signaler une arnaque</h2>
            <p className="mt-4 leading-relaxed text-cocoa/74">
              Si vous pensez avoir scanné un faux QR code ou reçu un faux message, gardez une
              capture et contactez le restaurant. Vous pouvez aussi consulter les conseils officiels
              de Cybermalveillance.
            </p>
            <a
              href="https://www.cybermalveillance.gouv.fr/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-cocoa px-5 py-3 text-sm font-bold text-cream shadow-warm transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
            >
              cybermalveillance.gouv.fr
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}

function SecurityCard({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <article className="rounded-[1.5rem] border border-cocoa/12 bg-cream/62 p-5">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-cocoa text-cream">
          <Icon className="h-5 w-5" strokeWidth={1.6} />
        </span>
        <h2 className="text-lg font-black text-cocoa">{title}</h2>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-cocoa/74">{children}</p>
    </article>
  );
}
