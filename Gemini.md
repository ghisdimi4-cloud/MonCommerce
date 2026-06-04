# Documentation Projet : MonCommerce

Ce fichier sert de point de repère pour comprendre l'architecture, les fonctionnalités, les technologies et les choix de design de l'application **MonCommerce**. 
Il doit être lu par tout modèle IA ou développeur intervenant sur le projet afin de garantir la cohérence des futures mises à jour.

---

## 1. Description de l'Application
**MonCommerce** est une application web de type SaaS (Software as a Service) destinée aux commerçants et PME. Elle fait office de tableau de bord centralisé pour gérer les ventes, le stock, la base de données clients, les dettes, et analyser les performances financières globales de l'entreprise.

---

## 2. Fonctionnalités Implémentées

- **Dashboard (Tableau de bord)** : Vue globale dynamique avec indicateurs clés (Croissance des ventes, Bénéfices, Dettes actives), graphiques d'évolution, et flux des activités récentes.
- **Gestion des Ventes** : 
  - Création de nouvelles ventes avec un panier de produits.
  - Génération de factures / reçus en format PDF (design minimaliste optimisé pour l'impression).
  - Modification du statut des ventes (ex: marquer comme payé).
- **Gestion de Stock & Produits** : 
  - Suivi des quantités.
  - Alertes automatiques de stock faible ou de rupture.
  - Réapprovisionnement rapide via boîte de dialogue interactive.
- **Gestion des Clients** : 
  - Profils clients avec historique de commandes.
  - Bouton interactif pour ouvrir directement un chat WhatsApp avec le client.
- **Gestion des Dettes** : 
  - Suivi des ventes "à crédit".
  - Enregistrement des paiements recouvrés qui mettent à jour automatiquement le statut de la vente.
- **Statistiques** : Graphiques financiers (Recharts) et bouton d'export de données.
- **Paramètres Globaux** : 
  - Configuration du profil de l'entreprise (Nom, Téléphone, Adresse) qui se répercute dynamiquement sur toute l'application (ex: En-tête des factures PDF).
  - Gestion des modes de paiement acceptés.

---

## 3. Technologies Utilisées
- **Framework Core** : Next.js 14+ (App Router) avec React 18+.
- **Langage** : TypeScript.
- **Styling** : Tailwind CSS (Vanilla CSS pour les utilitaires complexes).
- **Animations** : Framer Motion (Transitions de pages, micro-interactions, modales).
- **Icônes** : Lucide React.
- **Graphiques** : Recharts.
- **Gestion d'état globale** : React Context API (`src/lib/store.tsx`).
- **Manipulation de dates** : `date-fns`.

---

## 4. Structure des Fichiers

```text
MonCommerce/
├── src/
│   ├── app/
│   │   ├── (dashboard)/       # Toutes les pages protégées/principales
│   │   │   ├── ventes/        # Historique, [id] (détails & facture PDF), nouveau (formulaire)
│   │   │   ├── produits/      # Catalogue
│   │   │   ├── stock/         # Alertes et réapprovisionnement
│   │   │   ├── clients/       # Base clients
│   │   │   ├── dettes/        # Recouvrement
│   │   │   ├── statistiques/  # Graphiques
│   │   │   ├── parametres/    # Configuration globale de l'entreprise
│   │   │   └── page.tsx       # Tableau de bord principal
│   │   ├── globals.css        # Variables CSS, Design System, utilitaires (@media print)
│   │   └── layout.tsx         # Layout principal avec la Sidebar de navigation
│   │
│   ├── components/
│   │   ├── dashboard/         # Composants spécifiques au dashboard (Graphiques, Cartes)
│   │   └── ui/                # Composants réutilisables (Design System)
│   │       ├── button.tsx, card.tsx, input.tsx, label.tsx, badge.tsx
│   │       ├── custom-dialog.tsx  # Remplacement global de window.confirm/prompt
│   │       ├── calendar.tsx       # Calendrier visuel sur-mesure
│   │       └── date-picker.tsx    # Popover de sélection de date responsif
│   │
│   └── lib/
│       ├── store.tsx          # "Cerveau" de l'app (Context API avec mock data et fonctions CRUD)
│       ├── export.ts          # Logique d'exportation CSV
│       └── mock-data.ts       # Données de simulation initiales
```

---

## 5. Décisions de Design et Directives pour l'IA (CRITIQUE)

**Si tu es une Intelligence Artificielle amenée à modifier ce code, tu DOIS ABSOLUMENT respecter les règles suivantes :**

1. **Esthétique "Premium Glassmorphism"** :
   - Ne jamais utiliser de couleurs génériques (rouge, bleu basiques).
   - Utiliser la palette principale Émeraude (`primary-50` à `primary-900`, défaut : `#10B981`) et Slate pour les gris.
   - Les cartes principales doivent utiliser la classe utilitaire `glass-card` (qui inclut un fond blanc translucide et un effet `backdrop-blur`).
   - Utiliser des coins très arrondis (`rounded-xl`, `rounded-2xl`, `rounded-3xl`).
   - Ajouter de la profondeur avec les ombres personnalisées définies dans `globals.css` (ex: `--shadow-premium`, `shadow-primary-glow`).

2. **Interactivité et Micro-animations** :
   - Chaque bouton ou carte cliquable doit avoir un effet de survol (hover) : `hover:-translate-y-1 hover:shadow-xl transition-all duration-300`.
   - Utiliser `framer-motion` systématiquement pour les entrées de page (`staggerChildren`) et l'apparition des listes.

3. **Expérience Utilisateur (UX) et Composants UI** :
   - **INTERDICTION** d'utiliser les boîtes de dialogue natives du navigateur (`window.alert`, `window.confirm`, `window.prompt`). Utiliser exclusivement le composant `<CustomDialog />` (dans `src/components/ui/custom-dialog.tsx`).
   - Pour la sélection de dates, utiliser le `<DatePicker />` sur-mesure, jamais `<input type="date" />`.
   - Tous les tableaux complexes doivent être encapsulés dans une `<div className="overflow-x-auto">` avec une largeur minimale (`min-w-[800px]`) pour éviter l'écrasement sur mobile.

4. **Impression (PDF)** :
   - Les factures PDF reposent sur les règles CSS d'impression natives (`@media print`).
   - Ce qui ne doit pas être imprimé (Boutons, Sidebar) doit comporter la classe `no-print` ou `print:hidden`.
   - La zone d'impression (Facture) doit comporter la classe `hidden print:block`.

5. **Gestion de l'État (State Management)** :
   - Toutes les données métier (Produits, Ventes, Clients, Paramètres) doivent être lues et modifiées via le hook `useAppStore()` provenant de `src/lib/store.tsx`.
   - Ne pas réécrire d'états locaux complexes si l'information concerne toute l'application.

6. **Documentation et Mémoire (CRITIQUE)** :
   - **APRÈS CHAQUE FONCTIONNALITÉ IMPORTANTE**, vous DEVEZ obligatoirement mettre à jour :
     1. `Gemini.md` (Si l'architecture globale, les règles métier ou les technologies changent).
     2. `SUPABASE_SETUP.md` (Si une nouvelle table, relation ou logique de base de données est ajoutée).
     3. `PROJECT_MEMORY.md` (Pour consigner chronologiquement les fonctionnalités ajoutées et l'état d'avancement).
