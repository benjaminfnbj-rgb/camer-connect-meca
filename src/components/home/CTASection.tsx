import Link from 'next/link'
import { ArrowRight, Smartphone } from 'lucide-react'

export default function CTASection() {
  return (
    <section className="py-24 bg-steel-900/50 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-500/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-500/20 to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 text-center">
        <p className="section-label mb-4">Rejoignez la révolution</p>
        <h2 className="heading-lg text-white mb-6">
          Vous êtes mécanicien ou gérant de garage ?
        </h2>
        <p className="text-steel-300 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
          Rejoignez les centaines de professionnels qui développent leur activité avec 
          Camer Connect Méca. 30 jours offerts, sans engagement, sans carte bancaire.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/auth/inscription-garage" className="btn-primary text-base px-8 py-4">
            Inscrire mon garage — C&apos;est gratuit
            <ArrowRight size={20} />
          </Link>
          <Link href="/search" className="btn-secondary text-base px-8 py-4">
            <Smartphone size={20} />
            Trouver un garage
          </Link>
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-steel-500">
          <span>🟠 Orange Money accepté</span>
          <span>🟡 MTN MoMo accepté</span>
          <span>🔵 Wave accepté</span>
          <span>✅ Sans engagement</span>
        </div>
      </div>
    </section>
  )
}
