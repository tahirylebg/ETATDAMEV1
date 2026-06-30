# ÉTAT DAME

Site web officiel du restaurant **ÉTAT DAME** à Nîmes, construit avec **TanStack Start**, **React**, **TypeScript** et **Vite**.

Le projet met en avant l’univers du restaurant et facilite l’accès aux informations essentielles pour les clients. Il sert à présenter l’établissement, consulter la carte digitale, vérifier les horaires et les coordonnées, réserver une table en ligne, et accéder rapidement aux pages légales ainsi qu’aux conseils de sécurité liés aux QR codes et aux réservations.

## Fonctionnalités

- Page d'accueil vitrine avec présentation du lieu, du brunch et des infos clés
- Carte digitale complète accessible sur `/menu`
- Page QR code imprimable sur `/qr`
- Page de sécurité pour vérifier les QR codes et éviter les arnaques sur `/securite`
- Pages légales et confidentialité
- Contenu optimisé pour le SEO avec sitemap et métadonnées

## Routes principales

- `/` : page d’accueil
- `/menu` : carte digitale
- `/qr` : planche de QR codes
- `/securite` : conseils de sécurité
- `/mentions-legales` : mentions légales
- `/confidentialite` : politique de confidentialité
- `/sitemap.xml` : sitemap automatique

## Prérequis

- [Bun](https://bun.sh/) installé localement

## Installation

```bash
bun install
```

## Lancer le projet en local

```bash
bun run dev
```

Puis ouvrir l’URL affichée par Vite, généralement `http://localhost:5173`.

## Scripts disponibles

- `bun run dev` : lance le serveur de développement
- `bun run build` : produit un build de production
- `bun run build:dev` : build en mode développement
- `bun run preview` : prévisualise le build
- `bun run lint` : lance ESLint
- `bun run format` : formate le code avec Prettier

## Configuration serveur

Certaines variables sont lues côté serveur dans `src/lib/config.server.ts` :

- `RESERVATION_WEBHOOK_URL`
- `RESERVATION_WEBHOOK_SECRET`
- `RESEND_API_KEY`
- `RESERVATION_EMAIL_TO`
- `RESERVATION_EMAIL_FROM`

Ces variables servent aux fonctionnalités de réservation / email côté serveur si elles sont activées dans le déploiement.

## Informations de contact

- Site officiel : `https://etatdame.fr`
- Réservation : `https://www.sumupbookings.com/etatdame`
- Instagram : `@Etatdame_Brunch`
- Téléphone : `06 66 33 92 42`
- Email : `etatdame.contact@gmail.com`

## Structure du projet

- `src/routes` : routes de l’application
- `src/lib` : données, helpers et configuration serveur
- `src/assets` : images du menu et du restaurant
- `public` : fichiers statiques, médias et métadonnées

## Vérification avant mise en ligne

```bash
bun run build
bun run lint
```

## Notes

- `src/routes/routeTree.gen.ts` est généré automatiquement et ne doit pas être modifié à la main.
- Les liens de réservation ouvrent SumUp Bookings dans un nouvel onglet.
