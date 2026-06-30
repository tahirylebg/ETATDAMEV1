import { createFileRoute } from "@tanstack/react-router";
import React from "react";
import { ArrowLeft, ExternalLink } from "lucide-react";

import { EMAIL, RESERVATION_URL, SITE_URL } from "@/lib/etat-dame";

export const Route = createFileRoute("/confidentialite")({
  head: () => ({
    meta: [
      { title: "Confidentialité ÉTAT DAME" },
      {
        name: "description",
        content: "Politique de confidentialité du site ÉTAT DAME.",
      },
    ],
    links: [{ rel: "canonical", href: "/confidentialite" }],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <main className="min-h-screen bg-cream px-5 py-8 text-cocoa sm:px-8">
      <div className="mx-auto max-w-4xl">
        <a
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-cocoa/12 bg-card px-4 py-2 text-sm font-bold text-cocoa transition-colors hover:bg-cocoa/6"
        >
          <ArrowLeft className="h-4 w-4" />
          Accueil
        </a>

        <section className="mt-12 rounded-[2rem] border border-cocoa/12 bg-card p-6 shadow-paper sm:p-9">
          <p className="section-kicker text-terracotta">Données personnelles</p>
          <h1 className="heading-readable mt-3 text-5xl text-cocoa sm:text-6xl">
            Politique de confidentialité.
          </h1>
          <p className="mt-5 max-w-2xl leading-relaxed text-cocoa/74">
            Cette page explique quelles informations sont collectées par le site ÉTAT DAME et
            comment elles sont utilisées. Le site ne propose pas de paiement en ligne et ne demande
            jamais de données bancaires.
          </p>
          <div className="mt-8 grid gap-6 text-sm leading-relaxed text-cocoa/76 sm:text-base">
            <PolicyBlock title="Responsable du traitement">
              <p>
                Le responsable du traitement est ÉTAT DAME, joignable à{" "}
                <a href={`mailto:${EMAIL}`} className="font-semibold text-cocoa hover:underline">
                  {EMAIL}
                </a>
                . Site officiel: {SITE_URL}.
              </p>
            </PolicyBlock>

            <PolicyBlock title="Données collectées">
              <p>
                Le site ÉTAT DAME ne collecte pas directement les informations de réservation. Le
                bouton de réservation redirige vers SumUp Bookings, où les données nécessaires au
                choix du créneau et à la confirmation sont traitées par SumUp et l'équipe ÉTAT DAME.
              </p>
            </PolicyBlock>

            <PolicyBlock title="Finalités et base légale">
              <p>
                Les données de réservation servent à gérer les créneaux, confirmer une table et
                contacter le client si une précision est nécessaire. Ce traitement repose sur la
                demande de réservation du client et sur l'intérêt légitime du restaurant à organiser
                son service.
              </p>
            </PolicyBlock>

            <PolicyBlock title="Destinataires">
              <p>
                Les informations de réservation sont destinées à l'équipe ÉTAT DAME et au service
                SumUp Bookings, accessible depuis{" "}
                <a
                  href={RESERVATION_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-cocoa hover:underline"
                >
                  {RESERVATION_URL}
                </a>
                . Elles ne sont pas vendues et ne sont pas utilisées pour de la prospection
                commerciale par ÉTAT DAME.
              </p>
            </PolicyBlock>

            <PolicyBlock title="Conservation">
              <p>
                Les demandes sont conservées le temps nécessaire à leur traitement opérationnel et
                au suivi de la réservation. ÉTAT DAME peut supprimer les données sur demande
                lorsqu'il n'existe plus de nécessité opérationnelle ou légale de les conserver.
              </p>
            </PolicyBlock>

            <PolicyBlock title="Cookies et mesure d'audience">
              <p>
                Le site ne met pas en place de cookies publicitaires ni de suivi marketing dans sa
                version actuelle. Les polices peuvent être chargées depuis Google Fonts, ce qui peut
                entraîner une requête technique vers les serveurs de Google lors de l'affichage du
                site.
              </p>
            </PolicyBlock>

            <PolicyBlock title="Vos droits">
              <p>
                Vous pouvez demander l'accès, la rectification, l'effacement ou la limitation des
                données vous concernant. Vous pouvez également vous opposer au traitement lorsque la
                loi le permet.
              </p>
            </PolicyBlock>

            <PolicyBlock title="Contact">
              <p>
                Pour toute demande concernant vos données personnelles, contactez ÉTAT DAME à{" "}
                <a href={`mailto:${EMAIL}`} className="font-semibold text-cocoa hover:underline">
                  {EMAIL}
                </a>
                .
              </p>
            </PolicyBlock>

            <PolicyBlock title="Autorité de contrôle">
              <p>
                En cas de difficulté non résolue, vous pouvez consulter la CNIL:{" "}
                <a
                  href="https://www.cnil.fr/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-semibold text-cocoa hover:underline"
                >
                  cnil.fr <ExternalLink className="h-3.5 w-3.5" />
                </a>
                .
              </p>
            </PolicyBlock>
          </div>
        </section>
      </div>
    </main>
  );
}

function PolicyBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-cocoa/12 pt-5 first:border-t-0 first:pt-0">
      <h2 className="text-lg font-black text-cocoa">{title}</h2>
      <div className="mt-2">{children}</div>
    </section>
  );
}
