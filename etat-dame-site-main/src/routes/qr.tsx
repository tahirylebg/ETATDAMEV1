import { createFileRoute } from "@tanstack/react-router";
import React, { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Printer, QrCode, Smartphone } from "lucide-react";

export const Route = createFileRoute("/qr")({
  head: () => ({
    meta: [{ title: "QR menu ÉTAT DAME" }, { name: "robots", content: "noindex,nofollow" }],
  }),
  component: QrPage,
});

function QrPage() {
  const [baseUrl, setBaseUrl] = useState("https://etatdame.fr");

  useEffect(() => {
    setBaseUrl(window.location.origin);
  }, []);

  const normalizedBaseUrl = useMemo(() => baseUrl.replace(/\/$/, ""), [baseUrl]);

  function menuUrl() {
    return `${normalizedBaseUrl}/menu`;
  }

  return (
    <main className="min-h-screen bg-cream px-5 py-8 text-cocoa sm:px-8 print:bg-card print:p-0">
      <div className="mx-auto max-w-7xl">
        <section className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] print:block">
          <div className="print:hidden">
            <a
              href="/menu"
              className="inline-flex items-center gap-2 rounded-full border border-cocoa/12 bg-card px-4 py-2 text-sm font-bold text-cocoa transition-colors hover:bg-cocoa/6"
            >
              <ArrowLeft className="h-4 w-4" />
              Menu
            </a>
            <p className="section-kicker mt-10 text-terracotta">QR menu</p>
            <h1 className="heading-readable mt-3 text-5xl text-cocoa sm:text-7xl">
              Un QR pour ouvrir la carte.
            </h1>
            <p className="mt-5 max-w-xl leading-relaxed text-cocoa/78">
              Le QR ouvre directement le menu ÉTAT DAME: plats, boissons, infos pratiques et
              réservation.
            </p>

            <div className="mt-8 grid gap-4">
              <label className="grid gap-2">
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-cocoa/72">
                  URL publique ou locale
                </span>
                <input
                  value={baseUrl}
                  onChange={(event) => setBaseUrl(event.target.value)}
                  className="field-input"
                  placeholder="https://etatdame.fr"
                />
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <a
                  href={menuUrl()}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-cocoa/14 bg-card px-6 py-4 text-sm font-black text-cocoa transition-colors hover:bg-beige/55"
                >
                  <Smartphone className="h-4 w-4" />
                  Tester le menu
                </a>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-cocoa px-6 py-4 text-sm font-black text-cream shadow-warm transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
                >
                  <Printer className="h-4 w-4" />
                  Imprimer le QR
                </button>
              </div>
            </div>
          </div>

          <div className="mx-auto w-full max-w-md print:max-w-none">
            <QrCard url={menuUrl()} />
          </div>
        </section>
      </div>
    </main>
  );
}

function QrCard({ url }: { url: string }) {
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=900x900&margin=32&data=${encodeURIComponent(url)}`;

  return (
    <article className="rounded-[1.75rem] border border-cocoa/14 bg-card p-4 shadow-paper print:break-inside-avoid print:rounded-none print:border print:border-cocoa/35 print:shadow-none">
      <div className="rounded-[1.35rem] bg-cocoa p-5 text-center text-cream print:rounded-none">
        <p className="text-3xl font-black tracking-[0.08em]">ÉTAT DAME</p>
        <p className="mt-2 text-xs font-bold uppercase tracking-[0.18em] text-cream/76">
          Menu digital
        </p>
      </div>

      <div className="p-4 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-beige/60 text-cocoa print:hidden">
          <QrCode className="h-6 w-6" strokeWidth={1.5} />
        </div>
        <h2 className="mt-4 text-3xl font-black leading-none text-cocoa">Menu ÉTAT DAME</h2>
        <img
          src={qrUrl}
          alt="QR code menu ÉTAT DAME"
          className="mx-auto mt-5 aspect-square w-full max-w-[250px] rounded-[1.1rem] border border-cocoa/10 bg-cream p-3 print:max-w-[220px]"
        />
        <p className="mt-4 text-sm font-black text-cocoa">Scannez pour voir la carte.</p>
        <p className="mt-1 text-xs font-semibold text-cocoa/62">Menu, infos et réservation.</p>
        <p className="mt-2 break-all text-[10px] font-semibold text-cocoa/52">{url}</p>
      </div>
    </article>
  );
}
