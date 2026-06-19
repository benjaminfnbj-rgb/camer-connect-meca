'use client'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
  Search, MapPin, Filter, Star, Clock, Phone,
  MessageSquare, Calendar, Shield, ChevronDown, X
} from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import { VILLES_PRINCIPALES } from '@/types'

const SPECIALITES = [
  'Vidange', 'Freinage', 'Électricité', 'Carrosserie',
  'Pneus', 'Climatisation', 'Moteur', 'Diagnostic',
]

// Données de démo (seront remplacées par Supabase)
const GARAGES_DEMO = [
  {
    id: '1',
    nom: 'Garage Excellence Auto',
    adresse: 'Rue de la Joie, Akwa',
    ville: 'Douala',
    specialites: ['Vidange', 'Freinage', 'Moteur'],
    types_vehicules: ['voiture', 'camion'],
    note_moyenne: 4.8,
    total_avis: 127,
    forfait_actuel: 'or',
    est_verifie: true,
    photo_principale: null,
    distance_km: 0.8,
    telephone: '+237 691 234 567',
    horaires: { ouvert: true, fermeture: '18:00' },
  },
  {
    id: '2',
    nom: 'Moto Express Service',
    adresse: 'Carrefour Deido',
    ville: 'Douala',
    specialites: ['Moteur', 'Pneus', 'Freinage'],
    types_vehicules: ['moto'],
    note_moyenne: 4.5,
    total_avis: 89,
    forfait_actuel: 'argent',
    est_verifie: true,
    photo_principale: null,
    distance_km: 1.2,
    telephone: '+237 677 890 123',
    horaires: { ouvert: true, fermeture: '17:00' },
  },
  {
    id: '3',
    nom: 'Atelier Central Mécanique',
    adresse: 'Boulevard de la Liberté',
    ville: 'Douala',
    specialites: ['Électricité', 'Diagnostic', 'Carrosserie'],
    types_vehicules: ['voiture', 'camion', 'poids_lourd'],
    note_moyenne: 4.2,
    total_avis: 43,
    forfait_actuel: 'bronze',
    est_verifie: false,
    photo_principale: null,
    distance_km: 2.4,
    telephone: '+237 655 456 789',
    horaires: { ouvert: false, fermeture: '17:30' },
  },
]

const ForfaitBadge = ({ forfait }: { forfait: string | null }) => {
  if (!forfait) return null
  const config = {
    or: { label: '🥇 Or', className: 'badge-or' },
    argent: { label: '🥈 Argent', className: 'badge-argent' },
    bronze: { label: '🥉 Bronze', className: 'badge-bronze' },
  }
  const c = config[forfait as keyof typeof config]
  if (!c) return null
  return <span className={c.className}>{c.label}</span>
}

export default function SearchView() {
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [ville, setVille] = useState(searchParams.get('ville') || '')
  const [typeVehicule, setTypeVehicule] = useState(searchParams.get('type') || '')
  const [specialite, setSpecialite] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [garages, setGarages] = useState(GARAGES_DEMO)

  const nbResultats = garages.length

  return (
    <div className="min-h-screen bg-steel-950">
      <Navbar />

      {/* Search header */}
      <div className="bg-steel-900 border-b border-steel-800 pt-20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Search bar */}
          <div className="flex flex-col md:flex-row gap-3 mb-4">
            <div className="flex-1 relative">
              <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-500" />
              <select
                value={ville}
                onChange={(e) => setVille(e.target.value)}
                className="w-full pl-9 pr-4 py-3 bg-steel-800 border border-steel-700 rounded-xl text-steel-200 text-sm focus:outline-none focus:border-brand-500 appearance-none"
              >
                <option value="">Toutes les villes</option>
                {VILLES_PRINCIPALES.map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>

            <div className="flex-1 relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-steel-500" />
              <input
                type="text"
                placeholder="Spécialité, nom de garage..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-3 bg-steel-800 border border-steel-700 rounded-xl text-steel-200 text-sm placeholder-steel-500 focus:outline-none focus:border-brand-500"
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                showFilters
                  ? 'bg-brand-500 border-brand-500 text-white'
                  : 'border-steel-700 text-steel-400 hover:border-brand-500/50 hover:text-white bg-steel-800'
              }`}
            >
              <Filter size={16} />
              Filtres
            </button>
          </div>

          {/* Vehicle type pills */}
          <div className="flex gap-2 flex-wrap">
            {[
              { label: 'Tous', value: '' },
              { label: '🚗 Voiture', value: 'voiture' },
              { label: '🏍️ Moto', value: 'moto' },
              { label: '🚛 Camion', value: 'camion' },
              { label: '🚜 Poids lourd', value: 'poids_lourd' },
            ].map(({ label, value }) => (
              <button
                key={value}
                onClick={() => setTypeVehicule(value)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  typeVehicule === value
                    ? 'bg-brand-500 text-white'
                    : 'bg-steel-800 text-steel-400 border border-steel-700 hover:border-brand-500/30'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Filters panel */}
          {showFilters && (
            <div className="mt-4 p-4 bg-steel-800/50 rounded-xl border border-steel-700">
              <p className="text-steel-400 text-xs font-semibold uppercase mb-3">Spécialité</p>
              <div className="flex flex-wrap gap-2">
                {SPECIALITES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSpecialite(specialite === s ? '' : s)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      specialite === s
                        ? 'bg-brand-500/20 border border-brand-500 text-brand-400'
                        : 'bg-steel-700 text-steel-400 hover:text-white'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <p className="text-steel-400 text-sm">
            <span className="text-white font-semibold">{nbResultats}</span> garage{nbResultats > 1 ? 's' : ''} trouvé{nbResultats > 1 ? 's' : ''}
            {ville && <span> à <span className="text-brand-400">{ville}</span></span>}
          </p>
          <select className="text-xs bg-steel-800 border border-steel-700 text-steel-400 px-3 py-1.5 rounded-lg focus:outline-none">
            <option>Pertinence</option>
            <option>Le plus proche</option>
            <option>Mieux noté</option>
          </select>
        </div>

        <div className="space-y-4">
          {garages.map((garage) => (
            <GarageCard key={garage.id} garage={garage as unknown as typeof GARAGES_DEMO[0]} />
          ))}
        </div>
      </div>
    </div>
  )
}

function GarageCard({ garage }: { garage: typeof GARAGES_DEMO[0] }) {
  return (
    <div className={`card-dark p-6 flex flex-col md:flex-row gap-5 ${
      garage.forfait_actuel === 'or' ? 'border-yellow-500/30' : ''
    }`}>
      {/* Photo */}
      <div className="w-full md:w-32 h-32 bg-steel-700 rounded-xl flex items-center justify-center flex-shrink-0 relative overflow-hidden">
        <span className="text-4xl">🔧</span>
        {garage.forfait_actuel === 'or' && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-500 to-amber-400" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1">
        <div className="flex items-start justify-between mb-2 gap-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-display font-bold text-white text-lg">{garage.nom}</h3>
              {garage.est_verifie && (
                <Shield size={16} className="text-accent-500 flex-shrink-0" />
              )}
              <ForfaitBadge forfait={garage.forfait_actuel} />
            </div>
            <div className="flex items-center gap-1 text-steel-400 text-sm mt-0.5">
              <MapPin size={13} />
              {garage.adresse}, {garage.ville}
              {garage.distance_km && (
                <span className="ml-2 text-brand-400">• {garage.distance_km} km</span>
              )}
            </div>
          </div>

          {/* Note */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <Star size={16} className="text-brand-500 fill-brand-500" />
            <span className="font-bold text-white">{garage.note_moyenne}</span>
            <span className="text-steel-500 text-sm">({garage.total_avis})</span>
          </div>
        </div>

        {/* Specialites */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {garage.specialites.map((s) => (
            <span
              key={s}
              className="text-xs px-2 py-1 bg-steel-700/50 text-steel-400 rounded-lg border border-steel-700"
            >
              {s}
            </span>
          ))}
        </div>

        {/* Bottom row */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-1.5">
            <Clock size={13} className={garage.horaires.ouvert ? 'text-accent-500' : 'text-steel-500'} />
            <span className={`text-xs font-medium ${garage.horaires.ouvert ? 'text-accent-500' : 'text-steel-500'}`}>
              {garage.horaires.ouvert ? `Ouvert · Ferme à ${garage.horaires.fermeture}` : 'Fermé'}
            </span>
          </div>

          <div className="flex gap-2">
            <a
              href={`tel:${garage.telephone}`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-steel-700 hover:bg-steel-600 text-steel-300 text-xs transition-colors"
            >
              <Phone size={13} />
              Appeler
            </a>
            <Link
              href={`/garage/${garage.id}`}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold transition-colors"
            >
              <Calendar size={13} />
              Prendre RDV
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
