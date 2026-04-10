/**
 * app/(public)/establishment/[id]/page.tsx
 * PAGE PROFIL ÉTABLISSEMENT
 *
 * Sections:
 * - Galerie d'images
 * - Infos générales + Tarifs
 * - Formulaire de candidature multi-étapes
 * - Avis vérifiés
 * - Services & amenités
 */

'use client';

import { useState } from 'react';
import Image from 'next/image';
import { MapPin, Phone, Globe, Star, Heart, ShoppingCart, Users } from 'lucide-react';
import GalleryComponent from '@/components/features/GalleryComponent';
import ApplicationForm from '@/components/features/ApplicationForm';
import ReviewSection from '@/components/features/ReviewSection';
import PriceCalculator from '@/components/features/PriceCalculator';

// Données mockées
const ESTABLISHMENT_DATA = {
  id: '1',
  name: 'Résidence Les Chênes',
  type: 'EHPAD',
  city: 'Paris',
  postalCode: '75001',
  address: '42 Avenue des Champs-Élysées',
  phone: '01 23 45 67 89',
  email: 'contact@residenceles-chenes.fr',
  website: 'https://residenceles-chenes.fr',
  description: `Résidence d'hébergement pour personnes âgées dépendantes (EHPAD) depuis 1985.
    Notre établissement propose un cadre de vie rassurant et convivial, avec une équipe médicale disponible 24h/24.
    Situé en plein cœur de Paris, La Résidence Les Chênes bénéficie d'une accessibilité optimale et de services de qualité.`,
  coverImage: '/images/residence-1.jpg',
  images: [
    '/images/residence-1.jpg',
    '/images/residence-entrance.jpg',
    '/images/residence-room.jpg',
    '/images/residence-garden.jpg',
    '/images/residence-dining.jpg'
  ],
  rating: 4.8,
  reviews: 124,
  totalBeds: 45,
  availableBeds: 3,
  minPrice: 2500,
  maxPrice: 3500,
  avgPrice: 3000,
  hasAlzheimerUnit: true,
  hasDementiaUnit: false,
  hasRestaurant: true,
  hasCinema: true,
  hasLibrary: true,
  hasGym: true,
  hasGarden: true,
  hasPool: false,
  hasPhysiotherapy: true,
  hasNurse24h: true,
  acsRating: 4.5,
  isVerified: true
};

type TabType = 'info' | 'application' | 'reviews' | 'calculator';

export default function EstablishmentDetailPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState<TabType>('info');
  const [isFavorite, setIsFavorite] = useState(false);

  const services = [
    { name: 'Restaurant', icon: '🍽️', value: ESTABLISHMENT_DATA.hasRestaurant },
    { name: 'Cinéma', icon: '🎬', value: ESTABLISHMENT_DATA.hasCinema },
    { name: 'Bibliothèque', icon: '📚', value: ESTABLISHMENT_DATA.hasLibrary },
    { name: 'Salle de gym', icon: '💪', value: ESTABLISHMENT_DATA.hasGym },
    { name: 'Jardin', icon: '🌳', value: ESTABLISHMENT_DATA.hasGarden },
    { name: 'Physiothérapie', icon: '🏥', value: ESTABLISHMENT_DATA.hasPhysiotherapy },
    { name: 'Infirmiers 24h/24', icon: '⚕️', value: ESTABLISHMENT_DATA.hasNurse24h },
    { name: 'Unité Alzheimer', icon: '🧠', value: ESTABLISHMENT_DATA.hasAlzheimerUnit }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Galerie */}
      <section className="bg-white">
        <div className="container mx-auto px-4 py-8">
          <GalleryComponent images={ESTABLISHMENT_DATA.images} />
        </div>
      </section>

      {/* Header Info */}
      <section className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            {/* Left */}
            <div className="flex-1">
              <div className="flex items-start gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{ESTABLISHMENT_DATA.name}</h1>
                  <div className="flex items-center gap-2 mt-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{ESTABLISHMENT_DATA.address}, {ESTABLISHMENT_DATA.postalCode} {ESTABLISHMENT_DATA.city}</span>
                  </div>
                </div>
              </div>

              {/* Rating & Availability */}
              <div className="flex flex-wrap gap-4 mt-4">
                <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <div>
                    <div className="font-bold">{ESTABLISHMENT_DATA.rating}</div>
                    <div className="text-sm text-gray-600">{ESTABLISHMENT_DATA.reviews} avis</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-lg">
                  <Users className="w-5 h-5 text-green-600" />
                  <div>
                    <div className="font-bold">{ESTABLISHMENT_DATA.availableBeds} place(s)</div>
                    <div className="text-sm text-gray-600">disponible(s)</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right - CTA Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`p-3 rounded-lg transition ${
                  isFavorite
                    ? 'bg-red-100 text-red-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title="Ajouter aux favoris"
              >
                <Heart className="w-6 h-6" fill={isFavorite ? 'currentColor' : 'none'} />
              </button>
              <button
                onClick={() => setActiveTab('application')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition flex items-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                Postuler maintenant
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* TABS */}
      <div className="bg-white border-b sticky top-20 z-10">
        <div className="container mx-auto px-4">
          <div className="flex gap-8 overflow-x-auto">
            {(['info', 'application', 'reviews', 'calculator'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-2 font-semibold border-b-2 transition whitespace-nowrap ${
                  activeTab === tab
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab === 'info' && 'Informations'}
                {tab === 'application' && 'Candidature'}
                {tab === 'reviews' && 'Avis'}
                {tab === 'calculator' && 'Calculateur'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CONTENU DES TABS */}
      <div className="container mx-auto px-4 py-8">
        {/* TAB: INFO */}
        {activeTab === 'info' && (
          <div className="max-w-4xl space-y-12">
            {/* Description */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">À propos</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{ESTABLISHMENT_DATA.description}</p>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Informations de contact</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <a
                  href={`tel:${ESTABLISHMENT_DATA.phone}`}
                  className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition"
                >
                  <Phone className="w-6 h-6 text-blue-600" />
                  <div>
                    <div className="text-sm text-gray-600">Téléphone</div>
                    <div className="font-semibold">{ESTABLISHMENT_DATA.phone}</div>
                  </div>
                </a>
                <a
                  href={`mailto:${ESTABLISHMENT_DATA.email}`}
                  className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition"
                >
                  <div className="w-6 h-6 text-blue-600">📧</div>
                  <div>
                    <div className="text-sm text-gray-600">Email</div>
                    <div className="font-semibold text-sm">{ESTABLISHMENT_DATA.email}</div>
                  </div>
                </a>
                <a
                  href={ESTABLISHMENT_DATA.website}
                  target="_blank"
                  className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition"
                >
                  <Globe className="w-6 h-6 text-blue-600" />
                  <div>
                    <div className="text-sm text-gray-600">Site web</div>
                    <div className="font-semibold text-sm truncate">{ESTABLISHMENT_DATA.website}</div>
                  </div>
                </a>
              </div>
            </section>

            {/* Tarifs */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Tarifs</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="p-6 bg-blue-50 rounded-lg border-2 border-blue-200">
                  <div className="text-sm text-gray-600 mb-1">Prix minimum</div>
                  <div className="text-3xl font-bold text-blue-600">{ESTABLISHMENT_DATA.minPrice.toLocaleString('fr-FR')}€</div>
                  <div className="text-sm text-gray-500 mt-2">/mois</div>
                </div>
                <div className="p-6 bg-green-50 rounded-lg border-2 border-green-200">
                  <div className="text-sm text-gray-600 mb-1">Prix moyen</div>
                  <div className="text-3xl font-bold text-green-600">{ESTABLISHMENT_DATA.avgPrice.toLocaleString('fr-FR')}€</div>
                  <div className="text-sm text-gray-500 mt-2">/mois</div>
                </div>
                <div className="p-6 bg-orange-50 rounded-lg border-2 border-orange-200">
                  <div className="text-sm text-gray-600 mb-1">Prix maximum</div>
                  <div className="text-3xl font-bold text-orange-600">{ESTABLISHMENT_DATA.maxPrice.toLocaleString('fr-FR')}€</div>
                  <div className="text-sm text-gray-500 mt-2">/mois</div>
                </div>
              </div>
            </section>

            {/* Services */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Services et équipements</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {services.map(({ name, icon, value }) => (
                  <div
                    key={name}
                    className={`p-4 rounded-lg border-2 flex items-center gap-3 ${
                      value
                        ? 'bg-green-50 border-green-300'
                        : 'bg-gray-50 border-gray-200 opacity-50'
                    }`}
                  >
                    <span className="text-2xl">{icon}</span>
                    <span className="font-medium">{name}</span>
                    {value && <span className="ml-auto text-green-600">✓</span>}
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* TAB: APPLICATION */}
        {activeTab === 'application' && (
          <div className="max-w-2xl">
            <ApplicationForm establishmentId={ESTABLISHMENT_DATA.id} establishmentName={ESTABLISHMENT_DATA.name} />
          </div>
        )}

        {/* TAB: REVIEWS */}
        {activeTab === 'reviews' && (
          <div className="max-w-2xl">
            <ReviewSection establishmentId={ESTABLISHMENT_DATA.id} rating={ESTABLISHMENT_DATA.rating} reviewCount={ESTABLISHMENT_DATA.reviews} />
          </div>
        )}

        {/* TAB: CALCULATOR */}
        {activeTab === 'calculator' && (
          <div className="max-w-2xl">
            <PriceCalculator minPrice={ESTABLISHMENT_DATA.minPrice} maxPrice={ESTABLISHMENT_DATA.maxPrice} />
          </div>
        )}
      </div>
    </div>
  );
}
