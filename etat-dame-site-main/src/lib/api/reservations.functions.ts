import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { getServerConfig } from "../config.server";

const reservationInput = z.object({
  name: z.string().trim().min(2, "Le nom est requis.").max(80),
  phone: z.string().trim().min(6, "Le téléphone est requis.").max(30),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "La date est invalide."),
  time: z.string().regex(/^\d{2}:\d{2}$/, "L'horaire est invalide."),
  guests: z.string().min(1).max(3),
  note: z.string().trim().max(500).optional().default(""),
  source: z.string().trim().max(40).optional().default("site"),
  website: z.string().trim().max(120).optional().default(""),
});

export type ReservationPayload = z.infer<typeof reservationInput> & {
  reference: string;
  createdAt: string;
};

function buildReference(date: string) {
  const suffix = crypto.randomUUID().slice(0, 6).toUpperCase();
  return `ED-${date.replaceAll("-", "")}-${suffix}`;
}

function formatReservationText(reservation: ReservationPayload) {
  return [
    `Nouvelle demande de réservation ${reservation.reference}`,
    "",
    `Nom: ${reservation.name}`,
    `Téléphone: ${reservation.phone}`,
    `Date: ${reservation.date}`,
    `Horaire: ${reservation.time}`,
    `Personnes: ${reservation.guests}`,
    reservation.note ? `Message: ${reservation.note}` : "",
    `Source: ${reservation.source}`,
    `Créée le: ${reservation.createdAt}`,
  ]
    .filter(Boolean)
    .join("\n");
}

async function postWebhook(reservation: ReservationPayload) {
  const config = getServerConfig();
  if (!config.reservationWebhookUrl) return false;

  const response = await fetch(config.reservationWebhookUrl, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(config.reservationWebhookSecret
        ? { authorization: `Bearer ${config.reservationWebhookSecret}` }
        : {}),
    },
    body: JSON.stringify(reservation),
  });

  if (!response.ok) {
    throw new Error("La notification de réservation n'a pas pu être envoyée.");
  }

  return true;
}

async function sendEmail(reservation: ReservationPayload) {
  const config = getServerConfig();
  if (!config.resendApiKey || !config.reservationEmailTo || !config.reservationEmailFrom) {
    return false;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      authorization: `Bearer ${config.resendApiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      from: config.reservationEmailFrom,
      to: [config.reservationEmailTo],
      subject: `Nouvelle réservation ÉTAT DAME ${reservation.reference}`,
      text: formatReservationText(reservation),
    }),
  });

  if (!response.ok) {
    throw new Error("L'email de réservation n'a pas pu être envoyé.");
  }

  return true;
}

export const submitReservation = createServerFn({ method: "POST" })
  .inputValidator(reservationInput)
  .handler(async ({ data }) => {
    if (data.website) {
      return {
        ok: true,
        reference: "ED-SPAM-FILTERED",
      };
    }

    const requestedDayEnd = new Date(`${data.date}T23:59:59`).getTime();
    if (Number.isNaN(requestedDayEnd) || requestedDayEnd < Date.now()) {
      throw new Error("Choisissez une date à venir.");
    }

    const reservation: ReservationPayload = {
      ...data,
      reference: buildReference(data.date),
      createdAt: new Date().toISOString(),
    };

    const [webhookSent, emailSent] = await Promise.all([
      postWebhook(reservation),
      sendEmail(reservation),
    ]);

    if (!webhookSent && !emailSent) {
      console.error("Reservation delivery is not configured", reservation);
      throw new Error(
        "La réservation en ligne n'est pas encore configurée. Appelez directement le restaurant.",
      );
    }

    return {
      ok: true,
      reference: reservation.reference,
    };
  });
