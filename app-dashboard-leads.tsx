/**
 * app/dashboard/leads/page.tsx
 * DASHBOARD ÉTABLISSEMENT - Gestion des candidatures
 *
 * Fonctionnalités:
 * - Affichage des candidatures en temps réel
 * - Changement de statut (PENDING → VISITED → ADMITTED/REJECTED)
 * - Un clic pour "Admettre" = SUCCESS FEE déclenché
 * - Recherche et filtrage
 */

'use client';

import { useState, useEffect } from 'react';
import { Check, X, Eye, Download, Mail } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

type LeadStatus = 'PENDING' | 'VISITED' | 'ADMITTED' | 'REJECTED' | 'WITHDRAWN';

interface Lead {
  id: string;
  status: LeadStatus;
  createdAt: string;
  elderlyFirstName: string;
  elderlyLastName: string;
  elderlyBirthDate: string;
  needsAlzheimer: boolean;
  needsPhysiotherapy: boolean;
  needsPharmacy: boolean;
  preferredBudget: number;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
}

export default function DashboardLeadsPage() {
  const searchParams = useSearchParams();
  const establishmentId = searchParams.get('establishmentId') || '1';

  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<LeadStatus | 'ALL'>('ALL');
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);

  // Fetch des leads
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const res = await fetch(`/api/leads?establishmentId=${establishmentId}`);
        if (res.ok) {
          const data = await res.json();
          setLeads(data.leads);
        }
      } catch (error) {
        console.error('Erreur chargement leads:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeads();
  }, [establishmentId]);

  // Changer le statut d'un lead
  const updateLeadStatus = async (leadId: string, newStatus: LeadStatus) => {
    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        setLeads((prev) =>
          prev.map((lead) =>
            lead.id === leadId ? { ...lead, status: newStatus } : lead
          )
        );
      }
    } catch (error) {
      console.error('Erreur mise à jour lead:', error);
    }
  };

  // Filtrer les leads
  const filteredLeads = leads.filter(
    (lead) => filterStatus === 'ALL' || lead.status === filterStatus
  );

  // Stats
  const stats = {
    total: leads.length,
    pending: leads.filter((l) => l.status === 'PENDING').length,
    visited: leads.filter((l) => l.status === 'VISITED').length,
    admitted: leads.filter((l) => l.status === 'ADMITTED').length,
    rejected: leads.filter((l) => l.status === 'REJECTED').length
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Candidatures</h1>
          <p className="text-gray-600">Gérez les dossiers reçus pour votre établissement</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* STATS CARDS */}
        <div className="grid md:grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Total', count: stats.total, bg: 'bg-blue-50', border: 'border-blue-300' },
            { label: 'En attente', count: stats.pending, bg: 'bg-yellow-50', border: 'border-yellow-300' },
            { label: 'Visites', count: stats.visited, bg: 'bg-purple-50', border: 'border-purple-300' },
            { label: 'Admis', count: stats.admitted, bg: 'bg-green-50', border: 'border-green-300' },
            { label: 'Refusés', count: stats.rejected, bg: 'bg-red-50', border: 'border-red-300' }
          ].map(({ label, count, bg, border }) => (
            <div key={label} className={`${bg} border-2 ${border} p-4 rounded-lg text-center`}>
              <p className="text-gray-600 text-sm font-medium">{label}</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{count}</p>
            </div>
          ))}
        </div>

        {/* FILTRES */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {(['ALL', 'PENDING', 'VISITED', 'ADMITTED', 'REJECTED'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${
                filterStatus === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-gray-300'
              }`}
            >
              {status === 'ALL' ? 'Tous' : status === 'PENDING' ? 'En attente' : status === 'VISITED' ? 'Visites' : status === 'ADMITTED' ? 'Admis' : 'Refusés'}
            </button>
          ))}
        </div>

        {/* TABLEAU */}
        {filteredLeads.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center">
            <p className="text-gray-600 text-lg">Aucune candidature à afficher</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Candidat</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Âge/Besoins</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Budget</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Statut</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map((lead) => {
                    const age = new Date().getFullYear() - new Date(lead.elderlyBirthDate).getFullYear();
                    const needs = [
                      lead.needsAlzheimer && 'Alzheimer',
                      lead.needsPhysiotherapy && 'Physio',
                      lead.needsPharmacy && 'Pharma'
                    ]
                      .filter(Boolean)
                      .join(', ') || 'Aucun besoin spécial';

                    const statusColors: Record<LeadStatus, string> = {
                      PENDING: 'bg-yellow-100 text-yellow-800',
                      VISITED: 'bg-purple-100 text-purple-800',
                      ADMITTED: 'bg-green-100 text-green-800',
                      REJECTED: 'bg-red-100 text-red-800',
                      WITHDRAWN: 'bg-gray-100 text-gray-800'
                    };

                    return (
                      <tr
                        key={lead.id}
                        className="border-b hover:bg-gray-50 transition"
                        onClick={() => setSelectedLeadId(selectedLeadId === lead.id ? null : lead.id)}
                      >
                        {/* Candidat */}
                        <td className="px-6 py-4">
                          <p className="font-semibold text-gray-900">
                            {lead.elderlyFirstName} {lead.elderlyLastName}
                          </p>
                          <p className="text-sm text-gray-500">{lead.user.firstName} {lead.user.lastName}</p>
                        </td>

                        {/* Âge/Besoins */}
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-900">{age} ans</p>
                          <p className="text-xs text-gray-500">{needs}</p>
                        </td>

                        {/* Contact */}
                        <td className="px-6 py-4">
                          <a href={`mailto:${lead.user.email}`} className="text-blue-600 hover:underline text-sm">
                            {lead.user.email}
                          </a>
                          <p className="text-xs text-gray-500">{lead.user.phone}</p>
                        </td>

                        {/* Budget */}
                        <td className="px-6 py-4 font-semibold text-gray-900">
                          {lead.preferredBudget.toLocaleString('fr-FR')}€/mois
                        </td>

                        {/* Statut */}
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColors[lead.status]}`}>
                            {lead.status === 'PENDING' ? 'En attente' : lead.status === 'VISITED' ? 'Visite' : lead.status === 'ADMITTED' ? 'Admis' : lead.status === 'REJECTED' ? 'Refusé' : 'Retiré'}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            {lead.status === 'PENDING' && (
                              <>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    updateLeadStatus(lead.id, 'VISITED');
                                  }}
                                  className="p-2 text-purple-600 hover:bg-purple-50 rounded transition"
                                  title="Marquer comme visité"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    updateLeadStatus(lead.id, 'REJECTED');
                                  }}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                                  title="Refuser"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </>
                            )}

                            {(lead.status === 'PENDING' || lead.status === 'VISITED') && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (confirm('Admettre cet(te) candidat(e) ?')) {
                                    updateLeadStatus(lead.id, 'ADMITTED');
                                  }
                                }}
                                className="p-2 text-green-600 hover:bg-green-50 rounded transition font-bold"
                                title="Admettre (Déclenche success fee 50€)"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                            )}

                            <button
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded transition"
                              title="Envoyer un email"
                            >
                              <Mail className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
