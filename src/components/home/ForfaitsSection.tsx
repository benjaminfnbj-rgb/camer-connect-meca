'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Check, X, Zap } from 'lucide-react'
import { FORFAITS } from '@/types'

export default function ForfaitsSection() {
  const [periode, setPeriode] = useState<'mensuel' | 'annuel'>('mensuel')

  return (
    <section id="tarifs" className="py-24 bg-steel-900/30 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-500/5 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="section-label mb-3">Tarifs professionnels</p>
          <h2 className="heading-lg text-white mb-4">
            Choisissez votre{' '}
            <span className="text-gradient-brand">niveau de visibilité</span>
          </h2>
          <p className="text-steel-400 max-w-xl mx-auto">
            30 jours d&apos;essai gratuit pour tout nouveau garage. Aucune carte bancaire requise.
          </p>

          {/* Toggle */}
          <div className="inline-flex items-center gap-1 bg-steel-800 border border-steel-700 rounded-xl p-1 mt-8">
            <button
              onClick={() => setPeriode('mensuel')}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                periode === 'mensuel'
                  ? 'bg-brand-500 text-white shadow-orange-glow'
                  : 'text-steel-400 hover:text-white'
              }`}
            >
              Mensuel
            </button>
            <button
              onClick={() => setPeriode('annuel')}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                periode === 'annuel'
                  ? 'bg-brand-500 text-white shadow-orange-glow'
                  : 'text-steel-400 hover:text-white'
              }`}
            >
              Annuel
              <span className="bg-accent-600 text-white text-xs px-1.5 py-0.5 rounded-md font-semibold">
                -17%
              </span>
            </button>
          </div>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {(Object.entries(FORFAITS) as [keyof typeof FORFAITS, typeof FORFAITS[keyof typeof FORFAITS]][]).map(
            ([key, forfait], index) => {
              const isArgent = key === 'argent'
              const prix = periode === 'mensuel' ? forfait.mensuel : forfait.annuel
              const prixMensuelAnnuel = Math.floor(forfait.annuel / 12)

              return (
                <div
                  key={key}
                  className={`relative rounded-2xl border p-8 flex flex-col transition-all duration-300 ${
                    isArgent
                      ? 'bg-gradient-to-b from-brand-900/40 to-steel-800/80 border-brand-500 shadow-orange-glow scale-105'
                      : 'bg-steel-800/50 border-steel-700 hover:border-steel-600'
                  }`}
                >
                  {/* Popular badge */}
                  {isArgent && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center gap-1.5 bg-brand-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-orange-glow">
                        <Zap size={12} />
                        PLUS POPULAIRE
                      </span>
                    </div>
                  )}

                  {/* Header */}
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl">{forfait.emoji}</span>
                      <h3
                        className="font-display font-bold text-xl"
                        style={{ color: forfait.couleur }}
                      >
                        {forfait.nom}
                      </h3>
                    </div>
                    <p className="text-steel-400 text-sm">{forfait.description}</p>
                  </div>

                  {/* Price */}
                  <div className="mb-8">
                    <div className="flex items-end gap-2">
                      <span className="font-display font-bold text-4xl text-white">
                        {(periode === 'annuel' ? prixMensuelAnnuel : prix).toLocaleString('fr-FR')}
                      </span>
                      <span className="text-steel-400 text-sm mb-1">XAF/mois</span>
                    </div>
                    {periode === 'annuel' && (
                      <p className="text-accent-500 text-xs mt-1 font-medium">
                        Facturé {prix.toLocaleString('fr-FR')} XAF/an
                      </p>
                    )}
                  </div>

                  {/* CTA */}
                  <Link
                    href={`/auth/inscription-garage?forfait=${key}`}
                    className={`mb-8 py-3 rounded-xl font-semibold text-center text-sm transition-all duration-200 ${
                      isArgent
                        ? 'bg-brand-500 hover:bg-brand-600 text-white shadow-orange-glow'
                        : 'border border-steel-600 hover:border-brand-500/50 text-steel-200 hover:text-white'
                    }`}
                  >
                    Commencer l&apos;essai gratuit
                  </Link>

                  {/* Features */}
                  <div className="space-y-3 flex-1">
                    {forfait.avantages.map((avantage) => (
                      <div key={avantage} className="flex items-start gap-2.5">
                        <Check size={16} className="text-accent-500 flex-shrink-0 mt-0.5" />
                        <span className="text-steel-300 text-sm">{avantage}</span>
                      </div>
                    ))}
                    {'limitations' in forfait && forfait.limitations.map((limite) => (
                      <div key={limite} className="flex items-start gap-2.5">
                        <X size={16} className="text-steel-600 flex-shrink-0 mt-0.5" />
                        <span className="text-steel-600 text-sm">{limite}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            }
          )}
        </div>

        {/* Note */}
        <p className="text-center text-steel-500 text-sm mt-8">
          Paiement via Orange Money, MTN Mobile Money ou Wave · Sans engagement mensuel
        </p>
      </div>
    </section>
  )
}
