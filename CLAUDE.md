# Consignes du projet — Réservation de salles

## Pile technique

- Utilise Node.js 20 ou une version supérieure et TypeScript.
- Utilise Express pour l'API REST.
- Utilise Vitest pour les tests et Supertest pour les tests HTTP.
- Stocke toutes les données en mémoire, sans base de données.
- Ne développe aucune interface front-end.
- Prévois les commandes `npm install`, `npm test` et `npm start` et documente-les dans `README.md`.

## Architecture

- Respecte l'architecture DDD et sépare le code dans `src/domaine/`, `src/application/` et `src/infrastructure/`.
- Place les règles métier dans `src/domaine/`.
- N'importe aucun paquet externe ni aucun fichier extérieur à `src/domaine/` depuis le domaine.
- Place les cas d'usage dans `src/application/` : charge les données, appelle le domaine, puis sauvegarde les résultats.
- Place les repositories en mémoire et les routes Express dans `src/infrastructure/`.
- Ne place aucune règle métier de validation de créneau, de capacité ou de chevauchement dans les routes Express.

## Modèle

- Implémente `Creneau` comme un objet valeur qui refuse les créneaux invalides.
- Implémente `PlanningSalle` comme l'agrégat d'une salle pour une date.
- Fais refuser par `PlanningSalle` les chevauchements de réservations et les dépassements de capacité.
- Définis `PlanningRepository` et `SalleRepository` comme des interfaces du domaine.
- Implémente ces interfaces en mémoire dans l'infrastructure.
- Génère l'identifiant de chaque réservation dans la couche application, par exemple avec `crypto.randomUUID()`.

## Vocabulaire

- Utilise exclusivement les termes métier `Salle`, `Creneau`, `Reservation`, `Planning` et `Organisateur` dans le code et les tests, avec leurs équivalents accentués dans la documentation.
- Désigne par `Salle` une pièce réservable avec un identifiant, un nom et une capacité.
- Désigne par `Creneau` une heure de début et une heure de fin dans une même journée.
- Désigne par `Reservation` un créneau d'une salle, à une date, pour un organisateur et un nombre de participants.
- Désigne par `Planning` la liste des réservations d'une salle pour une date.
- Désigne par `Organisateur` la personne qui réserve, identifiée par son e-mail.
- N'introduis aucun synonyme de ces notions métier dans le code, les tests ou l'API.
- Écris le code et les tests en anglais : identifiants, noms de fichiers, méthodes, variables et libellés de tests.
- Conserve en français les termes métier et leurs attributs (`id`, `nom`, `capacite`, `debut`, `fin`, `date`, `organisateur`, `participants`), par exemple `InMemorySalleRepository.findAll()`.
- Conserve en français les noms de dossiers `domaine`, `application` et `infrastructure`, les routes, les champs JSON et les codes d'erreur imposés par la spécification.

## Format de l'API

- Utilise le format `AAAA-MM-JJ` pour les dates et `HH:MM` pour les heures.
- Retourne toutes les erreurs au format JSON `{ "code": "...", "message": "..." }`.
- Retourne HTTP 400 avec le code `REQUETE_INVALIDE` pour tout corps de requête incomplet ou mal formaté.
- Retourne HTTP 404 avec le code `SALLE_INCONNUE` pour toute salle inconnue.
- Respecte les autres statuts et codes d'erreur définis dans les tâches issues des stories.


## Méthode TDD

- Consulte `TACHES.md` avant chaque tâche et traite les tâches dans leur ordre.
- Applique un cycle TDD complet pour chaque test correspondant à un cas d'acceptation, y compris les branches et les valeurs limites.
- Écris un seul nouveau test à la fois, sans implémenter le code associé.
- Lance `npm test` et vérifie que le nouveau test échoue pour la raison attendue.
- Commite uniquement le test avec un message commençant par `test:`.
- Écris ensuite uniquement le code minimal nécessaire pour faire passer le test.
- Relance tous les tests avec `npm test` et vérifie qu'ils passent.
- Nettoie et simplifie le code de production sans modifier les tests, puis vérifie à nouveau les tests.
- Ne modifie jamais un test dans le but de le faire passer.
- Commite le code de production avec un message commençant par `feat:`.
- Produis exactement deux commits par cycle TDD, dans l'ordre `test:` puis `feat:`.
- Conserve la ligne `Co-Authored-By: Claude` dans les messages de ces deux commits.
- Coche une tâche dans `TACHES.md` uniquement lorsque ses tests passent et que son cycle TDD est terminé.
- Ne commence pas la tâche suivante avant d'avoir terminé le cycle courant.
- À la fin de chaque session Claude Code, utilise `/export` et enregistre l'export daté dans `sessions/`.
- Relis chaque export et supprime les clés, mots de passe et jetons avant de le commiter.
- Commite les exports de session avec un message commençant par `docs:`.
