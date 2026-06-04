# Mémoire du Projet : MonCommerce

Ce fichier sert de journal de bord (changelog) pour tracer l'évolution du projet, les grandes décisions architecturales et les fonctionnalités ajoutées au fil du temps.

## État Actuel du Projet
- **Version** : 1.1.0
- **Statut** : Développement actif
- **Base de données** : Supabase
- **Authentification** : Oui (Supabase Auth avec Middleware Next.js)
- **Modèle SaaS** : Multi-tenant activé (RLS via `user_id`)

---

## Historique des Fonctionnalités

### [Aujourd'hui] - Système d'Export Excel Professionnel
**Description** : Refonte totale du système d'export (anciennement CSV basique) vers un format Excel financier complet (Type ERP).
**Modifications majeures** :
- Remplacement des exports locaux par une fonction d'export globale `generateAccountingReport`.
- Utilisation de la librairie `exceljs` et `file-saver`.
- Création d'un classeur multi-feuilles : Résumé financier, Ventes, Clients, Dettes en cours, et Inventaire Stock.
- Traduction automatique des paniers JSON en texte lisible et application de couleurs conditionnelles sur les statuts.

### [Aujourd'hui] - Module Ventes Avancé (Factures & Cohérence)
**Description** : Refonte de la logique métier des ventes pour inclure les factures PDF et garantir la cohérence financière.
**Modifications majeures** :
- Génération de Factures PDF professionnelles avec `jspdf` et `jspdf-autotable`.
- Système de "Brouillon" permettant de mettre des ventes en attente sans impacter le stock ou les dettes.
- Possibilité d'annuler stricto sensu une vente (restauration des stocks et des dettes).
- Mise à jour du Dashboard et des Statistiques pour ignorer automatiquement les brouillons et annulations.

### [04 Juin 2026] - Sécurité et Transformation SaaS
**Description** : L'application est devenue une plateforme multi-boutiques sécurisée.
**Modifications majeures** :
- Ajout du composant `middleware.ts` pour bloquer les routes privées.
- Création des pages de Connexion (`/login`) et d'Inscription (`/signup`) avec design premium.
- Intégration de `@supabase/ssr` pour la gestion des sessions via les cookies.
- Ajout de la colonne `user_id` et réactivation stricte du RLS sur toutes les tables.
- Ajout d'une fonctionnalité de déconnexion dans la Sidebar.

### [04 Juin 2026] - Migration de l'état local vers Supabase (BaaS)
**Description** : Le projet est passé d'une gestion de données statique (`mock-data.ts`) à une véritable persistance cloud avec Supabase.
**Modifications majeures** :
- Installation du SDK `@supabase/supabase-js`.
- Création du schéma de base de données complet (Tables : `clients`, `products`, `sales`, `sale_items`, `activities`, `settings`).
- Réécriture intégrale de `src/lib/store.tsx` pour gérer le chargement (via `useEffect`) et la synchronisation asynchrone bidirectionnelle.
- Mise en place de règles de mappage automatique pour gérer la différence de casse (CamelCase / lowercase) entre TypeScript et PostgreSQL (ex: `lastActivity` -> `lastactivity`).
- Création du document `SUPABASE_SETUP.md` pour référence future.

### [Fin Mai 2026] - Initialisation du Projet MonCommerce
**Description** : Création du MVP (Minimum Viable Product) de l'application SaaS.
**Modifications majeures** :
- Structure de base Next.js 14+ avec App Router.
- Mise en place de l'interface "Premium Glassmorphism" avec Tailwind CSS et Framer Motion.
- Création des vues principales : Dashboard, Ventes (Création et Historique), Stock, Clients, Dettes et Paramètres.
- Création de composants UI globaux : `CustomDialog`, alertes, etc.
