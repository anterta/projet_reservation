# Réservation de salles

API REST de réservation de salles de réunion, écrite en TypeScript avec Express. Les données sont stockées en mémoire, sans base de données. L'application n'a pas d'interface front-end.

## Prérequis

- Node.js 20 ou une version supérieure.
- npm.

## Commandes

| Commande | Rôle |
| --- | --- |
| `npm install` | Installe les dépendances. |
| `npm test` | Lance tous les tests avec Vitest et Supertest. |
| `npm start` | Démarre l'API sur le port `3000`, ou sur le port défini par la variable d'environnement `PORT`. |

## API

Les dates suivent le format `AAAA-MM-JJ` et les heures le format `HH:MM`.

### Salles disponibles au démarrage

| id | nom | capacité |
| --- | --- | --- |
| `A` | Atelier | 4 |
| `B` | Bureau | 8 |
| `C` | Conférence | 20 |

### `GET /salles`

Renvoie `200` et la liste des salles.

```json
[
  { "id": "A", "nom": "Atelier", "capacite": 4 },
  { "id": "B", "nom": "Bureau", "capacite": 8 },
  { "id": "C", "nom": "Conférence", "capacite": 20 }
]
```

### `POST /salles/{id}/reservations`

Réserve une salle sur un créneau.

```json
{
  "date": "2026-12-01",
  "debut": "09:00",
  "fin": "10:00",
  "organisateur": "marie@exemple.fr",
  "participants": 3
}
```

Une demande valide renvoie `201` et la réservation, avec son identifiant `id`.

Règles d'un créneau :

- Le début et la fin tombent sur un quart d'heure : h00, h15, h30 ou h45.
- La durée est comprise entre 30 minutes et 4 heures, bornes incluses.
- Le créneau commence à 08:00 au plus tôt et se termine à 20:00 au plus tard.

Règles d'une réservation :

- Le nombre de participants est compris entre 1 et la capacité de la salle.
- Une réservation ne recouvre aucune autre réservation de la même salle à la même date. Des créneaux contigus, comme 09:00–10:00 puis 10:00–11:00, sont acceptés.

### `GET /salles/{id}/planning?date=AAAA-MM-JJ`

Renvoie `200` et les réservations de la salle pour cette date, triées par heure de début. Une date sans réservation renvoie une liste vide.

### Erreurs

Toutes les erreurs renvoient le corps `{ "code": "...", "message": "..." }`.

| Statut | Code | Cas |
| --- | --- | --- |
| 400 | `REQUETE_INVALIDE` | Corps de requête incomplet ou mal formaté, date du planning absente ou mal formatée. |
| 404 | `SALLE_INCONNUE` | La salle n'existe pas. |
| 409 | `CHEVAUCHEMENT` | Le créneau recouvre une réservation existante. |
| 422 | `CRENEAU_INVALIDE` | Le créneau ne respecte pas les règles de quart d'heure, de durée ou d'horaires. |
| 422 | `CAPACITE_DEPASSEE` | Moins d'un participant, ou plus que la capacité de la salle. |

## Architecture

Le code suit une architecture DDD en trois couches :

```
src/
  domaine/          # règles métier, sans aucune dépendance externe
  application/      # cas d'usage : charger, appeler le domaine, sauvegarder
  infrastructure/   # repositories en mémoire, routes Express, validation des requêtes
tests/              # tests HTTP avec Vitest et Supertest
```

- **Domaine** : `Salle`, l'objet valeur `Creneau`, `Reservation` et l'agrégat `PlanningSalle`, qui refuse les dépassements de capacité et les chevauchements. Les interfaces `SalleRepository` et `PlanningRepository` sont définies dans le domaine.
- **Application** : `ListSalles`, `ReserveSalle` et `ConsultPlanning`. `ReserveSalle` génère l'identifiant de chaque réservation avec `crypto.randomUUID()`.
- **Infrastructure** : `InMemorySalleRepository`, `InMemoryPlanningRepository` et l'application Express créée par `createApp()`.

## Méthode de travail

Le projet est développé en TDD avec Claude Code. Chaque cycle produit deux commits : un commit `test:` avec le test qui échoue, puis un commit `feat:` avec le code qui le fait passer. Les consignes données à Claude Code sont dans `CLAUDE.md`, les tâches dans `TACHES.md` et les sessions exportées dans `sessions/`.
