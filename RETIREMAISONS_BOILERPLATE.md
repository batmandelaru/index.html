# 🏥 RetireMaisons - Boilerplate Complet

## 📦 Contenus du Boilerplate

Ce boilerplate fournit une plateforme **SeLoger pour maisons de retraite** avec un business model à la performance (Success Fee 50€/admission).

### Fichiers Créés

#### 📋 Architecture & Configuration

1. **prisma.schema.ts** - Schéma complet de base de données
   - 7 modèles principaux (User, Establishment, Lead, Review, Favorite, Room, Notification)
   - Relations et indexes optimisés
   - Enums pour tous les statuts

2. **setup-guide.md** - Guide d'installation et configuration complet
   - Instructions PostgreSQL
   - Variables d'environnement
   - Déploiement sur Vercel/Railway
   - Dépannage et debugging

3. **package.json.template** - Dépendances préconfigurées
   - Next.js 14 + React 18
   - Prisma + Resend (emails)
   - Tailwind CSS + Lucide Icons
   - NextAuth (authentification optionnelle)

#### 🎨 Pages (Next.js 14 App Router)

4. **app-home-page.tsx** - Page d'accueil
   - Hero section avec barre de recherche
   - Filtres rapides (Budget, Alzheimer)
   - Section "Comment ça marche" (4 étapes)
   - Établissements populaires

5. **app-search-page.tsx** - Page de listing/recherche
   - Système de filtres avancés (Budget, Localisation, Services)
   - Tri dynamique (Note, Prix, Disponibilité)
   - Vue grille/liste
   - {filtered.length} résultats affichés

6. **app-establishment-detail-page.tsx** - Profil établissement
   - Galerie d'images interactive
   - Sections: Info, Candidature, Avis, Calculateur
   - Système d'onglets sticky
   - CTA "Postuler maintenant"

7. **app-dashboard-leads.tsx** - Dashboard établissement
   - Vue de toutes les candidatures
   - Filtrage par statut (PENDING, VISITED, ADMITTED, REJECTED)
   - Changement de statut en 1 clic
   - Stats en temps réel (total, pending, visited, admitted, rejected)

#### 💻 Composants Réutilisables

8. **PriceCalculator.tsx** - 🔑 COMPOSANT CLÉ
   - Calculateur interactif du reste à charge
   - Aides: APA (Allocation Personnalisée d'Autonomie)
   - Aides: APL (Aide Personnalisée au Logement)
   - Entrées rapides pour GIR (Autonome → Forte dépendance)
   - Graphique de ventilation en temps réel
   - Suggestions pédagogiques

9. **ApplicationForm.tsx** - 🔑 FORMULAIRE MULTI-ÉTAPES
   - Étape 1: Infos de la personne âgée
   - Étape 2: Besoins spécifiques
   - Étape 3: Coordonnées de contact & budget
   - Étape 4: Révision et confirmation
   - Validation à chaque étape
   - Soumission POST /api/leads

10. **components.bundle.tsx** - Composants UI
    - GalleryComponent: Galerie d'images avec fullscreen
    - ReviewSection: Avis vérifiés avec notation
    - EstablishmentCard: Carte réutilisable d'établissement
    - SearchBar: Barre de recherche avec autocomplétion
    - Button: Composant button générique avec variants

#### 🔗 API Routes

11. **api-leads-route.ts** - POST/GET /api/leads
    - Création de candidatures (POST)
    - Validation avec Zod
    - Création automatique d'utilisateurs
    - Envoi de notifications emails
    - Récupération des leads (GET)

#### 📧 Notifications

12. **notifications.ts** - Système de notifications
    - Intégration Resend pour emails
    - Template email établissement
    - Template email famille
    - Notifications de changement de statut
    - Support SMS (Twilio optionnel)

---

## 🎯 Fonctionnalités Principales

### 1. Système de Lead (Candidature)

```typescript
// Flux complet
User → ApplicationForm → /api/leads → Lead créé → Notifications → Dashboard établissement
                                     ↓
                           ADMITTED → SUCCESS FEE 50€
```

**Statuts d'un Lead**:
- PENDING: Dossier reçu, attente examen
- VISITED: Visite effectuée
- ADMITTED: ✓ Admission confirmée (déclenche success fee)
- REJECTED: Refusé
- WITHDRAWN: Retiré par la famille
- ARCHIVED: Archivé

### 2. Calculateur de Reste à Charge

**Entrées**:
- Prix de la chambre (slider 1800-3500€)
- APA: 0-2000€ (avec suggestionsgir)
- APL: 0-600€
- Pension: 0-3000€
- Autres aides: 0-1000€

**Sorties**:
- Reste à charge = MAX(0, Price - Total Aids)
- % de couverture
- Graphique de ventilation
- Alertes si reste > 50% du prix

### 3. Formulaire Multi-Étapes

**Saisies**:
1. Nom, prénom, date naissance (personne âgée)
2. Besoins: Alzheimer, Physio, Pharma (booléens)
3. Contact: Nom, email, phone, lien parenté
4. Révision avant soumission

**Validation**:
- Champs requis à chaque étape
- Bouton "Suivant" désactivé si invalide
- Confirmation avant soumission

### 4. Dashboard Établissement

**Fonctionnalités**:
- Affichage tableau de tous les leads
- Filtrage par statut
- Stats en temps réel (5 cartes)
- Changement statut 1 clic
- Actions: Marquer visite, Admettre, Refuser
- Contact direct par email

---

## 🏗️ Architecture de la Base de Données

### Modèles Principaux

```
User
├── email: unique
├── role: FAMILY | ESTABLISHMENT | ADMIN
├── leads: Lead[] (si FAMILY)
└── establishment: Establishment (si ESTABLISHMENT)

Establishment
├── name, type (EHPAD, RESIDENCE, etc.)
├── address, city, postalCode
├── minPrice, maxPrice, avgPrice
├── services: hasAlzheimerUnit, hasRestaurant, etc. (booléens)
├── images: string[]
├── owner: User
├── leads: Lead[]
├── reviews: Review[]
└── rooms: Room[]

Lead (🔑 CŒUR DU SYSTÈME)
├── user: User
├── establishment: Establishment
├── status: PENDING | VISITED | ADMITTED | REJECTED | WITHDRAWN
├── elderlyFirstName, elderlyLastName, elderlyBirthDate
├── needsAlzheimer, needsPhysiotherapy, needsPharmacy
├── preferredBudget
├── apaAmount, aplAmount
├── successFeeAmount: 50 (fixed)
├── successFeePaid: boolean (déclenché quand ADMITTED)
└── visitDate, admissionDate

Review
├── author: User
├── establishment: Establishment
├── rating: 1-5
├── isVerifiedAdmission: boolean (lié à un Lead ADMITTED)
└── status: PENDING | APPROVED | REJECTED

Favorite
├── user: User
├── establishment: Establishment
└── unique constraint: (userId, establishmentId)

Room
├── establishment: Establishment
├── roomNumber, type (SINGLE, DOUBLE, SUITE, ACCESSIBLE)
├── capacity, available
├── monthlyPrice
└── amenities: hasBalcony, hasWindow, hasAC

Notification (audit trail)
├── recipientEmail, recipientPhone
├── type: NEW_LEAD | LEAD_STATUS_CHANGED | LEAD_ADMITTED, etc.
├── leadId, establishmentId (FK)
└── metadata: JSON
```

---

## 🎨 Styles & Design

### Palette de Couleurs

```css
Primary: #2563eb (Bleu)
Success: #10b981 (Vert)
Warning: #f59e0b (Orange)
Danger: #ef4444 (Rouge)
Muted: #6b7280 (Gris)
```

### Composants Tailwind

- `.px-*, .py-*`: Padding
- `.rounded-lg`: Border radius
- `.shadow-md`: Ombres
- `.hover:*`: États au survol
- `.transition`: Animations fluides
- `.grid, .flex`: Mise en page

### Icônes Lucide

- `Heart, Star, MapPin, DollarSign`: Visuels
- `ChevronLeft, ChevronRight`: Navigation
- `Check, X`: Actions
- `AlertCircle, Info`: Informations

---

## 🚀 Stack Technique

| Couche | Technology |
|--------|-----------|
| **Frontend** | Next.js 14 (App Router) + React 18 |
| **Styling** | Tailwind CSS 3 + Lucide Icons |
| **Database** | PostgreSQL + Prisma ORM |
| **Authentification** | NextAuth.js (optionnel) |
| **Emails** | Resend API |
| **SMS** | Twilio (optionnel) |
| **Validation** | Zod |
| **Déploiement** | Vercel / Railway / Heroku |

---

## 📊 API Endpoints (à implémenter)

```
POST   /api/leads              # Créer un lead
GET    /api/leads?establishmentId=...  # Lister les leads
PATCH  /api/leads/[id]         # Mettre à jour statut
DELETE /api/leads/[id]         # Supprimer un lead
GET    /api/establishments     # Lister établissements
GET    /api/establishments/[id] # Détail établissement
POST   /api/reviews            # Créer un avis
GET    /api/reviews?establishmentId=... # Lister avis
POST   /api/favorites          # Ajouter favori
DELETE /api/favorites/[id]     # Retirer favori
```

---

## 💰 Business Model

### Success Fee

- **Montant**: 50€ par admission confirmée
- **Déclenchement**: Quand `Lead.status = ADMITTED`
- **Tracking**: `Lead.successFeePaid` boolean
- **Revenue**: Plateforme facture établissement automatiquement

### Calcul du Revenu

```
Revenue = Count(Lead.status == ADMITTED) × 50€
```

### Exemple

- 100 candidatures/mois
- Taux admission: 30%
- Revenue mensuel: 30 × 50€ = **1500€**

---

## 🔒 Sécurité

### Implémentations incluses

1. **API Validation** (Zod)
   ```typescript
   const CreateLeadSchema = z.object({
     establishmentId: z.string().cuid(),
     elderlyFirstName: z.string().min(2),
     // ...
   });
   ```

2. **Rate Limiting** (optionnel, à ajouter)
   ```typescript
   // Limiter 10 requêtes/minute par IP
   ```

3. **Authentication** (NextAuth)
   ```typescript
   // Sessions + JWT
   ```

4. **HTTPS Enforced** (Vercel automatic)

### À implémenter

- [ ] Authentification NextAuth + magic links
- [ ] CSRF tokens
- [ ] Rate limiting (Upstash)
- [ ] Encryption des données sensibles
- [ ] Audit logging

---

## 📈 Métriques & Analytics

À intégrer:

```typescript
// events.ts
export function trackLeadCreated(leadId: string) {
  // Plausible / Mixpanel
}

export function trackAdmissionConfirmed(leadId: string) {
  // Revenue event
}
```

---

## 🎓 Instructions d'Utilisation

### 1. Installation

```bash
npm install
npx prisma migrate dev --name init
npm run dev
```

### 2. Configuration

- Définir `DATABASE_URL` (.env.local)
- Ajouter `RESEND_API_KEY`
- (Optionnel) Configurer NextAuth

### 3. Déploiement

```bash
# Vercel
vercel

# Variables d'env: DATABASE_URL, RESEND_API_KEY, NEXTAUTH_SECRET
```

### 4. Customisation

1. **Couleurs**: Modifier `tailwind.config.ts`
2. **Tarifs**: Ajuster `minPrice`, `maxPrice` dans Establishment
3. **Services**: Ajouter booléens dans Establishment schema
4. **Success Fee**: Modifier `Lead.successFeeAmount` (actuellement 50€)

---

## 📚 Prochaines Étapes

### Phase 1: MVP (Semaine 1-2)
- [ ] Déployer sur Vercel
- [ ] Configurer DB PostgreSQL
- [ ] Tester formulaire de candidature
- [ ] Vérifier notifications Resend

### Phase 2: Authentification (Semaine 3)
- [ ] Implémenter NextAuth
- [ ] Pages login/register
- [ ] Dashboard utilisateur

### Phase 3: Paiement (Semaine 4)
- [ ] Intégrer Stripe
- [ ] Factures automatiques
- [ ] Dashboard financier

### Phase 4: Marketing (Semaine 5+)
- [ ] SEO optimization
- [ ] Google Analytics
- [ ] Email marketing (Resend)
- [ ] Social media integration

---

## 🐛 Troubleshooting

### Erreur: "DATABASE_URL not found"
```bash
# Vérifier .env.local
echo $DATABASE_URL

# Ou créer une DB PostgreSQL locale
createdb retiremaisons_dev
```

### Erreur: "Prisma client not found"
```bash
npx prisma generate
```

### Emails ne s'envoient pas
```bash
# Vérifier RESEND_API_KEY
# https://dashboard.resend.com/api-keys
```

---

## 📞 Support & Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Prisma Docs**: https://www.prisma.io/docs
- **Resend Docs**: https://resend.com/docs
- **Tailwind Docs**: https://tailwindcss.com/docs
- **Lucide Icons**: https://lucide.dev

---

## 📜 License

MIT

---

**Version**: 1.0.0  
**Créé**: Avril 2024  
**Maintenu par**: Claude Code
