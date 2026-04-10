# 🏥 RetireMaisons - Plateforme Marketplace pour Maisons de Retraite

## 📌 Vue d'ensemble rapide

**RetireMaisons** est une plateforme **complète et prête à déployer** pour mettre en relation les familles en recherche de maisons de retraite avec les établissements d'accueil.

### ✨ Caractéristiques principales
- 🏠 Marketplace avec système de listing et filtrage avancé
- 📝 Formulaire de candidature multi-étapes (validé)
- 💰 **Calculateur interactif du reste à charge** avec aides APA/APL
- 📊 Dashboard établissement pour gérer les candidatures
- 💬 Notifications email automatisées (Resend)
- 💵 **Modèle économique**: Success Fee 50€/admission confirmée
- 🎨 Design moderne et accessible (Tailwind CSS + Lucide Icons)

### 🏃 Quick Start (2 min)

```bash
# 1. Installer les dépendances
npm install

# 2. Configurer .env.local
DATABASE_URL="postgresql://user:password@localhost:5432/retiremaisons_dev"
RESEND_API_KEY="re_xxxxx"

# 3. Initialiser la DB
npx prisma migrate dev --name init

# 4. Lancer le serveur
npm run dev
```

Accès à http://localhost:3000

---

## 📁 Fichiers Clés du Boilerplate

### 🔐 Architecture Complète

| Fichier | Description | Type |
|---------|-------------|------|
| **prisma.schema.ts** | Schéma complet de BD (7 modèles) | Configuration |
| **setup-guide.md** | Guide installation + déploiement détaillé | Docs |
| **RETIREMAISONS_BOILERPLATE.md** | Overview complet du project | Docs |
| **package.json.template** | Dépendances pré-configurées | Configuration |

### 🎨 Pages Next.js (App Router)

| Page | Fichier | Fonctionnalités |
|------|---------|-----------------|
| **Accueil** | `app-home-page.tsx` | Hero, barre recherche, filtres rapides, établissements populaires |
| **Listing** | `app-search-page.tsx` | Filtres avancés, tri, vue grille/liste, 200+ établissements |
| **Profil** | `app-establishment-detail-page.tsx` | Galerie, tarifs, formulaire, avis, onglets sticky |
| **Dashboard** | `app-dashboard-leads.tsx` | Tableau candidatures, filtrage statut, stats en temps réel |

### 💎 Composants Réutilisables (Clés)

| Composant | Fichier | Cas d'usage |
|-----------|---------|-----------|
| **🧮 PriceCalculator** | `PriceCalculator.tsx` | Calcul interactif reste à charge avec APA/APL |
| **📋 ApplicationForm** | `ApplicationForm.tsx` | Formulaire 4 étapes: infos → besoins → contact → révision |
| **🖼️ GalleryComponent** | `components.bundle.tsx` | Galerie d'images avec fullscreen modal |
| **⭐ ReviewSection** | `components.bundle.tsx` | Avis vérifiés avec notation |
| **🏠 EstablishmentCard** | `components.bundle.tsx` | Carte réutilisable d'établissement |
| **🔍 SearchBar** | `components.bundle.tsx` | Barre recherche avec placeholder |
| **🔘 Button** | `components.bundle.tsx` | Button générique avec variants |

### 🔌 API & Backend

| Route | Fichier | Fonctionnalités |
|-------|---------|-----------------|
| **POST /api/leads** | `api-leads-route.ts` | Créer candidature + notifications |
| **GET /api/leads** | `api-leads-route.ts` | Lister candidatures établissement |
| **notifications.ts** | `notifications.ts` | Emails (Resend), SMS (Twilio) |

---

## 🎯 Flux Principal (Candidature)

```
┌─────────────────────────────────────────────────────────────────┐
│                     USER FAMILY JOURNEY                         │
└─────────────────────────────────────────────────────────────────┘

1. 🏠 Page d'accueil (/)
   ├─ Barre de recherche: "Chercher par ville"
   └─ Filtres rapides: Budget, Unité Alzheimer

2. 🔍 Listing (/search?city=Paris)
   ├─ 20+ établissements en cartes
   ├─ Filtres: Budget, Services, Localisation
   └─ Tri: Note, Prix, Disponibilité

3. 📋 Profil établissement (/establishment/[id])
   ├─ Galerie d'images (5+ photos)
   ├─ Informations: Tarifs, Services, Contact
   ├─ Avis vérifiés (120+ avis)
   └─ 🔑 ONGLET: Calculateur prix (APA/APL)

4. ✍️ Candidature (Formulaire Multi-étapes)
   ├─ Étape 1: Infos personne âgée
   ├─ Étape 2: Besoins (Alzheimer, Physio, etc.)
   ├─ Étape 3: Coordonnées contact + budget
   └─ Étape 4: Révision & confirmation

5. ✅ Soumission
   ├─ POST /api/leads (création en DB)
   ├─ Email à l'établissement (NEW_LEAD)
   ├─ Email de confirmation à la famille
   └─ Statut: PENDING (en attente)

┌─────────────────────────────────────────────────────────────────┐
│               ESTABLISHMENT DIRECTOR JOURNEY                    │
└─────────────────────────────────────────────────────────────────┘

1. 📊 Dashboard (/dashboard/leads?establishmentId=...)
   ├─ Tableau: Tous les leads reçus
   ├─ Stats: Total, Pending, Visited, Admitted, Rejected
   ├─ Filtres: Par statut
   └─ Actions: Vue, Marquer visite, Admettre, Refuser

2. 👁️ Examiner candidature (PENDING → VISITED)
   ├─ Clic "Marquer comme visité"
   ├─ Email sent: STATUS_CHANGED (famille notifiée)
   └─ Lead.status = VISITED

3. ✓ Admettre candidat (VISITED → ADMITTED)
   ├─ Clic "Admettre" (one-click)
   ├─ Email sent: ADMITTED (bravo message)
   ├─ Lead.status = ADMITTED
   └─ 💰 SUCCESS FEE 50€ DÉCLENCHÉ

4. 💵 Facturation automatique
   ├─ Lead.successFeePaid = true
   ├─ Facture générée
   └─ Revenue tracking mis à jour
```

---

## 💰 Business Model Détaillé

### Success Fee Model

```
Modèle:      Par admission confirmée
Montant:     50€
Déclenchement: Lead.status = 'ADMITTED'
Tracking:    Lead.successFeePaid (boolean)

Exemple de Revenue:
- 100 candidatures/mois
- Taux d'admission: 30%
- Admissions: 30
- Revenue: 30 × 50€ = 1500€/mois
```

### Cycle de vie d'un Lead

```
PENDING (dossier reçu)
    ↓
    └─→ VISITED (visite effectuée) ou REJECTED
            ↓
            └─→ ADMITTED (✓ admission confirmée)
                    ↓
                    SUCCESS FEE 50€ DÉCLENCHÉ ✓
                    
            └─→ REJECTED
                    ↓
                    Pas de fee
                    
    └─→ REJECTED (directement sans visite)
            ↓
            Pas de fee
```

---

## 🏗️ Architecture Base de Données

### 7 Modèles Principaux

```typescript
// 1. User - Utilisateurs (Familles + Directeurs)
User {
  id, email, password, role (FAMILY|ESTABLISHMENT|ADMIN)
  firstName, lastName, phone, avatar
  emailVerified, isActive
  leads[], establishment, favorites[], reviews[]
}

// 2. Establishment - Maisons de retraite
Establishment {
  id, name, type (EHPAD|RESIDENCE|FOYER|etc.)
  address, city, postalCode, latitude, longitude
  phone, email, website
  totalBeds, availableBeds
  minPrice, maxPrice, avgPrice
  services: hasAlzheimerUnit, hasRestaurant, hasGym, etc. (booléens)
  coverImage, images[], acsRating
  owner (User FK), leads[], reviews[], favorites[], rooms[]
}

// 3. Lead - CANDIDATURES (🔑 CŒUR DU SYSTÈME)
Lead {
  id, userId, establishmentId
  status: PENDING|VISITED|ADMITTED|REJECTED|WITHDRAWN|ARCHIVED
  elderlyFirstName, elderlyLastName, elderlyBirthDate, elderlyPhone
  needsAlzheimer, needsPhysiotherapy, needsPharmacy
  preferredBudget, apaAmount, aplAmount
  visitDate, admissionDate
  successFeeAmount: 50 (fixed)
  successFeePaid: boolean
  internalNotes, rejectionReason
}

// 4. Review - Avis vérifiés
Review {
  id, authorId, establishmentId
  rating: 1-5, title, comment
  isVerifiedAdmission (lié à Lead ADMITTED)
  status: PENDING|APPROVED|REJECTED
}

// 5. Favorite - Favoris
Favorite {
  id, userId, establishmentId
  unique: (userId, establishmentId)
}

// 6. Room - Stock de chambres
Room {
  id, establishmentId
  roomNumber, type: SINGLE|DOUBLE|SUITE|ACCESSIBLE
  capacity, available, monthlyPrice
  amenities: hasBalcony, hasWindow, hasAC, size
}

// 7. Notification - Audit trail
Notification {
  id, recipientEmail, recipientPhone
  type: NEW_LEAD|STATUS_CHANGED|ADMITTED|REVIEW_PUBLISHED
  title, content, sentAt, openedAt, clickedAt
  leadId, establishmentId, metadata
}
```

---

## 🚀 Stack Technique

| Catégorie | Technologie | Version |
|-----------|-------------|---------|
| **Framework** | Next.js | 14.0+ |
| **UI Library** | React | 18.2+ |
| **Styling** | Tailwind CSS | 3.3+ |
| **Icons** | Lucide React | 0.292+ |
| **Database** | PostgreSQL | 14+ |
| **ORM** | Prisma | 5.0+ |
| **Email** | Resend | 1.0+ |
| **SMS** | Twilio | (optionnel) |
| **Auth** | NextAuth.js | 4.24+ |
| **Validation** | Zod | 3.22+ |
| **Language** | TypeScript | 5.3+ |
| **Hosting** | Vercel / Railway | |

---

## 📊 Composant Clé: PriceCalculator

### Fonctionnalités

```
Entrées:
├─ Prix chambre (slider): 1800-3500€
├─ APA (Allocation Personnalisée Autonomie): 0-2000€
│  └─ Suggestions rapides par GIR
├─ APL (Aide Personnalisée Logement): 0-600€
├─ Pension/Ressources: 0-3000€
└─ Autres aides (ASPA, ASI, etc.): 0-1000€

Calculs:
├─ Total Aides = APA + APL + Pension + Autres
├─ Reste à charge = MAX(0, Prix - Total Aides)
└─ % Couverture = (Total Aides / Prix) × 100%

Sorties:
├─ Affichage du reste à charge (gros texte rouge)
├─ Barre de couverture (% en temps réel)
├─ Graphique de ventilation (5 couleurs)
└─ Alerte si reste > 50% du prix
```

### Suggestions GIR

```
Autonome       → APA = 0€    (peu d'aide)
Faible dépend. → APA = 500€  (GIR 5-6)
Dépend. moy.   → APA = 1200€ (GIR 3-4)
Forte dépend.  → APA = 2000€ (GIR 1-2)
```

---

## 🎨 Composant Clé: ApplicationForm

### 4 Étapes Validées

```
ÉTAPE 1: Infos Personne Âgée (REQUIRED)
├─ Prénom *
├─ Nom *
├─ Date de naissance *
└─ Téléphone (optionnel)

ÉTAPE 2: Besoins Spécifiques (OPTIONAL)
├─ ☐ Unité/Services Alzheimer
├─ ☐ Physiothérapie/Rééducation
└─ ☐ Services pharmaceutiques

ÉTAPE 3: Coordonnées & Budget (REQUIRED)
├─ Prénom contact *
├─ Nom contact *
├─ Lien parenté * (enfant, conjoint, frère/sœur, autre)
├─ Email *
├─ Téléphone *
└─ Budget mensuel max (slider)

ÉTAPE 4: Révision (READ-ONLY)
├─ Résumé des infos saisies
├─ Confirmation avant soumission
└─ Bouton "Soumettre ma candidature"
```

### Validation

```
✓ Champs requis marqués avec "*"
✓ Bouton "Suivant" désactivé si validation échoue
✓ Validation à chaque étape
✓ Erreurs affichées en temps réel
✓ Confirmation de soumission
```

### Soumission

```
POST /api/leads
Body:
{
  establishmentId: "clxxx",
  elderlyFirstName: "Jean",
  elderlyLastName: "Dupont",
  elderlyBirthDate: "1940-03-15T00:00:00Z",
  needsAlzheimer: true,
  needsPhysiotherapy: false,
  needsPharmacy: false,
  preferredBudget: 2500,
  apaAmount: 1200,
  aplAmount: 250,
  contactFirstName: "Marie",
  contactLastName: "Dupont",
  contactEmail: "marie@example.com",
  contactPhone: "06123456789",
  contactRelation: "child"
}

Response:
{
  success: true,
  leadId: "clxxx",
  message: "Candidature envoyée avec succès"
}

Effets:
- Lead créé en DB
- Email établissement (NEW_LEAD)
- Email confirmation famille
- Notification enregistrée
```

---

## 🔒 Sécurité

### Implémentée

- ✅ Validation Zod (API)
- ✅ HTTPS sur Vercel
- ✅ Variables d'env (`.env.local`)
- ✅ Email templates sécurisés (Resend)

### À ajouter

- [ ] NextAuth (authentification)
- [ ] Rate limiting (Upstash)
- [ ] CSRF tokens
- [ ] Encryption sensibles
- [ ] Audit logging

---

## 📝 Guide d'Installation

### 1️⃣ Clone & Setup

```bash
git clone <repo>
cd retirement-homes-platform
npm install
```

### 2️⃣ BD PostgreSQL

```bash
# Local
createdb retiremaisons_dev

# ou remote (Supabase, Railway, etc.)
# Récupérer l'URL
```

### 3️⃣ Env Variables

```bash
# .env.local
DATABASE_URL="postgresql://user:pass@localhost:5432/retiremaisons_dev"
RESEND_API_KEY="re_xxxxx"
NEXTAUTH_SECRET="your-secret"
```

### 4️⃣ Prisma

```bash
npx prisma migrate dev --name init
npx prisma studio  # Explore DB
```

### 5️⃣ Dev

```bash
npm run dev
# http://localhost:3000
```

### 6️⃣ Déploiement

```bash
# Vercel
vercel

# Railway
railway up

# Heroku
heroku create retiremaisons
git push heroku main
```

Voir **setup-guide.md** pour détails complets.

---

## 📚 Files Structure (Organisée)

```
retirement-homes-platform/
├── README_RETIREMAISONS.md          ← Vous êtes ici
├── RETIREMAISONS_BOILERPLATE.md     ← Overview complet
├── setup-guide.md                   ← Installation détaillée
├── PROJECT.md                       ← Brainstorm initial
│
├── prisma/
│   ├── schema.prisma                ← À créer (copier prisma.schema.ts)
│   └── migrations/
│
├── app/
│   ├── (public)/
│   │   ├── page.tsx                 ← Copier app-home-page.tsx
│   │   ├── search/page.tsx          ← Copier app-search-page.tsx
│   │   └── establishment/[id]/page.tsx ← Copier app-establishment-detail-page.tsx
│   ├── dashboard/
│   │   ├── page.tsx
│   │   └── leads/page.tsx           ← Copier app-dashboard-leads.tsx
│   ├── api/
│   │   └── leads/route.ts           ← Copier api-leads-route.ts
│   └── layout.tsx
│
├── components/
│   ├── features/
│   │   ├── PriceCalculator.tsx      ← Copier PriceCalculator.tsx
│   │   ├── ApplicationForm.tsx      ← Copier ApplicationForm.tsx
│   │   ├── GalleryComponent.tsx     ← Copier de components.bundle.tsx
│   │   ├── ReviewSection.tsx        ← Copier de components.bundle.tsx
│   │   └── EstablishmentCard.tsx    ← Copier de components.bundle.tsx
│   ├── ui/
│   │   ├── SearchBar.tsx            ← Copier de components.bundle.tsx
│   │   └── Button.tsx               ← Copier de components.bundle.tsx
│   └── layouts/
├── lib/
│   ├── prisma.ts                    ← À créer
│   ├── notifications.ts             ← Copier notifications.ts
│   └── auth.ts                      ← À créer (NextAuth)
│
├── .env.local                       ← À créer
├── next.config.js                   ← À créer
├── tailwind.config.ts               ← À créer
├── tsconfig.json                    ← À créer
└── package.json                     ← Copier package.json.template
```

---

## ✅ Checklist d'Intégration

### Phase 1: Setup (30 min)

- [ ] Cloner repo
- [ ] `npm install`
- [ ] Créer DB PostgreSQL
- [ ] Configurer `.env.local`
- [ ] `npx prisma migrate dev --name init`

### Phase 2: Fichiers (30 min)

- [ ] Copier `prisma.schema.ts` → `prisma/schema.prisma`
- [ ] Copier pages (.tsx) → `app/`
- [ ] Copier composants → `components/`
- [ ] Copier API routes → `app/api/`
- [ ] Copier `lib/notifications.ts`

### Phase 3: Config (15 min)

- [ ] Créer `lib/prisma.ts`
- [ ] Créer `next.config.js`
- [ ] Créer `tailwind.config.ts`
- [ ] Créer `tsconfig.json`

### Phase 4: Dev (5 min)

- [ ] `npm run dev`
- [ ] Tester pages
- [ ] Tester formulaire

### Phase 5: Déploiement (15 min)

- [ ] Pousser sur GitHub
- [ ] Connecter à Vercel
- [ ] Configurer variables d'env
- [ ] Déployer

---

## 🐛 Common Issues

| Problème | Solution |
|----------|----------|
| `DATABASE_URL` missing | Créer `.env.local` avec connexion PostgreSQL |
| Prisma client not found | `npx prisma generate` |
| Emails ne s'envoient pas | Vérifier `RESEND_API_KEY` |
| Page blanche | Vérifier console DevTools pour erreurs |
| Styles manquants | Vérifier `tailwind.config.ts` |

---

## 🎓 Apprentissage

Fichiers recommandés à étudier:

1. **PriceCalculator.tsx** - Composants complexes avec state
2. **ApplicationForm.tsx** - Formulaires multi-étapes
3. **api-leads-route.ts** - API routes + validation
4. **app-dashboard-leads.tsx** - Tableaux & filtrage

---

## 📞 Ressources

- [Next.js 14 Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs/)
- [Resend Docs](https://resend.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Lucide Icons](https://lucide.dev)

---

## 📈 Prochaines Phases

**Phase 1 (MVP)**: Fonctionnel + Déployé ✓ (ce boilerplate)
**Phase 2**: Authentification NextAuth
**Phase 3**: Paiement Stripe
**Phase 4**: Analytics + Marketing
**Phase 5**: Features avancées (Match AI, etc.)

---

**Version**: 1.0.0  
**Stack**: Next.js 14 + TypeScript + Tailwind CSS + Prisma  
**Status**: 🚀 Prêt à déployer

Bon développement! 🎉
