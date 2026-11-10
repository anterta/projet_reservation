
## Story 1 — Lister les salles

En tant qu'employé, je veux voir la liste des salles, afin de choisir où réserver.

Critères d'acceptation :

- Au démarrage, l'application contient 3 salles :

  | id | nom | capacité |
  | --- | --- | --- |
  | `A` | Atelier | 4 |
  | `B` | Bureau | 8 |
  | `C` | Conférence | 20 |

- `GET /salles` renvoie 200 et la liste `[{ "id", "nom", "capacite" }]`.

## Story 2 — Réserver une salle

En tant qu'organisateur, je veux réserver une salle sur un créneau, afin de tenir ma réunion.

Requête :

```
POST /salles/{id}/reservations
{ "date": "2026-12-01", "debut": "09:00", "fin": "10:00",
  "organisateur": "marie@exemple.fr", "participants": 3 }
```

Critères d'acceptation :

- Une demande valide renvoie 201 et la réservation, avec son `id`.
- Le début ou la fin hors d'un quart d'heure (h00, h15, h30, h45) renvoie 422, code `CRENEAU_INVALIDE`.
- Une durée inférieure à 30 minutes ou supérieure à 4 heures renvoie 422, code `CRENEAU_INVALIDE`.
- Un début avant 08:00 ou une fin après 20:00 renvoie 422, code `CRENEAU_INVALIDE`. Une fin à 20:00 est acceptée.
- Moins de 1 participant ou plus que la capacité de la salle renvoie 422, code `CAPACITE_DEPASSEE`.

## Story 3 — Empêcher les doubles réservations

En tant qu'organisateur, je veux qu'une salle déjà réservée me soit refusée, afin d'éviter les conflits.

Critères d'acceptation :

- Une réservation qui recouvre une réservation existante de la même salle, à la même date, renvoie 409, code `CHEVAUCHEMENT`.
- Des créneaux contigus sont acceptés : 09:00–10:00 puis 10:00–11:00.
- Le même créneau dans une autre salle est accepté.
- Le même créneau à une autre date est accepté.

## Story 4 — Consulter le planning d'une salle

En tant qu'employé, je veux voir les réservations d'une salle pour une date, afin de trouver un créneau libre.

Critères d'acceptation :

- `GET /salles/{id}/planning?date=2026-12-01` renvoie 200 et les réservations de ce jour, triées par heure de début.
- Une date sans réservation renvoie 200 et une liste vide.
- Une date absente ou mal formatée renvoie 400, code `REQUETE_INVALIDE`.

## Story 5 — Consulter les salles disponibles

En tant qu'employé, je veux visualiser les salles de réunion afin de choisir celle qui correspond à mes besoins.

Critères d'acceptation : 

1. La page d'accueil affiche les salles récupérées depuis GET /salles.
2. Chaque salle affiche son nom et sa capacité.
3. L'utilisateur peut sélectionner une salle pour consulter son planning.
4. Un indicateur de chargement apparaît pendant la récupération des salles.
5. Un message d'erreur apparaît si l'API ne répond pas.
6. La liste s'actualise sans recharger la page.

## Story 6 — Consulter le planning d'une salle

En tant qu'employé, je veux visualiser les réservations d'une salle pour une journée afin d'identifier les créneaux libres.

Critères d'acceptation :

1. L'utilisateur sélectionne une salle et une date.
2. Le planning est récupéré via GET /salles/{id}/planning?date=AAAA-MM-JJ.
3. Les réservations apparaissent dans l'ordre chronologique.
4. Le planning affiche une vue horaire de 08:00 à 20:00.
5. Les créneaux occupés sont visuellement différenciés des créneaux libres.
6. Chaque réservation affiche son horaire, son organisateur et son nombre de participants.
7. L'utilisateur peut changer de date sans recharger la page.
8. Un planning sans réservation affiche une journée entièrement libre.
9. Les erreurs de chargement sont signalées à l'utilisateur.

## Story 7 — Réserver une salle

En tant qu'organisateur, je veux réserver une salle depuis l'interface afin d'organiser une réunion.

Critères d'acceptation :

1. L'utilisateur peut ouvrir un formulaire de réservation depuis une salle.
2. Le formulaire contient la date, l'heure de début, l'heure de fin, l'e-mail de l'organisateur et le nombre de participants.
3. Les horaires sont proposés par intervalles de 15 minutes.
4. Les horaires sélectionnables respectent la plage 08:00–20:00.
5. La durée doit être comprise entre 30 minutes et 4 heures.
6. Le nombre de participants doit être compris entre 1 et la capacité de la salle.
7. Les champs obligatoires et les formats sont validés avant l'envoi.
8. La validation du formulaire appelle POST /salles/{id}/reservations.
9. Une réservation réussie affiche une confirmation et actualise le planning.
10. Une erreur CRENEAU_INVALIDE affiche un message explicite.
11. Une erreur CAPACITE_DEPASSEE informe l'utilisateur de la capacité autorisée.
12. Une erreur CHEVAUCHEMENT informe l'utilisateur que le créneau est déjà réservé.
13. Le formulaire conserve les données saisies en cas d'erreur.
14. Le bouton de validation est désactivé pendant l'envoi pour éviter les doublons.

## Story 8 — Réserver depuis le planning

En tant qu'organisateur, je veux sélectionner directement un créneau libre dans le planning afin de réserver plus rapidement.

Critères d'acceptation :

1. Les créneaux libres du planning sont interactifs.
2. Un clic sur un créneau libre ouvre le formulaire de réservation.
3. La salle, la date et l'heure de début sont préremplies.
4. Une heure de fin valide est proposée automatiquement.
5. L'utilisateur peut modifier les horaires avant validation.
6. Les créneaux occupés sont visuellement identifiables et ne peuvent pas être sélectionnés comme créneaux libres.
7. Après une réservation réussie, le planning affiche immédiatement le nouveau créneau occupé.
8. Si un autre utilisateur a réservé le créneau entre-temps, l'erreur CHEVAUCHEMENT est affichée et le planning est actualisé.