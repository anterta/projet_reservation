
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

## Livrable

Un lien vers un dépôt public github.com. Le dépôt contient :

- le code et les tests ;
- `CLAUDE.md` : les consignes données à Claude Code ;
- `TACHES.md` : les tâches de chaque story, cochées une fois faites ;
- `README.md` : les commandes `npm install`, `npm test` et `npm start` ;
- `sessions/` : les sessions Claude Code exportées avec `/export` ;
- l'historique git, avec deux commits par cycle TDD : `test:` puis `feat:`.

## Comment vérifier

| Critère | Vérification |
| --- | --- |
| Stories livrées | Chaque cas cité dans un critère d'acceptation a son propre test, qui passe : chaque branche d'un « ou », chaque limite (fin à 20:00 acceptée, 30 minutes, 4 heures, capacité). |
| Tests verts | `npm install` puis `npm test` passent sur un clone du dépôt. |
| TDD | Chaque commit `feat:` suit un commit `test:`. Sur le commit `test:`, `npm test` échoue. Sur le commit `feat:`, `npm test` passe. |
| Travail avec Claude Code | `sessions/` contient les sessions exportées. Les commits `test:` et `feat:` portent la ligne `Co-Authored-By: Claude`. |
| Domaine isolé | `grep -rnE "from ['\"]" src/domaine` ne cite que des fichiers de `src/domaine`. |
| Règles dans le domaine | Les refus de créneau, de capacité et de chevauchement sont codés dans `src/domaine`, pas dans les routes. |
| Découpage | `TACHES.md` liste les tâches de chaque story. |
| Cadrage | `CLAUDE.md` existe dès le premier commit de code. Il contient les 6 rubriques de la section « Contenu de `CLAUDE.md` ». |
