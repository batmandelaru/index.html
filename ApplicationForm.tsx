/**
 * components/features/ApplicationForm.tsx
 *
 * FORMULAIRE DE CANDIDATURE MULTI-ÉTAPES
 *
 * Étapes:
 * 1. Infos de la personne âgée
 * 2. Besoins spécifiques
 * 3. Préférences et budget
 * 4. Révision et confirmation
 *
 * À la soumission:
 * - Crée un Lead dans la DB
 * - Envoie une notification à l'établissement (email)
 * - Confirmation à l'utilisateur
 */

'use client';

import { useState } from 'react';
import { ChevronRight, ChevronLeft, Check, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ApplicationFormProps {
  establishmentId: string;
  establishmentName: string;
}

type FormStep = 1 | 2 | 3 | 4;

interface FormData {
  // Étape 1
  elderlyFirstName: string;
  elderlyLastName: string;
  elderlyBirthDate: string;
  elderlyPhone: string;

  // Étape 2
  needsAlzheimer: boolean;
  needsPhysiotherapy: boolean;
  needsPharmacy: boolean;

  // Étape 3
  preferredBudget: number;
  apaAmount: number;
  aplAmount: number;

  // Contact
  contactFirstName: string;
  contactLastName: string;
  contactEmail: string;
  contactPhone: string;
  contactRelation: string;
}

export default function ApplicationForm({ establishmentId, establishmentName }: ApplicationFormProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<FormStep>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    // Étape 1
    elderlyFirstName: '',
    elderlyLastName: '',
    elderlyBirthDate: '',
    elderlyPhone: '',

    // Étape 2
    needsAlzheimer: false,
    needsPhysiotherapy: false,
    needsPharmacy: false,

    // Étape 3
    preferredBudget: 2500,
    apaAmount: 1200,
    aplAmount: 200,

    // Contact
    contactFirstName: '',
    contactLastName: '',
    contactEmail: '',
    contactPhone: '',
    contactRelation: 'child'
  });

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep((prev) => (prev - 1) as FormStep);
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 4) {
        setCurrentStep((prev) => (prev + 1) as FormStep);
      }
    }
  };

  const validateStep = (step: FormStep): boolean => {
    switch (step) {
      case 1:
        return !!(formData.elderlyFirstName && formData.elderlyLastName && formData.elderlyBirthDate);
      case 2:
        return true; // Services are optional
      case 3:
        return !!(
          formData.contactFirstName &&
          formData.contactLastName &&
          formData.contactEmail &&
          formData.contactPhone
        );
      case 4:
        return true;
      default:
        return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSubmitError(null);

    try {
      // Appel API pour créer le lead
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          establishmentId,
          ...formData
        })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la soumission du formulaire');
      }

      // Succès
      setSubmitSuccess(true);

      // Redirection après 2 secondes
      setTimeout(() => {
        router.push(`/confirmation`);
      }, 2000);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="p-12 bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-500 rounded-lg text-center">
          <Check className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-green-900 mb-2">Candidature envoyée !</h2>
          <p className="text-green-800 mb-6">
            Votre dossier a été transmis à {establishmentName}.<br />
            Vous serez contacté(e) très bientôt.
          </p>
          <p className="text-sm text-green-700">Redirection en cours...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Progress Bar */}
        <div className="h-2 bg-gray-200">
          <div
            className="h-full bg-blue-600 transition-all duration-300"
            style={{ width: `${(currentStep / 4) * 100}%` }}
          />
        </div>

        {/* Header */}
        <div className="p-8 border-b">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Candidature pour {establishmentName}</h2>
          <p className="text-gray-600">
            Étape {currentStep} sur 4 - {
              currentStep === 1 ? 'Infos de la personne âgée' :
              currentStep === 2 ? 'Besoins spécifiques' :
              currentStep === 3 ? 'Informations de contact' :
              'Révision et confirmation'
            }
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-8 min-h-96">
            {/* ÉTAPE 1: Infos personne âgée */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">À propos de la personne âgée</h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prénom *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.elderlyFirstName}
                      onChange={(e) => updateFormData('elderlyFirstName', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Jean"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.elderlyLastName}
                      onChange={(e) => updateFormData('elderlyLastName', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Dupont"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date de naissance *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.elderlyBirthDate}
                    onChange={(e) => updateFormData('elderlyBirthDate', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone (optionnel)
                  </label>
                  <input
                    type="tel"
                    value={formData.elderlyPhone}
                    onChange={(e) => updateFormData('elderlyPhone', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="06 12 34 56 78"
                  />
                </div>
              </div>
            )}

            {/* ÉTAPE 2: Besoins */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Besoins et services</h3>

                <div className="space-y-4">
                  {[
                    {
                      key: 'needsAlzheimer' as const,
                      label: 'Unité/Services Alzheimer',
                      description: 'Accompagnement pour troubles cognitifs'
                    },
                    {
                      key: 'needsPhysiotherapy' as const,
                      label: 'Physiothérapie / Rééducation',
                      description: 'Services de réadaptation motrice'
                    },
                    {
                      key: 'needsPharmacy' as const,
                      label: 'Services pharmaceutiques',
                      description: 'Gestion des médicaments et ordonnances'
                    }
                  ].map(({ key, label, description }) => (
                    <label key={key} className="flex items-start p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                      <input
                        type="checkbox"
                        checked={formData[key]}
                        onChange={(e) => updateFormData(key, e.target.checked)}
                        className="w-5 h-5 mt-1 rounded"
                      />
                      <div className="ml-3">
                        <p className="font-medium text-gray-900">{label}</p>
                        <p className="text-sm text-gray-600">{description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* ÉTAPE 3: Contact & Budget */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Personne de contact</h3>

                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Prénom *</label>
                      <input
                        type="text"
                        required
                        value={formData.contactFirstName}
                        onChange={(e) => updateFormData('contactFirstName', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nom *</label>
                      <input
                        type="text"
                        required
                        value={formData.contactLastName}
                        onChange={(e) => updateFormData('contactLastName', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Lien de parenté *</label>
                    <select
                      required
                      value={formData.contactRelation}
                      onChange={(e) => updateFormData('contactRelation', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="child">Enfant</option>
                      <option value="spouse">Conjoint(e)</option>
                      <option value="sibling">Frère/Sœur</option>
                      <option value="other">Autre</option>
                    </select>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                      <input
                        type="email"
                        required
                        value={formData.contactEmail}
                        onChange={(e) => updateFormData('contactEmail', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone *</label>
                      <input
                        type="tel"
                        required
                        value={formData.contactPhone}
                        onChange={(e) => updateFormData('contactPhone', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Budget */}
                <div className="pt-6 border-t">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget et aides</h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Budget mensuel max
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="range"
                        min="1000"
                        max="4000"
                        step="100"
                        value={formData.preferredBudget}
                        onChange={(e) => updateFormData('preferredBudget', Number(e.target.value))}
                        className="flex-1"
                      />
                      <span className="text-lg font-bold text-blue-600 w-24">
                        {formData.preferredBudget}€
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ÉTAPE 4: Révision */}
            {currentStep === 4 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Vérification de votre dossier</h3>

                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                  <p className="text-sm text-gray-700">
                    ✓ Veuillez vérifier que toutes les informations sont correctes avant de soumettre votre candidature.
                  </p>
                </div>

                {/* Summary */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="font-semibold text-gray-900 mb-2">Personne âgée</p>
                    <p className="text-sm text-gray-600">
                      {formData.elderlyFirstName} {formData.elderlyLastName}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="font-semibold text-gray-900 mb-2">Personne de contact</p>
                    <p className="text-sm text-gray-600">
                      {formData.contactFirstName} {formData.contactLastName}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Error */}
          {submitError && (
            <div className="mx-8 mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-red-700">{submitError}</div>
            </div>
          )}

          {/* Footer - Actions */}
          <div className="p-8 border-t flex gap-4 justify-between">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center gap-2 px-6 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft className="w-5 h-5" />
              Précédent
            </button>

            {currentStep === 4 ? (
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 transition"
              >
                {isLoading ? 'Envoi en cours...' : 'Soumettre ma candidature'}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                disabled={!validateStep(currentStep)}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Suivant
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
