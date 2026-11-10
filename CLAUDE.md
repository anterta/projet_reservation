# Consignes du projet — Réservation de salles

## Pile technique

- Utilise Node.js 20 ou une version supérieure et TypeScript.
- Utilise Express pour l'API REST.
- Utilise Vitest pour les tests et Supertest pour les tests HTTP.
- Stocke toutes les données en mémoire, sans base de données.
- Prévois les commandes `npm install`, `npm test` et `npm start` et documente-les dans `README.md`.

## Architecture

- Respecte l'architecture DDD dans le backend Express et le frontend Angular.
- Sépare le backend et le frontend en deux applications indépendantes.
- Organise chaque application en trois couches : domaine, application et infrastructure.
- Place les règles métier dans la couche domaine.
- N'importe aucun framework ni paquet externe dans le domaine.
- Ne fais jamais dépendre le domaine de l'application ou de l'infrastructure.
- Place les cas d'usage et l'orchestration des opérations dans la couche application.
- Place les implémentations techniques, les accès aux données et les communications HTTP dans l'infrastructure.
- Fais dépendre les couches externes des interfaces définies dans les couches internes.
- Utilise le vocabulaire métier défini dans les spécifications.
- Évite toute duplication inutile des règles métier entre Angular et Express.
- Conserve le backend comme source de vérité pour les validations métier.

### Backend Express

- Place les objets valeur, agrégats, entités et interfaces de repositories dans `backend/src/domaine/`.
- Place les cas d'usage dans `backend/src/application/`.
- Place les repositories en mémoire et les routes Express dans `backend/src/infrastructure/`.
- Interdis tout import extérieur à `backend/src/domaine/` depuis le domaine.
- Ne place aucune règle métier de créneau, capacité ou chevauchement dans les routes Express.

### Frontend Angular

- Organise Angular selon les principes DDD.
- Place les modèles métier, objets valeur et interfaces de repositories dans `frontend/src/app/domaine/`.
- Place les cas d'usage et les services applicatifs dans `frontend/src/app/application/`.
- Place les services HTTP, adaptateurs API et implémentations des repositories dans `frontend/src/app/infrastructure/`.
- Place les composants Angular et les pages dans `frontend/src/app/presentation/`.
- Utilise des composants Angular standalone.
- Fais dépendre les composants des cas d'usage plutôt que directement des services HTTP.
- Utilise l'injection de dépendances Angular pour relier les interfaces du domaine à leurs implémentations.
- Utilise les Signals Angular pour l'état de présentation lorsque cela est pertinent.
- Utilise RxJS pour les opérations asynchrones.
- Limite le domaine frontend aux modèles et comportements nécessaires à l'interface.
- Ne réimplémente pas les règles métier de réservation déjà garanties par le backend.

### Tests

- Utilise Vitest pour les tests unitaires du backend.
- Utilise Supertest pour les tests HTTP du backend.
- Utilise Cypress pour les tests de l'interface Angular.
- Place les tests Cypress dans `frontend/cypress/`.
- Respecte le cycle TDD défini dans ce fichier pour toutes les couches.

### Arborescence cible

```text
backend/
  src/
    domaine/
      modeles/
      repositories/
    application/
      cas-utilisation/
    infrastructure/
      repositories/
      http/
  tests/

frontend/
  src/
    app/
      domaine/
        modeles/
        repositories/
      application/
        cas-utilisation/
      infrastructure/
        http/
        repositories/
      presentation/
        pages/
        composants/
      app.config.ts
      app.routes.ts
  cypress/
    e2e/
    fixtures/
    support/
```

- Adapte les sous-dossiers aux besoins réels sans créer de structures inutiles.
- Respecte strictement le sens des dépendances entre les couches.


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


## Interface et tests Cypress

- Implémente l'interface conformément aux stories frontend de `TACHES.md`, sans anticiper de fonctionnalités.
- Utilise Angular et TypeScript pour l'interface web.
- Isole l'application Angular dans un dossier `frontend/` distinct du backend.
- Privilégie les composants Angular standalone et les mécanismes natifs du framework.
- Organise Angular en composants pour l'affichage, services pour les appels HTTP et modèles typés pour les données de l'API.
- Fais communiquer Angular avec l'API REST Express existante.
- Ne duplique pas les règles métier du domaine dans le frontend.
- Affiche la liste des salles, le planning et le formulaire de réservation selon les tâches demandées.
- Rends les formulaires accessibles : labels associés, navigation au clavier, messages d'erreur lisibles et focus visible.
- Utilise Cypress pour tester les parcours utilisateur et leurs cas d'erreur.
- Utilise `cy.intercept()` pour isoler les scénarios d'interface lorsque cela est pertinent.
- Prévois des sélecteurs de test stables (`data-cy`) plutôt que des sélecteurs dépendants de la mise en forme.
- Conserve Vitest et Supertest pour les tests backend.
- Applique le même cycle TDD aux tests Cypress : un test, validation de l'échec, implémentation minimale, validation de la réussite, puis refactoring.
- Attends la validation de l'utilisateur entre chaque étape du TDD.
- Ne crée aucun commit sans demande explicite.
- Documente les commandes permettant de lancer Angular et Cypress dans `README.md`.


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
