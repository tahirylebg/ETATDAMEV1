import { createFileRoute } from "@tanstack/react-router";
import React from "react";
import { ArrowLeft, Mail, MapPin, Phone, ShieldCheck } from "lucide-react";

import { ADDRESS, EMAIL, PHONE, PHONE_DISPLAY, SITE_URL } from "@/lib/etat-dame";

export const Route = createFileRoute("/mentions-legales")({
  head: () => ({
    meta: [
      { title: "Mentions légales ÉTAT DAME" },
      {
        name: "description",
        content: "Mentions légales du site ÉTAT DAME, brunch fait maison à Nîmes.",
      },
    ],
    links: [{ rel: "canonical", href: "/mentions-legales" }],
  }),
  component: LegalNoticePage,
});

function LegalNoticePage() {
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
          <p className="section-kicker text-terracotta">Informations légales</p>
          <h1 className="heading-readable mt-3 text-5xl text-cocoa sm:text-6xl">
            Mentions légales.
          </h1>
          <p className="mt-5 max-w-2xl leading-relaxed text-cocoa/74">
            Ces informations identifient le site officiel ÉTAT DAME et récapitulent les données
            d'immatriculation transmises par l'entreprise au 29 juin 2026.
          </p>
          <div className="mt-8 grid gap-6 text-sm leading-relaxed text-cocoa/76 sm:text-base">
            <LegalBlock title="Éditeur du site">
              <p>ÉTAT DAME, société par actions simplifiée unipersonnelle.</p>
              <p>{ADDRESS}</p>
              <p>Site web: {SITE_URL}</p>
              <p>SIREN: 938 395 506</p>
              <p>SIRET de l'établissement principal: 938 395 506 00018</p>
              <p>Immatriculation au Registre National des Entreprises: 11 décembre 2024</p>
              <p>Début d'activité: 6 mars 2025</p>
              <p>Code APE: 5610C - Restauration de type rapide</p>
              <p>Capital social: 1 000 euros</p>
              <p>Nom commercial et enseigne: ÉTAT DAME</p>
              <p>Directeur de la publication: représentant légal d'ÉTAT DAME.</p>
            </LegalBlock>

            <LegalBlock title="Contact">
              <p className="inline-flex items-center gap-2">
                <Phone className="h-4 w-4" strokeWidth={1.6} />
                <a href={`tel:${PHONE}`} className="font-semibold text-cocoa hover:underline">
                  {PHONE_DISPLAY}
                </a>
              </p>
              <p className="inline-flex items-center gap-2">
                <Mail className="h-4 w-4" strokeWidth={1.6} />
                <a href={`mailto:${EMAIL}`} className="font-semibold text-cocoa hover:underline">
                  {EMAIL}
                </a>
              </p>
              <p className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4" strokeWidth={1.6} />
                {ADDRESS}
              </p>
            </LegalBlock>

            <LegalBlock title="Hébergement">
              <p>
                Pendant la phase de prépublication, l'hébergement technique dépend de
                l'environnement retenu pour la mise en ligne. Les informations de l'hébergeur
                définitif seront ajoutées dès la publication officielle du domaine.
              </p>
            </LegalBlock>

            <LegalBlock title="Propriété intellectuelle">
              <p>
                Les textes, visuels, éléments graphiques et contenus de ce site sont protégés. Toute
                reproduction non autorisée est interdite.
              </p>
            </LegalBlock>

            <LegalBlock title="Responsabilité">
              <p>
                ÉTAT DAME s'efforce de maintenir des informations exactes concernant la carte, les
                horaires et les réservations. Les prix, horaires et disponibilités peuvent évoluer.
                Une réservation n'est confirmée qu'après retour de l'équipe.
              </p>
            </LegalBlock>

            <LegalBlock title="Paiement et sécurité">
              <p className="inline-flex items-start gap-2">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.6} />
                Le site ne demande pas de paiement en ligne, pas de code bancaire et pas de mot de
                passe client. En cas de doute sur un message ou un QR code, contactez directement
                ÉTAT DAME par téléphone ou via l'adresse email indiquée sur cette page.
              </p>
            </LegalBlock>

            <LegalBlock title="Données personnelles">
              <p>
                Les informations relatives aux données personnelles sont détaillées dans la{" "}
                <a href="/confidentialite" className="font-semibold text-cocoa hover:underline">
                  politique de confidentialité
                </a>
                .
              </p>
            </LegalBlock>
          </div>
        </section>
      </div>
    </main>
  );
}

function LegalBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-cocoa/12 pt-5 first:border-t-0 first:pt-0">
      <h2 className="text-lg font-black text-cocoa">{title}</h2>
      <div className="mt-2 grid gap-1">{children}</div>
    </section>
  );
}
