/**
 * app/(public)/search/page.tsx
 * PAGE DE RECHERCHE/LISTING
 *
 * - Affichage des établissements en cartes
 * - Filtres avancés (Budget, Services, Localisation)
 * - Système de tri
 * - Prix dynamiques et badges de disponibilité
 */

'use client';

import { useState, useMemo } from 'react';
import { MapPin, DollarSign, Heart, Star, Stethoscope, Award, Zap } from 'lucide-react';
import Link from 'next/link';
import EstablishmentCard from '@/components/features/EstablishmentCard';

// Données mockées
const ESTABLISHMENTS = [
  {
    id: '1',
    name: 'Résidence Les Chênes',
    city: 'Paris',
    postalCode: '75001',
    minPrice: 2500,
    maxPrice: 3500,
    rating: 4.8,
    reviews: 124,
    coverImage: '/images/residence-1.jpg',
    hasAlzheimerUnit: true,
    availableBeds: 3,
    acsRating: 4.5,
    services: ['GYM', 'RESTAURANT', 'CINEMA', 'HAIRDRESSER']
  },
  {
    id: '2',
    name: 'EHPAD Soleil Bleu',
    city: 'Lyon',
    postalCode: '69000',
    minPrice: 2000,
    maxPrice: 3000,
    rating: 4.6,
    reviews: 98,
    coverImage: '/images/residence-2.jpg',
    hasAlzheimerUnit: false,
    availableBeds: 1,
    acsRating: 4.2,
    services: ['POOL', 'GARDEN', 'NURSE_24H']
  },
  {
    id: '3',
    name: 'Résidence Côté Jardin',
    city: 'Marseille',
    postalCode: '13000',
    minPrice: 1800,
    maxPrice: 2800,
    rating: 4.7,
    reviews: 156,
    coverImage: '/images/residence-3.jpg',
    hasAlzheimerUnit: true,
    availableBeds: 5,
    acsRating: 4.6,
    services: ['GARDEN', 'RESTAURANT', 'PHYSIOTHERAPY']
  },
  {
    id: '4',
    name: 'Foyer Logement Les Roses',
    city: 'Toulouse',
    postalCode: '31000',
    minPrice: 1200,
    maxPrice: 1800,
    rating: 4.4,
    reviews: 67,
    coverImage: '/images/residence-4.jpg',
    hasAlzheimerUnit: false,
    availableBeds: 8,
    acsRating: 4.0,
    services: ['LIBRARY', 'CINEMA', 'RESTAURANT']
  }
];

type SortOption = 'rating' | 'price-asc' | 'price-desc' | 'available';

export default function SearchPage() {
  const [city, setCity] = useState('');
  const [maxBudget, setMaxBudget] = useState<number>(3500);
  const [hasAlzheimer, setHasAlzheimer] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('rating');
  const [view, setView] = useState<'grid' | 'list'>('grid');

  // Filtrer et trier
  const filtered = useMemo(() => {
    let results = ESTABLISHMENTS.filter((e) => {
      if (city && !e.city.toLowerCase().includes(city.toLowerCase())) return false;
      if (e.minPrice > maxBudget) return false;
      if (hasAlzheimer && !e.hasAlzheimerUnit) return false;
      return true;
    });

    // Tri
    switch (sortBy) {
      case 'rating':
        results.sort((a, b) => b.rating - a.rating);
        break;
      case 'price-asc':
        results.sort((a, b) => a.minPrice - b.minPrice);
        break;
      case 'price-desc':
        results.sort((a, b) => b.maxPrice - a.maxPrice);
        break;
      case 'available':
        results.sort((a, b) => b.availableBeds - a.availableBeds);
        break;
    }

    return results;
  }, [city, maxBudget, hasAlzheimer, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Recherche d'établissements</h1>
          <p className="text-gray-600">{filtered.length} établissements trouvés</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* SIDEBAR - FILTRES */}
          <aside className="lg:col-span-1">
            <div className="sticky top-4 space-y-6">
              {/* Filtre: Ville */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Localisation
                </label>
                <input
                  type="text"
                  placeholder="Ville ou code postal"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Filtre: Budget */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Budget mensuel
                </label>
                <div className="space-y-4">
                  <input
                    type="range"
                    min="1000"
                    max="4000"
                    step="100"
                    value={maxBudget}
                    onChange={(e) => setMaxBudget(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-lg font-bold text-blue-600">
                    Jusqu'à {maxBudget.toLocaleString('fr-FR')}€
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {[1500, 2500, 3500].map((price) => (
                      <button
                        key={price}
                        onClick={() => setMaxBudget(price)}
                        className={`py-1 rounded ${
                          maxBudget === price
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                      >
                        {price}€
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Filtre: Services */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Services
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasAlzheimer}
                    onChange={(e) => setHasAlzheimer(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-gray-700">Unité Alzheimer</span>
                </label>
              </div>

              {/* Filtre: Tri */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Trier par
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="rating">⭐ Note la plus élevée</option>
                  <option value="price-asc">💰 Prix croissant</option>
                  <option value="price-desc">💰 Prix décroissant</option>
                  <option value="available">🛏️ Plus de place disponible</option>
                </select>
              </div>

              {/* Bouton Reset */}
              <button
                onClick={() => {
                  setCity('');
                  setMaxBudget(3500);
                  setHasAlzheimer(false);
                }}
                className="w-full py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg border border-blue-300"
              >
                Réinitialiser les filtres
              </button>
            </div>
          </aside>

          {/* MAIN CONTENT - RÉSULTATS */}
          <main className="lg:col-span-3">
            {/* View Toggle */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setView('grid')}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
                  view === 'grid'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Grille
              </button>
              <button
                onClick={() => setView('list')}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
                  view === 'list'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Liste
              </button>
            </div>

            {/* Résultats */}
            {filtered.length === 0 ? (
              <div className="bg-white rounded-lg p-12 text-center">
                <p className="text-gray-600 text-lg mb-4">Aucun établissement ne correspond à votre recherche</p>
                <button
                  onClick={() => {
                    setCity('');
                    setMaxBudget(3500);
                    setHasAlzheimer(false);
                  }}
                  className="text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            ) : (
              <div className={view === 'grid' ? 'grid md:grid-cols-2 gap-6' : 'space-y-4'}>
                {filtered.map((establishment) => (
                  <Link key={establishment.id} href={`/establishment/${establishment.id}`}>
                    <EstablishmentCard establishment={establishment} />
                  </Link>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
