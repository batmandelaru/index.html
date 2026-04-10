# 🚀 RetireMaisons - Guide de Configuration Complet

Plateforme de mise en relation pour maisons de retraite (SeLoger des EHPAD).

## 📋 Table des matières

1. [Installation du projet](#installation)
2. [Configuration de la base de données](#base-de-données)
3. [Variables d'environnement](#variables-denvironnement)
4. [Structure des fichiers](#structure)
5. [Fonctionnement clé](#fonctionnement)
6. [Déploiement](#déploiement)

---

## Installation

### Prérequis
- Node.js 18+ et npm/yarn
- PostgreSQL 14+
- Compte Resend (emails)

### Étapes

```bash
# 1. Cloner le repo
git clone <repo-url>
cd retirement-homes-platform

# 2. Installer les dépendances
npm install

# 3. Copier les fichiers d'env
cp .env.example .env.local

# 4. Initialiser Prisma
npx prisma init

# 5. Créer les tables
npx prisma migrate dev --name init

# 6. Générer le client Prisma
npx prisma generate

# 7. Lancer le serveur dev
npm run dev
```

L'app sera accessible sur **http://localhost:3000**

---

## Base de Données

### Configuration PostgreSQL

```bash
# Créer une DB locale (macOS/Linux)
createdb retiremaisons_dev

# Dans .env.local:
DATABASE_URL="postgresql://user:password@localhost:5432/retiremaisons_dev"
```

### Initialiser Prisma

```bash
# Créer le fichier schema
touch prisma/schema.prisma

# Copier le contenu du fichier prisma.schema.ts fourni
# (à insérer dans prisma/schema.prisma)

# Créer les tables
npx prisma migrate dev --name init

# Vérifier la DB
npx prisma studio  # Ouvre une UI pour explorer les données
```

### Modèles principaux

| Modèle | Description |
|--------|-------------|
| **User** | Familles/Aidants + Directeurs d'établissement |
| **Establishment** | Maisons de retraite avec infos, tarifs, services |
| **Lead** | Candidatures (cœur du business - déclenche success fee) |
| **Review** | Avis vérifiés des résidents |
| **Favorite** | Favoris des utilisateurs |
| **Room** | Stock de chambres disponibles |
| **Notification** | Historique des notifications envoyées |

---

## Variables d'Environnement

Créer un fichier `.env.local` à la racine:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/retiremaisons_dev"

# Resend (Emails)
RESEND_API_KEY="re_xxxxx"

# NextAuth (Authentification optionnelle)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Twilio (SMS optionnel)
TWILIO_ACCOUNT_SID="ACxxxxxxx"
TWILIO_AUTH_TOKEN="xxxxx"
TWILIO_PHONE_NUMBER="+1234567890"

# API URLs
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

---

## Structure des Fichiers

```
app/
├── (public)/
│   ├── page.tsx                  # Accueil
│   ├── search/page.tsx           # Listing établissements
│   └── establishment/[id]/page.tsx # Profil établissement
├── dashboard/
│   ├── page.tsx                  # Dashboard établissement
│   └── leads/page.tsx            # Gestion des candidatures
├── api/
│   ├── leads/route.ts            # POST: Créer un lead
│   └── notifications/route.ts    # Envoyer notifications
└── layout.tsx

components/
├── features/
│   ├── PriceCalculator.tsx       # Calculateur reste à charge 🔑
│   ├── ApplicationForm.tsx       # Formulaire multi-étapes 🔑
│   ├── GalleryComponent.tsx      # Galerie d'images
│   ├── ReviewSection.tsx         # Avis vérifiés
│   └── EstablishmentCard.tsx     # Carte établissement
├── ui/
│   ├── SearchBar.tsx
│   └── Button.tsx
└── layouts/
    ├── Header.tsx
    └── Footer.tsx

lib/
├── prisma.ts                     # Client Prisma
├── auth.ts                       # NextAuth config
├── notifications.ts              # Resend + Twilio
└── validators.ts                 # Zod schemas

prisma/
├── schema.prisma                 # Schéma de la DB
└── migrations/
```

---

## Fonctionnement Clé

### 🔄 Flux d'une Candidature

```
1. Utilisateur remplit formulaire sur /establishment/[id]
   ↓
2. ApplicationForm envoie POST /api/leads
   ↓
3. API crée un Lead (candidature) en DB
   ↓
4. Email envoyé à l'établissement (Resend)
   ↓
5. Email de confirmation à la famille
   ↓
6. Directeur consulte dashboard et change statut
   ↓
7. Si ADMITTED → Success Fee 50€ déclenché ✓
```

### 💰 Business Model

- **Success Fee**: 50€ par admission confirmée
- Déclenché quand: `Lead.status = 'ADMITTED'`
- Tracked via: `Lead.successFeePaid`

### 🔐 Authentification

Implémentation NextAuth (optionnelle, à configurer):

```typescript
// lib/auth.ts
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions = {
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        // Vérifier email/password
        const user = await prisma.user.findUnique({
          where: { email: credentials?.email }
        });
        // ... validation
        return user;
      }
    })
  ]
};
```

### 📧 Notifications

**Resend** (pour les emails):

```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: 'noreply@retiremaisons.fr',
  to: recipient.email,
  subject: 'Nouvelle candidature',
  html: '<h1>Hello!</h1>'
});
```

---

## Composants Clés

### 1️⃣ PriceCalculator (Calculateur de reste à charge)

```tsx
<PriceCalculator minPrice={2500} maxPrice={3500} />
```

**Fonctionnalités**:
- Saisie interactive du prix de chambre
- Déduction APA (Allocation Personnalisée d'Autonomie)
- Déduction APL (Aide Personnalisée au Logement)
- Graphique de ventilation
- Calcul en temps réel du reste à charge

### 2️⃣ ApplicationForm (Formulaire multi-étapes)

```tsx
<ApplicationForm 
  establishmentId="123"
  establishmentName="Résidence Les Chênes"
/>
```

**Étapes**:
1. Infos de la personne âgée
2. Besoins spécifiques (Alzheimer, physio, etc.)
3. Coordonnées de contact
4. Révision et confirmation

---

## API Routes

### POST /api/leads

Crée une candidature et envoie les notifications.

**Body**:
```json
{
  "establishmentId": "clxxx",
  "elderlyFirstName": "Jean",
  "elderlyLastName": "Dupont",
  "elderlyBirthDate": "1940-03-15T00:00:00Z",
  "needsAlzheimer": true,
  "preferredBudget": 2500,
  "apaAmount": 1200,
  "aplAmount": 250,
  "contactFirstName": "Marie",
  "contactLastName": "Dupont",
  "contactEmail": "marie@example.com",
  "contactPhone": "06123456789",
  "contactRelation": "child"
}
```

**Response**:
```json
{
  "success": true,
  "leadId": "clxxx",
  "message": "Candidature envoyée avec succès"
}
```

### GET /api/leads?establishmentId=clxxx

Récupère les candidatures d'un établissement.

---

## Tailwind CSS

**tailwind.config.ts**:
```typescript
import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
      }
    },
  },
  plugins: [],
} satisfies Config
```

---

## Package.json

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@prisma/client": "^5.0.0",
    "resend": "^1.0.0",
    "lucide-react": "^0.292.0",
    "zod": "^3.22.0",
    "next-auth": "^4.24.0"
  },
  "devDependencies": {
    "typescript": "^5.2.0",
    "@types/react": "^18.2.0",
    "tailwindcss": "^3.3.0",
    "postcss": "^8.4.31",
    "autoprefixer": "^10.4.16",
    "prisma": "^5.0.0"
  },
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "db:push": "prisma db push",
    "db:studio": "prisma studio"
  }
}
```

---

## 🚀 Déploiement

### Sur Vercel

```bash
# 1. Pousser le code sur GitHub
git push origin main

# 2. Connecter à Vercel
vercel

# 3. Définir les variables d'env dans Vercel
# DATABASE_URL, RESEND_API_KEY, NEXTAUTH_SECRET

# 4. Migrer la DB en production
vercel env pull .env.production.local
npx prisma migrate deploy
```

### Sur Railway / Heroku

```bash
# Railway
railway login
railway init
railway up

# Heroku
heroku create retiremaisons
heroku config:set DATABASE_URL="..."
git push heroku main
```

---

## 🔍 Debugging

### Logs Prisma

```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error']
});

export default prisma;
```

### Studio Prisma

```bash
npx prisma studio
# Ouvre http://localhost:5555
```

### Vérifier les données

```bash
# Connecter à la DB PostgreSQL
psql -d retiremaisons_dev

# SQL: SELECT COUNT(*) FROM "Lead";
```

---

## 📝 Prochaines Étapes

- [ ] Intégrer NextAuth pour authentification
- [ ] Ajouter un système de paiement (Stripe)
- [ ] Implémenter un dashboard établissement complet
- [ ] Ajouter des tests (Jest + React Testing Library)
- [ ] Configurer les emails avec templates Resend
- [ ] Mettre en place un système de soutien (chat, ticket)
- [ ] Analytics (Plausible, Mixpanel)

---

## 📧 Support

Questions? Consultez:
- **Documentation Next.js**: https://nextjs.org/docs
- **Documentation Prisma**: https://www.prisma.io/docs/
- **Documentation Resend**: https://resend.com/docs
- **Documentation Tailwind**: https://tailwindcss.com/docs
