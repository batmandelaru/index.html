/**
 * app/(public)/page.tsx
 * PAGE D'ACCUEIL - RetireMaisons
 *
 * Composants:
 * - Hero section avec barre de recherche
 * - Filtres rapides (Budget, Unité Alzheimer)
 * - Section "Comment ça marche"
 * - Établissements populaires
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, MapPin, DollarSign, Heart, Star, ArrowRight } from 'lucide-react';
import SearchBar from '@/components/ui/SearchBar';
import EstablishmentCard from '@/components/features/EstablishmentCard';
import Button from '@/components/ui/Button';

// Données de démo
const POPULAR_ESTABLISHMENTS = [
  {
    id: '1',
    name: 'Résidence Les Chênes',
    city: 'Paris',
    minPrice: 2500,
    maxPrice: 3500,
    rating: 4.8,
    reviews: 124,
    coverImage: '/images/residence-1.jpg',
    hasAlzheimerUnit: true,
    availableBeds: 3,
    acsRating: 4.5
  },
  {
    id: '2',
    name: 'EHPAD Soleil Bleu',
    city: 'Lyon',
    minPrice: 2000,
    maxPrice: 3000,
    rating: 4.6,
    reviews: 98,
    coverImage: '/images/residence-2.jpg',
    hasAlzheimerUnit: false,
    availableBeds: 1,
    acsRating: 4.2
  },
  {
    id: '3',
    name: 'Résidence Côté Jardin',
    city: 'Marseille',
    minPrice: 1800,
    maxPrice: 2800,
    rating: 4.7,
    reviews: 156,
    coverImage: '/images/residence-3.jpg',
    hasAlzheimerUnit: true,
    availableBeds: 5,
    acsRating: 4.6
  }
];

export default function Home() {
  const [budget, setBudget] = useState<number | null>(null);
  const [hasAlzheimer, setHasAlzheimer] = useState(false);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* HERO SECTION */}
      <section className="relative py-16 md:py-24 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 text-white">
        <div className="absolute inset-0 bg-grid-white/10" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            {/* Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                Trouvez la maison de retraite idéale
              </h1>
              <p className="text-xl text-blue-100">
                Comparez les établissements, consultez les avis vérifiés et déposez votre dossier en quelques clics.
              </p>
            </div>

            {/* Search Bar */}
            <div className="pt-4">
              <SearchBar />
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                onClick={() => setBudget(budget === 2500 ? null : 2500)}
                className={`px-4 py-2 rounded-full font-medium transition ${
                  budget === 2500
                    ? 'bg-white text-blue-600'
                    : 'bg-blue-700/50 hover:bg-blue-700 text-white border border-blue-400'
                }`}
              >
                <DollarSign className="inline w-4 h-4 mr-2" />
                Jusqu'à 2500€/mois
              </button>
              <button
                onClick={() => setHasAlzheimer(!hasAlzheimer)}
                className={`px-4 py-2 rounded-full font-medium transition ${
                  hasAlzheimer
                    ? 'bg-white text-blue-600'
                    : 'bg-blue-700/50 hover:bg-blue-700 text-white border border-blue-400'
                }`}
              >
                Unité Alzheimer
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* COMMENT ÇA MARCHE */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Comment ça marche ?
          </h2>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                step: 1,
                title: 'Recherchez',
                description: 'Trouvez l\'établissement qui correspond à vos besoins et budget'
              },
              {
                step: 2,
                title: 'Comparez',
                description: 'Consultez les tarifs, services et avis vérifiés des résidents'
              },
              {
                step: 3,
                title: 'Postulez',
                description: 'Remplissez un dossier simple et multilingue en quelques minutes'
              },
              {
                step: 4,
                title: 'Décision',
                description: 'L\'établissement examine votre dossier et vous contacte'
              }
            ].map(({ step, title, description }) => (
              <div key={step} className="relative">
                {/* Step Circle */}
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 text-white font-bold text-lg mb-4">
                  {step}
                </div>

                {/* Content */}
                <h3 className="font-bold text-lg mb-2 text-gray-900">{title}</h3>
                <p className="text-gray-600 text-sm">{description}</p>

                {/* Arrow */}
                {step < 4 && (
                  <div className="hidden md:block absolute top-6 -right-8">
                    <ArrowRight className="w-6 h-6 text-blue-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ÉTABLISSEMENTS POPULAIRES */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Établissements populaires</h2>
            <Link href="/search" className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2">
              Voir tous
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {POPULAR_ESTABLISHMENTS.map((establishment) => (
              <EstablishmentCard key={establishment.id} establishment={establishment} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl font-bold">Prêt à commencer ?</h2>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">
            Trouvez le bon établissement et déposez votre dossier dès aujourd'hui.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/search">
              <Button variant="white" size="lg">
                Commencer la recherche
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                Créer un compte
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
