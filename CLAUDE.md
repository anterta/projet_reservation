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

## Format de l'API

- Utilise le format `AAAA-MM-JJ` pour les dates et `HH:MM` pour les heures.
- Retourne toutes les erreurs au format JSON `{ "code": "...", "message": "..." }`.
- Retourne HTTP 400 avec le code `REQUETE_INVALIDE` pour tout corps de requête incomplet ou mal formaté.
- Retourne HTTP 404 avec le code `SALLE_INCONNUE` pour toute salle inconnue.
- Respecte les autres statuts et codes d'erreur définis dans les tâches issues des stories.

## Méthode TDD

- Consulte `TACHES.md` pour connaître la tâche demandée, sans anticiper les suivantes.
- Respecte le pilotage humain du cycle TDD : attends chaque consigne avant de passer à l'étape suivante.
- Lorsque l'utilisateur demande un test, écris un seul test et aucun code de production.
- Arrête-toi après avoir écrit le test pour laisser l'utilisateur l'exécuter, vérifier son échec et créer le commit `test:`.
- Lorsque l'utilisateur demande l'implémentation, écris uniquement le code minimal nécessaire pour faire passer ce test.
- Arrête-toi ensuite pour laisser l'utilisateur exécuter tous les tests et vérifier leur réussite.
- Lorsque l'utilisateur demande un nettoyage, refactorise le code sans modifier les tests ni son comportement.
- Laisse l'utilisateur valider le résultat et créer le commit `feat:`.
- Ne modifie jamais un test uniquement pour le faire passer.
- Respecte un seul nouveau test par cycle et deux commits distincts, `test:` puis `feat:`, réalisés par l'utilisateur.
- Ne crée aucun commit Git sans demande explicite de l'utilisateur.
- Si l'utilisateur demande de préparer un message de commit, conserve la ligne `Co-Authored-By: Claude`.
- Ne coche aucune tâche dans `TACHES.md` sans validation explicite de l'utilisateur.
- Laisse l'utilisateur effectuer `/export`, vérifier les secrets et commiter les sessions dans `sessions/` avec le préfixe `docs:`.
