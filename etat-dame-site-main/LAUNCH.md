# ÉTAT DAME, checklist sortie officielle

## Parcours public

- `/` : présentation restaurant, accès menu, réservation, infos pratiques.
- `/menu` : carte digitale complète pour QR code.
- `/qr` : planche imprimable de QR codes par table, non indexée par les moteurs.
- `/securite` : page anti-arnaque, vérification QR code et consignes phishing.

## Réservation

La réservation publique passe par SumUp Bookings :

- `RESERVATION_URL` pointe vers `https://www.sumupbookings.com/etatdame`.
- Les boutons `Réserver` ouvrent SumUp dans un nouvel onglet.
- Le téléphone reste disponible en secours.

## À compléter avant domaine public

- Renseigner l'hébergeur exact dans `/mentions-legales`.
- Vérifier l'URL finale dans `SITE_URL` et `public/robots.txt` si le domaine n'est pas `etatdame.fr`.
- Vérifier que les QR codes imprimés pointent bien vers le domaine officiel.
- Confirmer que le lien SumUp Bookings reste bien le lien officiel fourni par le restaurant.

## Validation

Avant mise en ligne :

```bash
bun run build
bun run lint
```
