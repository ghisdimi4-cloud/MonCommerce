# Documentation Supabase - Projet MonCommerce

Ce document est la **documentation officielle** de l'intégration Supabase pour l'application MonCommerce. Il doit être lu par tout développeur ou modèle IA intervenant sur la base de données du projet afin de garantir la cohérence et d'éviter les erreurs de configuration communes.

---

## 1. Présentation

* **Projet Supabase utilisé** : Backend "BaaS" (Backend as a Service) pour la persistance des données.
* **Architecture générale** : L'application est un front-end Next.js 14+ (App Router). La gestion de l'état global se fait via React Context API (`src/lib/store.tsx`). Ce store effectue le pont avec Supabase via le SDK `@supabase/supabase-js`. 
* **Flux de données** : Le store charge les données au montage du composant (`useEffect`), puis effectue des mises à jour optimistes de l'UI en même temps qu'il synchronise asynchronement (`insert`/`update`/`delete`) vers Supabase.

---

## 2. Variables d'environnement

Toutes les configurations se trouvent dans le fichier `.env.local` à la racine du projet.

* **`NEXT_PUBLIC_SUPABASE_URL`** : L'URL de base du projet Supabase. Utilisée par le client web pour pointer vers la bonne instance de base de données.
* **`NEXT_PUBLIC_SUPABASE_ANON_KEY`** : La clé publique (anonyme). Utilisée par le frontend pour s'identifier auprès de Supabase. Elle est sûre à exposer dans le navigateur à condition que les règles de sécurité RLS soient correctement configurées (ou désactivées en mode développement).
* **`SUPABASE_SERVICE_ROLE_KEY`** : *Optionnelle dans le frontend actuel*. C'est la clé d'administration suprême ("god mode"). Elle contourne toutes les règles RLS. **Ne doit jamais être préfixée par `NEXT_PUBLIC_` ni exposée au navigateur.** Elle est réservée aux scripts serveurs (API routes).

---

## 3. Authentification

* **Méthodes de connexion** : Aucune actuellement.
* **Flux auth** : Accès totalement anonyme.
* **Gestion session** : N/A.
* **Gestion utilisateurs** : Tous les utilisateurs actuels sont considérés comme "anonymes" par Supabase.
* *Note future* : Pour un passage en production sécurisé, il faudra implémenter `supabase.auth.signInWithPassword` ou des Magic Links, lier l'état d'authentification au Router, et activer le RLS (Row Level Security).

---

## 4. Tables

Le schéma de base de données utilise des types simples (majoritairement `text` et `numeric`) pour être rétrocompatible avec les données fictives d'origine du projet.

### `clients`
* `id` (text, PK)
* `name` (text, NOT NULL)
* `phone` (text)
* `debt` (numeric, DEFAULT 0)
* `lastactivity` (text) - *Attention : minuscule en BDD, correspond à `lastActivity` en JS.*
* `avatar` (text)

### `products`
* `id` (text, PK)
* `name` (text, NOT NULL)
* `price` (numeric, NOT NULL)
* `purchaseprice` (numeric, NOT NULL) - *Attention : minuscule en BDD.*
* `stock` (integer, DEFAULT 0)
* `category` (text)
* `status` (text)
* `image` (text)

### `sales`
* `id` (text, PK)
* `client` (text)
* `clientId` (text, FK vers `clients.id`) - *Attention : camelCase en BDD grâce aux guillemets dans la création SQL.*
* `amount` (numeric)
* `status` (text)
* `date` (text)
* `paymentMethod` (text) - *Attention : camelCase en BDD.*

### `sale_items`
* `id` (text, PK)
* `saleId` (text, FK vers `sales.id`)
* `productId` (text, FK vers `products.id`)
* `name` (text)
* `quantity` (integer)
* `unitPrice` (numeric)
* `total` (numeric)

### `activities`
* `id` (text, PK)
* `client` (text)
* `type` (text)
* `amount` (text)
* `status` (text)
* `date` (text)
* `cost` (numeric, DEFAULT 0)

### `settings`
* `id` (integer, PK) - Valeur unique fixée à 1.
* `companyName` (text)
* `phone` (text)
* `address` (text)
* `paymentMobileMoney` (boolean)
* `paymentCash` (boolean)
* `paymentCard` (boolean)

---

## 5. Relations

Schéma relationnel textuel :

```text
[ sales ] ------(N:1)-----> [ clients ]
(clientId)                   (id)
   |
   |
(1:N)
   |
   v
[ sale_items ] --(N:1)----> [ products ]
(productId)                  (id)
```

* Un **Client** a plusieurs **Ventes**. Si le client est supprimé, le `clientId` dans `sales` passe à NULL (`ON DELETE SET NULL`).
* Une **Vente** a plusieurs **Articles (sale_items)**. Si la vente est supprimée, les articles sont supprimés en cascade (`ON DELETE CASCADE`).
* Un **Article** référence un **Produit**. Si le produit est supprimé, le `productId` dans `sale_items` passe à NULL (`ON DELETE SET NULL`).

---

## 6. RLS Policies (Row Level Security)

* **État actuel** : **DÉSACTIVÉ** sur toutes les tables (`ALTER TABLE ... DISABLE ROW LEVEL SECURITY;`).
* **Permissions** : Le rôle `anon` a un accès complet en lecture/écriture.
* **Règles de sécurité** : Aucune actuellement pour faciliter le développement local.

---

## 7. Fonctions SQL

* **Triggers** : Aucun utilisé.
* **Fonctions / Procédures** : La logique métier (mise à jour des stocks après une vente, incrémentation des dettes) est actuellement traitée **côté client (front-end)** dans `src/lib/store.tsx` via de multiples requêtes Supabase séquentielles, et non par des Triggers ou RPC SQL.

---

## 8. Synchronisation Application

Tout le trafic vers Supabase est géré dans `src/lib/store.tsx`.
* **Initialisation** : Un `useEffect` lance des requêtes asynchrones parallèles (`Promise.all`) au chargement de l'application pour peupler l'état local (clients, produits, ventes, activités, paramètres).
* **Mutations** :
  - **Ventes (`recordSale`)** : Ajoute la vente, boucle sur les articles pour les insérer dans `sale_items`, met à jour les produits (soustraction du stock), met à jour la dette et l'activité du client, et crée un log d'activité.
  - **Dettes (`repayDebt`)** : Soustrait la dette du client ciblé.
  - **Stock (`restockProduct`)** : Ajoute la quantité au stock du produit et met à jour son statut.
* **Formatage / Mapping** : Comme certaines colonnes PostgreSQL ont été converties en minuscules (ex: `lastactivity`, `purchaseprice`), le code dans `store.tsx` effectue une traduction à la volée entre le format camelCase utilisé par les composants React (`lastActivity`) et le format PostgreSQL (`lastactivity`).

---

## 9. Historique des erreurs

Section vitale documentant les pièges rencontrés lors de la migration.

### Erreur 1 : Rejet des insertions par manque de colonne
* **Symptôme** : L'interface réagit bien mais la ligne n'apparaît pas dans Supabase.
* **Cause** : Les requêtes envoyaient des propriétés JS `lastActivity` et `purchasePrice`. En PostgreSQL, ces colonnes avaient été créées sans guillemets dans le script d'origine, devenant ainsi `lastactivity` et `purchaseprice`. Supabase JS rejette l'insertion.
* **Solution** : Ajout d'un système de mapping (traduction) directement dans les méthodes de `src/lib/store.tsx`. Exemple : `await supabase.from('clients').insert([{ ...rest, lastactivity: lastActivity }])`.

### Erreur 2 : Invalid API Key (Unauthorized)
* **Symptôme** : Rejet silencieux des requêtes.
* **Cause** : Le fichier `.env.local` comportait la valeur par défaut `votre_anon_key_ici`.
* **Solution** : Copier la clé "anon/public" depuis les paramètres API du tableau de bord Supabase vers `.env.local` et redémarrer le serveur Next.js.

### Erreur 3 : Violations RLS (Row Level Security)
* **Symptôme** : `new row violates row-level security policy for table "clients"`. Code 401 Unauthorized.
* **Cause** : Le mode par défaut de Supabase bloque tout accès anonyme si le RLS est activé mais sans policy de définie.
* **Solution** : Exécution de requêtes SQL pour désactiver la sécurité : `ALTER TABLE [nom_table] DISABLE ROW LEVEL SECURITY;`.

---

## 10. Checklist de vérification

Si Supabase semble déconnecté ou défaillant, vérifiez l'ordre suivant :
1. [ ] Le fichier `.env.local` existe et contient les variables `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY` valides.
2. [ ] Le serveur Next.js a été **redémarré** après modification du `.env.local`.
3. [ ] Le SDK est instancié dans `src/lib/supabase.ts` avec la fonction `createClient`.
4. [ ] Les tables existent dans le "Table Editor" de Supabase avec les bons noms de colonnes (notamment en regardant la casse : minuscules vs camelCase).
5. [ ] La sécurité RLS est **désactivée** (Vérifiez qu'il n'y a pas de mention "RLS Enabled" bloquante sur le tableau de bord) ou qu'une politique permet explicitement l'accès au rôle `anon`.
6. [ ] La console du navigateur (F12) n'affiche pas d'erreurs `400 Bad Request` (colonne manquante) ou `401 Unauthorized`.

---

## 11. Instructions pour une future IA

1. **La Casse (CamelCase vs Lowercase)** : C'est le piège numéro 1. Si vous ajoutez une nouvelle table ou de nouvelles colonnes, préférez TOUJOURS encadrer les noms avec des guillemets (ex: `"maNouvelleColonne"`) dans vos scripts SQL pour forcer PostgreSQL à garder la majuscule. Si la colonne est déjà en minuscule en base, vous **devez** mapper le nom dans `store.tsx`.
2. **Relations** : Ne passez pas à côté des contraintes de clés étrangères lors d'un `DELETE`. Pensez aux `sale_items` quand vous manipulez une vente.
3. **Sécurisation Future (Auth & RLS)** : Si l'utilisateur demande d'ajouter un "Login" ou de "Sécuriser l'application" :
   * Ne supprimez pas le RLS, **réactivez-le**.
   * Écrivez un script SQL générant des RLS Policies pour le rôle `authenticated`.
   * Mettez en place `@supabase/ssr` au lieu d'un simple client public pour gérer correctement les cookies d'authentification Next.js.
4. **Mutations Transversales** : Pensez que lors d'une vente (`recordSale`), il ne suffit pas d'insérer la vente. Il faut aussi réduire le `stock` du `product`, générer les `sale_items`, mettre à jour la `lastactivity` et la `debt` du `client`, et écrire dans `activities`. Toute cette logique est impérative dans `store.tsx`. Respectez ce flux.
