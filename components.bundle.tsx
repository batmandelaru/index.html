/**
 * components/features/*.tsx
 * Composants réutilisables clés
 */

// ========== GalleryComponent.tsx ==========
import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

export function GalleryComponent({ images }: { images: string[] }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const next = () => setSelectedIndex((prev) => (prev + 1) % images.length);
  const prev = () => setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <>
      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 text-white hover:bg-white/20 p-2 rounded-lg"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={images[selectedIndex]}
            alt="Gallery"
            className="max-h-screen max-w-screen"
          />
        </div>
      )}

      {/* Main Gallery */}
      <div className="space-y-4">
        {/* Large Image */}
        <div
          onClick={() => setIsFullscreen(true)}
          className="relative bg-gray-200 rounded-lg overflow-hidden cursor-pointer group"
          style={{ aspectRatio: '16/9' }}
        >
          <img
            src={images[selectedIndex]}
            alt="Main"
            className="w-full h-full object-cover group-hover:scale-105 transition"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition" />

          {/* Navigation Buttons */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-900 p-2 rounded-full transition"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-900 p-2 rounded-full transition"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Thumbnails */}
        <div className="flex gap-2 overflow-x-auto">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                idx === selectedIndex ? 'border-blue-500' : 'border-gray-200'
              }`}
            >
              <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

// ========== ReviewSection.tsx ==========
export function ReviewSection({
  establishmentId,
  rating,
  reviewCount
}: {
  establishmentId: string;
  rating: number;
  reviewCount: number;
}) {
  const mockReviews = [
    {
      id: 1,
      author: 'Marie D.',
      rating: 5,
      text: 'Établissement excellent. Équipe très professionnelle et bienveillante.',
      date: '2024-02-15'
    },
    {
      id: 2,
      author: 'Jean L.',
      rating: 4,
      text: 'Bon établissement avec un cadre agréable. Quelques améliorations possibles.',
      date: '2024-02-10'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Avis des résidents</h2>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Laisser un avis
        </button>
      </div>

      {/* Rating Summary */}
      <div className="p-6 bg-blue-50 rounded-lg border-2 border-blue-200">
        <div className="flex items-center gap-4">
          <div className="text-4xl font-bold text-blue-600">{rating}</div>
          <div>
            <div className="flex gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={i < Math.round(rating) ? '⭐' : '☆'}>
                  {i < Math.round(rating) ? '⭐' : '☆'}
                </span>
              ))}
            </div>
            <p className="text-gray-600">{reviewCount} avis vérifiés</p>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {mockReviews.map((review) => (
          <div key={review.id} className="p-6 bg-white border-2 border-gray-200 rounded-lg">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="font-bold text-gray-900">{review.author}</p>
                <p className="text-sm text-gray-500">
                  {new Date(review.date).toLocaleDateString('fr-FR')}
                </p>
              </div>
              <div className="text-lg">{'⭐'.repeat(review.rating)}</div>
            </div>
            <p className="text-gray-700">{review.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ========== EstablishmentCard.tsx ==========
export function EstablishmentCard({
  establishment
}: {
  establishment: any;
}) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
      {/* Image */}
      <div className="relative bg-gray-200" style={{ aspectRatio: '4/3' }}>
        <img
          src={establishment.coverImage}
          alt={establishment.name}
          className="w-full h-full object-cover"
        />
        {establishment.hasAlzheimerUnit && (
          <div className="absolute top-3 right-3 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold">
            Unité Alzheimer
          </div>
        )}
        {establishment.availableBeds > 0 && (
          <div className="absolute top-3 left-3 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold">
            {establishment.availableBeds} place(s) libre(s)
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-900 mb-2">{establishment.name}</h3>

        <div className="flex items-center gap-2 text-gray-600 text-sm mb-3">
          📍 {establishment.city}
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-yellow-500">⭐</span>
          <span className="font-bold text-gray-900">{establishment.rating}</span>
          <span className="text-gray-500 text-sm">({establishment.reviews})</span>
        </div>

        {/* Price */}
        <div className="mb-4 pb-4 border-b">
          <p className="text-sm text-gray-600">À partir de</p>
          <p className="text-2xl font-bold text-blue-600">
            {establishment.minPrice.toLocaleString('fr-FR')}€
          </p>
          <p className="text-xs text-gray-500">/mois</p>
        </div>

        {/* Button */}
        <button className="w-full py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
          Consulter
        </button>
      </div>
    </div>
  );
}

// ========== SearchBar.tsx ==========
'use client';
import { Search, MapPin } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function SearchBar() {
  const router = useRouter();
  const [city, setCity] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (city) {
      router.push(`/search?city=${encodeURIComponent(city)}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex gap-2">
      <div className="flex-1 relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Ville ou code postal"
          className="w-full pl-10 pr-4 py-3 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <button
        type="submit"
        className="px-6 py-3 bg-white text-blue-600 rounded-lg font-bold hover:bg-gray-50 flex items-center gap-2 transition"
      >
        <Search className="w-5 h-5" />
        Chercher
      </button>
    </form>
  );
}

// ========== Button.tsx (réutilisable) ==========
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'white';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  [key: string]: any;
}) {
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50',
    white: 'bg-white text-gray-900 hover:bg-gray-50'
  };

  const sizes = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button
      className={`font-semibold rounded-lg transition ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
