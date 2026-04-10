# RetireMaisons - Plateforme de Mise en Relation pour Maisons de Retraite

## 🎯 Vue d'ensemble du projet

**RetireMaisons** est une plateforme marketplace pour connecter les familles en recherche de maisons de retraite avec les établissements d'accueil. 

- **Stack**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Prisma, PostgreSQL
- **Business Model**: Success Fee (50€ par admission confirmée)
- **Audience**: Familles/Aidants ↔ Directeurs d'établissement

## 📁 Structure du Projet

```
retirement-homes-platform/
├── app/
│   ├── (auth)/                      # Pages d'authentification
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (public)/
│   │   ├── page.tsx                 # Accueil
│   │   ├── search/page.tsx          # Listing des établissements
│   │   └── establishment/[id]/page.tsx  # Profil établissement
│   ├── api/
│   │   ├── leads/route.ts           # Créer un lead/dossier
│   │   ├── establishments/route.ts
│   │   ├── auth/[...nextauth]/route.ts
│   │   └── notifications/route.ts
│   ├── dashboard/                   # Espace établissement
│   │   ├── page.tsx
│   │   └── leads/page.tsx
│   └── layout.tsx
├── components/
│   ├── ui/                          # Composants réutilisables
│   │   ├── SearchBar.tsx
│   │   ├── Card.tsx
│   │   ├── Button.tsx
│   │   └── Modal.tsx
│   ├── features/
│   │   ├── EstablishmentCard.tsx
│   │   ├── PriceCalculator.tsx      # Calculateur reste à charge
│   │   ├── ApplicationForm.tsx      # Formulaire multi-étapes
│   │   ├── ReviewSection.tsx
│   │   └── GalleryComponent.tsx
│   ├── layouts/
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   └── providers/
│       └── Providers.tsx
├── lib/
│   ├── prisma.ts                    # Client Prisma
│   ├── auth.ts                      # NextAuth config
│   ├── notifications.ts             # Resend/Twilio
│   └── validators.ts                # Zod schemas
├── prisma/
│   ├── schema.prisma               # Schéma de base de données
│   └── migrations/
├── public/
│   └── images/
├── .env.local
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## 🗄️ Entités Clés (Prisma)

1. **User** → Familles/Aidants + Directeurs
2. **Establishment** → Maisons de retraite
3. **Lead** → Candidature (cœur du système)
4. **Review** → Avis vérifiés
5. **Favorite** → Favoris
6. **Room** → Stock de chambres

## 🎨 Pages Principales

1. **Accueil** (`/`) - Barre de recherche + filtres rapides
2. **Listing** (`/search`) - Cartes, prix dynamiques, badges
3. **Profil** (`/establishment/[id]`) - Galerie, tarifs, formulaire
4. **Dashboard** (`/dashboard`) - Gestion des prospects

## 📋 Prochaines étapes

1. Générer le schema Prisma
2. Créer les pages clés
3. Créer les composants réutilisables
4. Implémenter les API routes
5. Intégrer les notifications
