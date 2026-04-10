/**
 * PRISMA SCHEMA - RetireMaisons Platform
 *
 * Modèles:
 * - User: Familles/Aidants + Directeurs
 * - Establishment: Maisons de retraite
 * - Lead: Candidatures (cœur du business)
 * - Review: Avis vérifiés
 * - Favorite: Favoris des utilisateurs
 * - Room: Stock de chambres
 * - Notification: Historique notifications
 *
 * Usage:
 * npx prisma init
 * npx prisma migrate dev --name init
 */

// Copiez ce contenu dans prisma/schema.prisma

/*
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============= AUTHENTIFICATION & UTILISATEURS =============

enum UserRole {
  FAMILY        // Famille/Aidant à la recherche d'établissement
  ESTABLISHMENT // Directeur/Admin d'établissement
  ADMIN         // Admin plateforme
}

enum ContactPreference {
  EMAIL
  PHONE
  SMS
}

model User {
  id String @id @default(cuid())
  email String @unique
  password String
  role UserRole @default(FAMILY)

  // Profil
  firstName String
  lastName String
  phone String?
  avatar String?

  // Statut
  emailVerified Boolean @default(false)
  emailVerifiedAt DateTime?
  isActive Boolean @default(true)

  // Préférences
  contactPreference ContactPreference @default(EMAIL)
  newsletter Boolean @default(true)

  // Relations
  leads Lead[] // Si FAMILY: candidatures envoyées
  establishment Establishment? // Si ESTABLISHMENT: maison de retraite
  favorites Favorite[]
  reviews Review[]

  // Audit
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  lastLoginAt DateTime?

  @@index([email])
  @@index([role])
}

// ============= ÉTABLISSEMENTS (MAISONS DE RETRAITE) =============

enum EstablishmentType {
  EHPAD           // Établissement d'Hébergement pour Personnes Âgées Dépendantes
  RESIDENCE       // Résidence autonomie
  FOYER_LOGEMENT  // Foyer logement
  FAMILY_HOME     // Maison accueil familiale
}

enum ServiceType {
  RESTAURANT
  CINEMA
  LIBRARY
  GYM
  GARDEN
  POOL
  SPA
  CHAPLAIN
  HAIRDRESSER
  PHARMACY
  PHYSIOTHERAPY
  PSYCHOLOGY
  NURSE_24H
  ALZHEIMER_UNIT
  DEMENTIA_UNIT
}

model Establishment {
  id String @id @default(cuid())

  // Infos de base
  name String
  type EstablishmentType
  description String?
  website String?
  phone String
  email String

  // Localisation
  address String
  postalCode String
  city String
  latitude Float?
  longitude Float?

  // Capacité & chambres
  totalBeds Int @default(0)
  availableBeds Int @default(0)

  // Tarification
  minPrice Float @default(0)     // Prix min chambre/mois
  maxPrice Float @default(0)     // Prix max chambre/mois
  avgPrice Float @default(0)

  // Services (booléens)
  hasAlzheimerUnit Boolean @default(false)
  hasDementiaUnit Boolean @default(false)
  hasRestaurant Boolean @default(false)
  hasCinema Boolean @default(false)
  hasLibrary Boolean @default(false)
  hasGym Boolean @default(false)
  hasGarden Boolean @default(false)
  hasPool Boolean @default(false)
  hasSpa Boolean @default(false)
  hasChaplain Boolean @default(false)
  hasHairdresser Boolean @default(false)
  hasPharmacy Boolean @default(false)
  hasPhysiotherapy Boolean @default(false)
  hasPsychology Boolean @default(false)
  hasNurse24h Boolean @default(false)

  // Images & galerie
  coverImage String?
  images String[] @default([])  // JSON array of image URLs

  // Certifications & qualité
  acsRating Float? @default(0)   // Note ACS (0-5)
  accreditations String[] @default([])

  // Statut
  isVerified Boolean @default(false)
  isActive Boolean @default(true)

  // Relations
  owner User @relation(fields: [ownerId], references: [id], onDelete: Cascade)
  ownerId String

  leads Lead[]
  favorites Favorite[]
  reviews Review[]
  rooms Room[]

  // Audit
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  verifiedAt DateTime?

  @@index([city])
  @@index([postalCode])
  @@index([ownerId])
  @@fulltext([name, city, description])
}

// ============= CHAMBRES (STOCK) =============

enum RoomType {
  SINGLE          // Chambre simple
  DOUBLE          // Chambre double
  SUITE           // Suite avec salon
  ACCESSIBLE      // PMR accessible
}

model Room {
  id String @id @default(cuid())

  establishment Establishment @relation(fields: [establishmentId], references: [id], onDelete: Cascade)
  establishmentId String

  roomNumber String
  type RoomType

  // Capacité & disponibilité
  capacity Int @default(1)
  available Boolean @default(true)

  // Tarification
  monthlyPrice Float
  description String?

  // Amenities
  hasBalcony Boolean @default(false)
  hasWindow Boolean @default(true)
  hasAirConditioning Boolean @default(false)
  size Int? // m²

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([establishmentId, roomNumber])
}

// ============= LEADS (CŒUR DU SYSTÈME) =============

enum LeadStatus {
  PENDING       // Dossier reçu, en attente de confirmation
  VISITED       // Visite effectuée
  ADMITTED      // ADMIS = SUCCESS FEE DÉCLENCHÉ (50€)
  REJECTED      // Refusé
  WITHDRAWN     // Retiré par la famille
  ARCHIVED      // Archivé
}

model Lead {
  id String @id @default(cuid())

  // Relations clés
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId String

  establishment Establishment @relation(fields: [establishmentId], references: [id], onDelete: Cascade)
  establishmentId String

  // Statut
  status LeadStatus @default(PENDING)

  // Infos du candidat (formulaire)
  elderlyFirstName String
  elderlyLastName String
  elderlyBirthDate DateTime
  elderlyPhone String?

  // Besoin spécifique
  needsAlzheimer Boolean @default(false)
  needsPhysiotherapy Boolean @default(false)
  needsPharmacy Boolean @default(false)
  preferredBudget Float? // Budget mensuel max acceptable

  // Aide sociale (pour calculateur)
  apaAmount Float @default(0)      // Allocation Personnalisée d'Autonomie
  aplAmount Float @default(0)      // Aide Personnalisée au Logement

  // Statut admission
  visitDate DateTime?
  admissionDate DateTime?

  // Revenue tracking (business model)
  successFeeAmount Float @default(50)  // Fee versée au PLATAFORM
  successFeePaid Boolean @default(false)
  successFeePaidAt DateTime?

  // Notes internes
  internalNotes String? @db.Text
  rejectionReason String?

  // Notifications
  lastNotificationSentAt DateTime?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([userId, establishmentId])
  @@index([status])
  @@index([userId])
  @@index([establishmentId])
}

// ============= FAVORIS =============

model Favorite {
  id String @id @default(cuid())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId String

  establishment Establishment @relation(fields: [establishmentId], references: [id], onDelete: Cascade)
  establishmentId String

  createdAt DateTime @default(now())

  @@unique([userId, establishmentId])
}

// ============= AVIS (REVIEWS VÉRIFIÉS) =============

enum ReviewStatus {
  PENDING      // En attente de modération
  APPROVED     // Publié
  REJECTED     // Refusé
}

model Review {
  id String @id @default(cuid())

  author User @relation(fields: [authorId], references: [id], onDelete: Cascade)
  authorId String

  establishment Establishment @relation(fields: [establishmentId], references: [id], onDelete: Cascade)
  establishmentId String

  // Review data
  rating Int @db.SmallInt // 1-5
  title String
  comment String @db.Text

  // Vérification
  isVerifiedAdmission Boolean @default(false) // Vérifié via Lead admission
  verificationLeadId String?

  // Modération
  status ReviewStatus @default(PENDING)

  // Modération
  moderatedAt DateTime?
  moderationNotes String?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([establishmentId])
  @@index([authorId])
  @@index([status])
}

// ============= NOTIFICATIONS (AUDIT TRAIL) =============

enum NotificationType {
  NEW_LEAD
  LEAD_STATUS_CHANGED
  LEAD_ADMITTED
  LEAD_REJECTED
  REVIEW_PUBLISHED
  ACCOUNT_VERIFIED
}

model Notification {
  id String @id @default(cuid())

  // Pour tracer les notifications envoyées
  recipientEmail String
  recipientPhone String?

  type NotificationType
  title String
  content String

  // Tracking
  sentAt DateTime @default(now())
  openedAt DateTime?
  clickedAt DateTime?

  // Metadata
  leadId String?
  establishmentId String?
  metadata String? @db.Json

  createdAt DateTime @default(now())
}

*/
