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