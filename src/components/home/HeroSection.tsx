'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Search, MapPin, Car, Bike, Truck, ChevronRight, Shield, Star, Clock } from 'lucide-react'
import { VILLES_PRINCIPALES } from '@/types'

const vehicleTypes = [
  { icon: Car, label: 'Voiture', value: 'voiture' },
  { icon: Bike, label: 'Moto', value: 'moto' },
  { icon: Truck, label: 'Camion', value: 'camion' },
]

export default function HeroSection() {
  const [activeVehicle, setActiveVehicle] = useState('voiture')
  const [ville, setVille] = useState('')
  const [specialite, setSpecialite] = useState('')

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
      {/* Background */}
      <div className="absolute inset-0 bg-steel-950">
        {/* Gradient orbs */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-steel-800/30 rounded-full blur-3xl" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(249,115,22,0.8) 1px, transparent 1px), 
                              linear-gradient(90deg, rgba(249,115,22,0.8) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/20 mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
            <span className="text-brand-400 text-sm font-medium">
              Filiale #13 · Cameroun Connect Service
            </span>
          </div>

          {/* Headline */}
          <h1 className="heading-xl text-white mb-6 animate-slide-up">
            Trouvez le{' '}
            <span className="relative">
              <span className="text-gradient-brand">meilleur garage</span>
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 300 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 10C50 4 100 2 150 6C200 10 250 8 298 4"
                  stroke="#f97316"
                  strokeWidth="3"
                  strokeLinecap="round"
                  opacity="0.6"
                />
              </svg>
            </span>
            {' '}près de chez vous
          </h1>

          <p className="text-steel-300 text-lg md:text-xl leading-relaxed mb-10 max-w-2xl mx-auto animate-slide-up">
            Garages vérifiés, avis authentiques, rendez-vous en ligne.
            <br className="hidden md:block" />
            La mécanique camerounaise entre dans l&apos;ère numérique.
          </p>

          {/* Vehicle type selector */}
          <div className="flex justify-center gap-3 mb-8">
            {vehicleTypes.map(({ icon: Icon, label, value }) => (
              <button
                key={value}
                onClick={() => setActiveVehicle(value)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                  activeVehicle === value
                    ? 'bg-brand-500 text-white shadow-orange-glow'
                    : 'bg-steel-800/60 text-steel-400 border border-steel-700 hover:border-brand-500/50 hover:text-steel-200'
                }`}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </div>

          {/* Search box */}
          <div className="bg-steel-900/80 backdrop-blur-sm border border-steel-700/60 rounded-2xl p-3 md:p-4 shadow-2xl max-w-3xl mx-auto mb-6">
            <div className="flex flex-col md:flex-row gap-3">
              {/* Location */}
              <div className="flex-1 relative">
                <MapPin size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-500" />
                <select
                  value={ville}
                  onChange={(e) => setVille(e.target.value)}
                  className="w-full pl-10 pr-4 py-3.5 bg-steel-800 border border-steel-700 rounded-xl text-steel-200 text-sm focus:outline-none focus:border-brand-500 appearance-none cursor-pointer"
                >
                  <option value="">Votre ville...</option>
                  {VILLES_PRINCIPALES.map((v) => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </div>

              {/* Specialite */}
              <div className="flex-1 relative">
                <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-steel-500" />
                <input
                  type="text"
                  placeholder="Spécialité (vidange, freins...)"
                  value={specialite}
                  onChange={(e) => setSpecialite(e.target.value)}
                  className="w-full pl-10 pr-4 py-3.5 bg-steel-800 border border-steel-700 rounded-xl text-steel-200 text-sm placeholder-steel-500 focus:outline-none focus:border-brand-500"
                />
              </div>

              {/* Search button */}
              <Link
                href={`/search?ville=${ville}&type=${activeVehicle}&q=${specialite}`}
                className="btn-primary whitespace-nowrap justify-center px-8 py-3.5"
              >
                <Search size={18} />
                Rechercher
              </Link>
            </div>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-sm text-steel-400">
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-brand-500" />
              <span>Garages vérifiés</span>
            </div>
            <div className="flex items-center gap-2">
              <Star size={16} className="text-brand-500" />
              <span>Avis authentiques</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-brand-500" />
              <span>RDV en 2 clics</span>
            </div>
          </div>
        </div>

        {/* Floating cards */}
        <div className="hidden lg:flex justify-between items-end mt-16 max-w-5xl mx-auto">
          <FloatingCard
            emoji="🔧"
            title="Mécanique générale"
            subtitle="847 garages disponibles"
            badge="Douala"
          />
          <FloatingCard
            emoji="⚡"
            title="Électricité auto"
            subtitle="234 spécialistes"
            badge="Yaoundé"
            className="mb-8"
          />
          <FloatingCard
            emoji="🏆"
            title="Garage Or Premium"
            subtitle="Note 4.9/5 · 312 avis"
            badge="Vérifié ✓"
            isPremium
          />
        </div>
      </div>
    </section>
  )
}

function FloatingCard({
  emoji, title, subtitle, badge, isPremium, className = ''
}: {
  emoji: string
  title: string
  subtitle: string
  badge: string
  isPremium?: boolean
  className?: string
}) {
  return (
    <div
      className={`card-dark p-4 min-w-[200px] animate-fade-in ${
        isPremium ? 'border-yellow-500/40 shadow-gold-glow' : ''
      } ${className}`}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl">{emoji}</span>
        <div>
          <p className="font-semibold text-white text-sm">{title}</p>
          <p className="text-steel-400 text-xs mt-0.5">{subtitle}</p>
          <span className={`mt-2 inline-block text-xs px-2 py-0.5 rounded-full font-medium ${
            isPremium
              ? 'bg-yellow-900/40 text-yellow-400 border border-yellow-700/50'
              : 'bg-brand-500/10 text-brand-400 border border-brand-500/20'
          }`}>
            {badge}
          </span>
        </div>
      </div>
    </div>
  )
}
