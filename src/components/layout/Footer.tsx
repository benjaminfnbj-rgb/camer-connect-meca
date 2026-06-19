import Link from 'next/link'
import { Wrench, ExternalLink } from 'lucide-react'

const links = {
  plateforme: [
    { label: 'Rechercher un garage', href: '/search' },
    { label: 'Inscrire mon garage', href: '/auth/inscription-garage' },
    { label: 'Tarifs professionnels', href: '/#tarifs' },
    { label: 'Comment ça marche', href: '/#comment-ca-marche' },
  ],
  ccs: [
    { label: 'Cameroun Connect Service', href: 'https://comconnectservice.com', external: true },
    { label: 'Santé Connect', href: 'https://sante.comconnectservice.com', external: true },
    { label: 'Les 25 filiales', href: 'https://comconnectservice.com/#filiales', external: true },
  ],
  legal: [
    { label: 'Conditions d\'utilisation', href: '/cgu' },
    { label: 'Politique de confidentialité', href: '/confidentialite' },
    { label: 'Mentions légales', href: '/mentions-legales' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-steel-950 border-t border-steel-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-brand-gradient flex items-center justify-center">
                <Wrench size={18} className="text-white" strokeWidth={2.5} />
              </div>
              <div>
                <span className="block font-display font-bold text-white text-base">Camer Connect</span>
                <span className="block text-brand-500 font-semibold text-xs -mt-0.5 uppercase tracking-wider">Méca</span>
              </div>
            </div>
            <p className="text-steel-500 text-sm leading-relaxed mb-6">
              La plateforme numérique de la mécanique camerounaise. 
              Filiale #13 · CCS Holding.
            </p>
            <div className="flex gap-3">
              <a href="tel:+237692497780" className="text-steel-400 hover:text-brand-500 transition-colors text-sm">
                +237 692 497 780
              </a>
            </div>
          </div>

          {/* Plateforme */}
          <div>
            <h3 className="font-semibold text-white text-sm mb-4">Plateforme</h3>
            <ul className="space-y-3">
              {links.plateforme.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-steel-500 hover:text-steel-200 text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CCS */}
          <div>
            <h3 className="font-semibold text-white text-sm mb-4">Groupe CCS</h3>
            <ul className="space-y-3">
              {links.ccs.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-steel-500 hover:text-steel-200 text-sm transition-colors flex items-center gap-1"
                  >
                    {link.label}
                    <ExternalLink size={11} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-white text-sm mb-4">Légal</h3>
            <ul className="space-y-3">
              {links.legal.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-steel-500 hover:text-steel-200 text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Payment badges */}
            <div className="mt-6 pt-6 border-t border-steel-800">
              <p className="text-steel-600 text-xs mb-3">Paiements acceptés</p>
              <div className="flex flex-wrap gap-2">
                {['🟠 Orange Money', '🟡 MTN MoMo', '🔵 Wave'].map((pm) => (
                  <span key={pm} className="text-xs bg-steel-800 text-steel-400 px-2 py-1 rounded-lg">
                    {pm}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 mt-8 border-t border-steel-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-steel-600 text-xs">
            © 2026 Cameroun Connect Service · RCCM RC/BJN/2026/A/15 · Bandjoun, Cameroun
          </p>
          <p className="text-steel-700 text-xs">
            Camer Connect Méca — Filiale #13 de la Holding Numérique Camerounaise
          </p>
        </div>
      </div>
    </footer>
  )
}
