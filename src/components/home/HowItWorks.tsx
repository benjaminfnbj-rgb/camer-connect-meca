import { Search, Star, CalendarCheck, Wrench } from 'lucide-react'

const stepsClient = [
  {
    step: '01',
    icon: Search,
    title: 'Recherchez',
    desc: 'Entrez votre ville et le type de réparation. Filtrez par spécialité et type de véhicule.',
  },
  {
    step: '02',
    icon: Star,
    title: 'Comparez',
    desc: 'Consultez les profils, photos, avis vérifiés et tarifs de chaque garage.',
  },
  {
    step: '03',
    icon: CalendarCheck,
    title: 'Réservez',
    desc: 'Prenez rendez-vous en ligne directement. Confirmation immédiate par SMS.',
  },
  {
    step: '04',
    icon: Wrench,
    title: 'Réparez',
    desc: 'Suivez l\'avancement en temps réel. Donnez votre avis après la réparation.',
  },
]

const stepsPro = [
  { step: '01', title: 'Inscrivez votre garage', desc: '5 minutes chrono — nom, adresse, spécialités, photos' },
  { step: '02', title: 'Choisissez votre forfait', desc: 'Bronze, Argent ou Or. 30 jours offerts sans engagement' },
  { step: '03', title: 'Gérez vos clients', desc: 'RDV, messages, statistiques depuis votre tableau de bord' },
  { step: '04', title: 'Développez votre activité', desc: 'Plus de visibilité = plus de clients = plus de revenus' },
]

export default function HowItWorks() {
  return (
    <section id="comment-ca-marche" className="py-24 bg-steel-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="section-label mb-3">Comment ça marche</p>
          <h2 className="heading-lg text-white">
            Simple pour tous,{' '}
            <span className="text-gradient-brand">efficace partout</span>
          </h2>
        </div>

        {/* Tabs */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* For clients */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <span className="text-2xl">🚗</span>
              <div>
                <h3 className="font-display font-bold text-xl text-white">Pour les automobilistes</h3>
                <p className="text-steel-400 text-sm">Gratuit · Sans compte requis pour chercher</p>
              </div>
            </div>

            <div className="space-y-6">
              {stepsClient.map(({ step, icon: Icon, title, desc }, i) => (
                <div key={step} className="flex gap-4 group">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-500/20 transition-colors">
                      <Icon size={20} className="text-brand-400" />
                    </div>
                    {i < stepsClient.length - 1 && (
                      <div className="w-px h-6 bg-steel-700 mt-2" />
                    )}
                  </div>
                  <div className="pb-6">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs text-brand-500/70 font-medium">{step}</span>
                      <h4 className="font-semibold text-white">{title}</h4>
                    </div>
                    <p className="text-steel-400 text-sm leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* For pros */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <span className="text-2xl">🔧</span>
              <div>
                <h3 className="font-display font-bold text-xl text-white">Pour les professionnels</h3>
                <p className="text-steel-400 text-sm">30 jours d&apos;essai gratuit · Sans carte bancaire</p>
              </div>
            </div>

            <div className="space-y-4">
              {stepsPro.map(({ step, title, desc }, i) => (
                <div key={step} className="card-dark p-5 hover:border-brand-500/40 group cursor-default">
                  <div className="flex items-start gap-4">
                    <span className="font-display font-bold text-2xl text-brand-500/40 group-hover:text-brand-500/70 transition-colors w-10 flex-shrink-0">
                      {step}
                    </span>
                    <div>
                      <h4 className="font-semibold text-white mb-1">{title}</h4>
                      <p className="text-steel-400 text-sm">{desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <a href="/auth/inscription-garage" className="btn-primary w-full justify-center">
                Inscrire mon garage gratuitement →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
