/**
 * components/features/PriceCalculator.tsx
 *
 * COMPOSANT RÉUTILISABLE: Calculateur de reste à charge
 *
 * Fonctionnalités:
 * - Entrée du prix de la chambre
 * - Déduction interactive des aides (APA, APL)
 * - Affichage du reste à charge en temps réel
 * - Graphique de ventilation
 * - Information pédagogique sur les aides
 *
 * Props:
 * - minPrice: Prix minimum de la chambre
 * - maxPrice: Prix maximum de la chambre
 */

'use client';

import { useState, useMemo } from 'react';
import { Info, TrendingDown, DollarSign, AlertCircle } from 'lucide-react';

interface PriceCalculatorProps {
  minPrice: number;
  maxPrice: number;
}

export default function PriceCalculator({ minPrice, maxPrice }: PriceCalculatorProps) {
  // État du calculateur
  const [roomPrice, setRoomPrice] = useState((minPrice + maxPrice) / 2);
  const [apaAmount, setApaAmount] = useState(1500);
  const [aplAmount, setAplAmount] = useState(250);
  const [pensionAmount, setPensionAmount] = useState(0);
  const [otherAidsAmount, setOtherAidsAmount] = useState(0);

  // Calculs
  const totalAids = useMemo(() => {
    return apaAmount + aplAmount + pensionAmount + otherAidsAmount;
  }, [apaAmount, aplAmount, pensionAmount, otherAidsAmount]);

  const remainingCost = useMemo(() => {
    return Math.max(0, roomPrice - totalAids);
  }, [roomPrice, totalAids]);

  const coveragePercentage = useMemo(() => {
    if (roomPrice === 0) return 0;
    return Math.min(100, (totalAids / roomPrice) * 100);
  }, [roomPrice, totalAids]);

  // Données pour le graphique de ventilation
  const chartData = [
    { label: 'APA', value: apaAmount, color: 'bg-blue-500', abbr: 'Allocation Personnalisée d\'Autonomie' },
    { label: 'APL', value: aplAmount, color: 'bg-green-500', abbr: 'Aide Personnalisée au Logement' },
    { label: 'Pension', value: pensionAmount, color: 'bg-purple-500', abbr: 'Ressources personnelles' },
    { label: 'Autres aides', value: otherAidsAmount, color: 'bg-orange-500', abbr: 'ASPA, ASI, etc.' },
    { label: 'Reste à charge', value: remainingCost, color: 'bg-red-500', abbr: 'À votre charge' }
  ];

  // Suggestions de plage d'aide
  const apaRanges = [
    { label: 'Autonome', value: 0, description: 'Peu d\'aide requise' },
    { label: 'Faible dépendance', value: 500, description: 'GIR 5-6' },
    { label: 'Dépendance moyenne', value: 1200, description: 'GIR 3-4' },
    { label: 'Forte dépendance', value: 2000, description: 'GIR 1-2' }
  ];

  return (
    <div className="w-full">
      <div className="space-y-8">
        {/* Titre */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Calculateur de reste à charge</h2>
          <p className="text-gray-600">
            Estimez votre participation financière mensuelle en fonction des aides disponibles.
          </p>
        </div>

        {/* GRILLE: Inputs + Visuel */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* GAUCHE: Saisies */}
          <div className="space-y-6">
            {/* Prix de la chambre */}
            <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border-2 border-blue-300">
              <label className="block text-sm font-bold text-gray-900 mb-2">
                💰 Prix de la chambre (€/mois)
              </label>
              <div className="flex gap-2 items-end">
                <input
                  type="range"
                  min={minPrice}
                  max={maxPrice}
                  step="50"
                  value={roomPrice}
                  onChange={(e) => setRoomPrice(Number(e.target.value))}
                  className="flex-1 h-2 bg-blue-300 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((roomPrice - minPrice) / (maxPrice - minPrice)) * 100}%, #dbeafe ${((roomPrice - minPrice) / (maxPrice - minPrice)) * 100}%, #dbeafe 100%)`
                  }}
                />
                <input
                  type="number"
                  value={roomPrice}
                  onChange={(e) => setRoomPrice(Math.max(minPrice, Math.min(maxPrice, Number(e.target.value))))}
                  className="w-24 px-3 py-2 border-2 border-blue-300 rounded-lg font-bold text-xl text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="text-xs text-gray-600 mt-2">
                Plage: {minPrice.toLocaleString('fr-FR')}€ - {maxPrice.toLocaleString('fr-FR')}€
              </div>
            </div>

            {/* Aides */}
            <div className="space-y-4">
              {/* APA */}
              <div className="p-5 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <label className="text-sm font-bold text-gray-900">APA - Allocation Personnalisée d'Autonomie</label>
                    <p className="text-xs text-gray-600 mt-1">Allocation versée selon le niveau de dépendance (GIR)</p>
                  </div>
                  <button
                    className="text-blue-600 hover:text-blue-700"
                    title="Aide à la saisie"
                  >
                    <Info className="w-4 h-4" />
                  </button>
                </div>

                {/* Suggestions rapides APA */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {apaRanges.map(({ label, value, description }) => (
                    <button
                      key={label}
                      onClick={() => setApaAmount(value)}
                      className={`p-2 text-xs rounded transition ${
                        apaAmount === value
                          ? 'bg-blue-500 text-white border-2 border-blue-700'
                          : 'bg-white text-gray-700 border-2 border-blue-200 hover:bg-blue-100'
                      }`}
                    >
                      <div className="font-semibold">{label}</div>
                      <div className="text-xs">{value}€</div>
                      <div className="text-xs opacity-75">{description}</div>
                    </button>
                  ))}
                </div>

                <input
                  type="range"
                  min="0"
                  max="2000"
                  step="50"
                  value={apaAmount}
                  onChange={(e) => setApaAmount(Number(e.target.value))}
                  className="w-full mb-2"
                />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Montant personnalisé:</span>
                  <input
                    type="number"
                    value={apaAmount}
                    onChange={(e) => setApaAmount(Math.max(0, Number(e.target.value)))}
                    className="w-20 px-2 py-1 border border-gray-300 rounded text-sm font-bold"
                  />
                  <span className="text-sm font-bold text-blue-600">€</span>
                </div>
              </div>

              {/* APL */}
              <div className="p-5 bg-green-50 rounded-lg border-l-4 border-green-500">
                <label className="text-sm font-bold text-gray-900 block mb-2">
                  APL - Aide Personnalisée au Logement
                </label>
                <input
                  type="range"
                  min="0"
                  max="600"
                  step="25"
                  value={aplAmount}
                  onChange={(e) => setAplAmount(Number(e.target.value))}
                  className="w-full mb-3"
                />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Montant:</span>
                  <input
                    type="number"
                    value={aplAmount}
                    onChange={(e) => setAplAmount(Math.max(0, Number(e.target.value)))}
                    className="w-20 px-2 py-1 border border-gray-300 rounded text-sm font-bold"
                  />
                  <span className="text-sm font-bold text-green-600">€</span>
                </div>
              </div>

              {/* Pension / Ressources */}
              <div className="p-5 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                <label className="text-sm font-bold text-gray-900 block mb-2">
                  🏦 Pension / Ressources personnelles
                </label>
                <input
                  type="range"
                  min="0"
                  max="3000"
                  step="50"
                  value={pensionAmount}
                  onChange={(e) => setPensionAmount(Number(e.target.value))}
                  className="w-full mb-3"
                />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Montant:</span>
                  <input
                    type="number"
                    value={pensionAmount}
                    onChange={(e) => setPensionAmount(Math.max(0, Number(e.target.value)))}
                    className="w-20 px-2 py-1 border border-gray-300 rounded text-sm font-bold"
                  />
                  <span className="text-sm font-bold text-purple-600">€</span>
                </div>
              </div>

              {/* Autres aides */}
              <div className="p-5 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                <label className="text-sm font-bold text-gray-900 block mb-2">
                  📋 Autres aides (ASPA, ASI, etc.)
                </label>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="25"
                  value={otherAidsAmount}
                  onChange={(e) => setOtherAidsAmount(Number(e.target.value))}
                  className="w-full mb-3"
                />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Montant:</span>
                  <input
                    type="number"
                    value={otherAidsAmount}
                    onChange={(e) => setOtherAidsAmount(Math.max(0, Number(e.target.value)))}
                    className="w-20 px-2 py-1 border border-gray-300 rounded text-sm font-bold"
                  />
                  <span className="text-sm font-bold text-orange-600">€</span>
                </div>
              </div>
            </div>
          </div>

          {/* DROITE: Visuel & Résumé */}
          <div className="space-y-6">
            {/* Résultat Principal */}
            <div className="p-8 bg-gradient-to-br from-red-50 to-red-100 rounded-lg border-4 border-red-300">
              <div className="text-center">
                <p className="text-sm font-semibold text-gray-700 mb-2">RESTE À CHARGE MENSUEL</p>
                <div className="text-5xl font-black text-red-600 mb-4">
                  {remainingCost.toLocaleString('fr-FR', { maximumFractionDigits: 0 })}€
                </div>
                <p className="text-gray-600">
                  Montant à votre charge après aides (sur {roomPrice.toLocaleString('fr-FR')}€)
                </p>
              </div>
            </div>

            {/* Barre de couverture */}
            <div className="p-6 bg-white border-2 border-gray-200 rounded-lg">
              <p className="text-sm font-semibold text-gray-700 mb-4">COUVERTURE PAR LES AIDES</p>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-4 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 via-green-500 to-orange-500 h-full transition-all duration-300"
                  style={{ width: `${coveragePercentage}%` }}
                />
              </div>
              <div className="text-right text-lg font-bold text-gray-900">
                {coveragePercentage.toFixed(1)}% couvert
              </div>
            </div>

            {/* Ventilation */}
            <div className="p-6 bg-white border-2 border-gray-200 rounded-lg">
              <p className="text-sm font-semibold text-gray-700 mb-4">VENTILATION DES RESSOURCES</p>
              <div className="space-y-3">
                {chartData.map(({ label, value, color, abbr }) => (
                  <div key={label}>
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${color}`} />
                        <span className="font-medium text-gray-900">{label}</span>
                      </div>
                      <span className="font-bold text-gray-900">{value.toLocaleString('fr-FR')}€</span>
                    </div>
                    <div className="text-xs text-gray-500 ml-5">{abbr}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Alert */}
            {remainingCost > roomPrice * 0.5 && (
              <div className="p-4 bg-amber-50 border-l-4 border-amber-500 rounded flex gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-amber-900 text-sm">Reste à charge élevé</p>
                  <p className="text-amber-800 text-xs mt-1">
                    Vérifiez vos aides auprès de votre caisse d'assurance maladie ou département.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* INFO BOX */}
        <div className="p-6 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
          <h3 className="font-bold text-gray-900 mb-3">📌 Important - À retenir</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>✓ Les montants d'APA varient selon votre GIR (Groupe Iso-Ressources)</li>
            <li>✓ L'APL est versée par la CAF si vous en êtes bénéficiaire</li>
            <li>✓ Votre pension peut être partagée avec la maison de retraite</li>
            <li>✓ D'autres aides existent (ASPA, ASI, aide sociale départementale)</li>
            <li>✓ Ce calcul est estimatif. Contactez votre département pour confirmation.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
