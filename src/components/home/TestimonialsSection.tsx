import { Star } from 'lucide-react'

const temoignages = [
  {
    nom: 'Jean-Baptiste K.',
    ville: 'Douala, Akwa',
    role: 'Propriétaire de véhicule',
    avis: "J'ai trouvé un mécanicien de confiance en 5 minutes. Plus besoin de tourner en rond dans Douala. L'application est simple et les avis sont vraiment utiles.",
    note: 5,
    avatar: '👨🏿',
  },
  {
    nom: 'Garage Excellence Auto',
    ville: 'Yaoundé, Bastos',
    role: 'Garage Argent — 3 mois d\'activité',
    avis: "Depuis mon inscription, j'ai augmenté ma clientèle de 40%. Le tableau de bord me permet de gérer mes rendez-vous facilement. Excellent investissement.",
    note: 5,
    avatar: '🔧',
  },
  {
    nom: 'Marie-Claire T.',
    ville: 'Bafoussam',
    role: 'Propriétaire de moto',
    avis: "En tant que femme, j'avais souvent peur d'être arnaquée chez le mécanicien. Avec les avis vérifiés, je choisis en toute confiance. Merci Camer Connect Méca !",
    note: 5,
    avatar: '👩🏿',
  },
]

export default function TestimonialsSection() {
  return (
    <section className="py-24 bg-steel-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="section-label mb-3">Témoignages</p>
          <h2 className="heading-lg text-white">
            Ils nous font{' '}
            <span className="text-gradient-brand">confiance</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {temoignages.map((t) => (
            <div key={t.nom} className="card-dark p-6 flex flex-col">
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.note }).map((_, i) => (
                  <Star key={i} size={16} className="text-brand-500 fill-brand-500" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-steel-300 text-sm leading-relaxed flex-1 mb-6 italic">
                &ldquo;{t.avis}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <span className="text-3xl">{t.avatar}</span>
                <div>
                  <p className="font-semibold text-white text-sm">{t.nom}</p>
                  <p className="text-steel-500 text-xs">{t.role}</p>
                  <p className="text-brand-500/70 text-xs mt-0.5">📍 {t.ville}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
