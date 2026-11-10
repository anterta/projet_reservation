# Spec — Réservation de salles de réunion

## Prérequis

- Kenny te fournit l'accès à Claude Code.

## Ta mission

1. Lis les 4 stories de ce document.
2. Écris `CLAUDE.md` à la racine du dépôt, avant la première tâche. Suis la section « Contenu de `CLAUDE.md` » ci-dessous.
3. Découpe chaque story en tâches avec Claude Code.
4. Écris la liste des tâches dans `TACHES.md`, à la racine du dépôt.
5. Fais implémenter chaque tâche par Claude Code en TDD.
6. Range le code selon l'architecture DDD décrite plus bas.
7. À la fin de chaque session Claude Code, exporte la session avec `/export` dans le dossier `sessions/`.
8. Pousse tout le travail sur un dépôt public github.com.
9. Envoie le lien du dépôt à Cyrille.

Cycle TDD de chaque tâche :

1. Fais écrire un seul test, sans le code.
2. Lance le test et vérifie qu'il échoue.
3. Commite le test seul, avec un message qui commence par `test:`.
4. Fais écrire le code minimal qui fait passer le test.
5. Lance tous les tests et vérifie qu'ils passent.
6. Demande un nettoyage du code, sans modifier les tests.
7. Commite le code, avec un message qui commence par `feat:`.

Chaque cycle produit donc deux commits. Garde la ligne `Co-Authored-By: Claude` que Claude Code ajoute à ses messages de commit.

### Sessions exportées

Un export contient tout ce que tu as écrit dans la session. Relis chaque fichier avant de le commiter et retire les secrets (clés, mots de passe, jetons).

1. Tape `/export` dans Claude Code.
2. Enregistre le fichier dans `sessions/`, avec un nom daté : `sessions/2026-12-01-story-2.txt`.
3. Commite le fichier avec un message qui commence par `docs:`.

### Contenu de `CLAUDE.md`

Claude Code lit `CLAUDE.md` au début de chaque session. Chaque règle du fichier s'applique donc à toutes les tâches.

Forme attendue :

- Écris des règles courtes, à l'impératif, une règle par ligne.
- Ne copie pas les stories ni leurs critères d'acceptation. Ils entrent dans les tâches de `TACHES.md`.

Rubriques à écrire, avec la section de ce document qui fournit la matière :

| Rubrique | Quoi écrire | Source |
| --- | --- | --- |
| Pile technique | Les versions et les outils imposés. | « Contraintes techniques » |
| Architecture | Les trois dossiers et la règle d'import de `src/domaine`. | « Contraintes techniques », bloc « Architecture DDD » |
| Modèle | Le rôle de `Creneau`, `PlanningSalle` et des repositories, la génération de l'identifiant. | « Attendus minimaux du modèle » |
| Vocabulaire | Les termes à employer, sans synonyme. | « Vocabulaire » |
| Format de l'API | Les formats de date et d'heure, le corps d'erreur, les codes 400 et 404. | « Format commun de l'API » |
| Méthode TDD | Les étapes du cycle et leurs interdits : un seul test à la fois, aucun test modifié pour le faire passer, deux commits par cycle (`test:` puis `feat:`). | « Cycle TDD de chaque tâche » |

## Contraintes techniques

- Node.js 20 ou plus, TypeScript.
- Tests : Vitest. Tests HTTP : Supertest.
- API REST : Express.
- Données en mémoire. Pas de base de données.
- Pas de front.

Architecture DDD :

```
src/
  domaine/          # règles métier, aucun import de paquet externe
  application/      # cas d'usage : charger, appeler le domaine, sauvegarder
  infrastructure/   # dépôts en mémoire, routes Express
```

Attendus minimaux du modèle :

- `Creneau` est un objet valeur. Il refuse un créneau invalide (story 2).
- `PlanningSalle` est l'agrégat : une salle pour une date. Il refuse les chevauchements et le dépassement de capacité.
- `PlanningRepository` et `SalleRepository` sont des interfaces du domaine. L'infrastructure les implémente en mémoire.
- L'application génère l'identifiant d'une réservation (par exemple avec `crypto.randomUUID()`).

## Vocabulaire

Le code, les tests et l'API utilisent ces mots, sans synonyme.

| Terme | Sens |
| --- | --- |
| Salle | Pièce réservable, avec un identifiant, un nom et une capacité. |
| Créneau | Heure de début et heure de fin, dans une même journée. |
| Réservation | Créneau d'une salle, à une date, pour un organisateur et un nombre de participants. |
| Planning | Liste des réservations d'une salle pour une date. |
| Organisateur | Personne qui réserve, identifiée par son e-mail. |

## Format commun de l'API

- Date : `AAAA-MM-JJ`. Heure : `HH:MM`.
- Toute erreur renvoie le corps `{ "code": "...", "message": "..." }`.
- Un corps incomplet ou mal formaté renvoie 400, code `REQUETE_INVALIDE`.
- Une salle inconnue renvoie 404, code `SALLE_INCONNUE`.

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
