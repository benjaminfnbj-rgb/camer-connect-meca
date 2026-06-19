'use client'
import Link from 'next/link'
import {
  Wrench, BarChart2, Calendar, MessageSquare,
  Star, Settings, LogOut, Plus, TrendingUp,
  Eye, Phone, Clock, CheckCircle
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { Profil, Garage } from '@/types'

interface Props {
  profil: Profil | null
  garage: (Garage & { abonnements?: unknown[] }) | null
}

const stats = [
  { label: 'Vues ce mois', value: '247', icon: Eye, trend: '+12%' },
  { label: 'RDV confirmés', value: '18', icon: Calendar, trend: '+5%' },
  { label: 'Appels reçus', value: '34', icon: Phone, trend: '+8%' },
  { label: 'Note moyenne', value: '4.7', icon: Star, trend: '+0.2' },
]

export default function DashboardView({ profil, garage }: Props) {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const forfait = garage?.forfait_actuel

  return (
    <div className="min-h-screen bg-steel-950">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-steel-900 border-r border-steel-800 flex flex-col z-40 hidden lg:flex">
        {/* Logo */}
        <div className="p-6 border-b border-steel-800">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-brand-gradient flex items-center justify-center">
              <Wrench size={16} className="text-white" strokeWidth={2.5} />
            </div>
            <div>
              <span className="block font-display font-bold text-white text-sm">Camer Connect</span>
              <span className="block text-brand-500 text-[10px] font-semibold uppercase tracking-wider -mt-0.5">Méca</span>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {[
            { href: '/dashboard', icon: BarChart2, label: 'Tableau de bord', active: true },
            { href: '/dashboard/rdv', icon: Calendar, label: 'Rendez-vous' },
            { href: '/dashboard/messages', icon: MessageSquare, label: 'Messages' },
            { href: '/dashboard/avis', icon: Star, label: 'Avis' },
            { href: '/dashboard/statistiques', icon: TrendingUp, label: 'Statistiques' },
            { href: '/dashboard/profil', icon: Settings, label: 'Mon garage' },
          ].map(({ href, icon: Icon, label, active }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? 'bg-brand-500/10 text-brand-400 border border-brand-500/20'
                  : 'text-steel-400 hover:text-white hover:bg-steel-800'
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </nav>

        {/* User */}
        <div className="p-4 border-t border-steel-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-brand-500/20 flex items-center justify-center text-brand-400 font-semibold text-sm">
              {profil?.nom?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">{profil?.nom || 'Utilisateur'}</p>
              <p className="text-steel-500 text-xs truncate">{profil?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-steel-500 hover:text-red-400 text-sm transition-colors w-full"
          >
            <LogOut size={15} />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:ml-64 p-6 lg:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display font-bold text-2xl text-white">
              Bonjour, {profil?.prenom || profil?.nom || 'Professionnel'} 👋
            </h1>
            <p className="text-steel-400 text-sm mt-1">
              {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>

          <Link href="/dashboard/garage/nouveau" className="btn-primary text-sm py-2">
            <Plus size={16} />
            {garage ? 'Modifier mon garage' : 'Créer mon garage'}
          </Link>
        </div>

        {/* Forfait banner */}
        {garage && (
          <div className={`rounded-2xl p-5 mb-8 border flex items-center justify-between ${
            forfait === 'or'
              ? 'bg-yellow-900/20 border-yellow-600/40'
              : forfait === 'argent'
              ? 'bg-steel-800/50 border-steel-600/40'
              : 'bg-amber-900/20 border-amber-700/40'
          }`}>
            <div className="flex items-center gap-3">
              <span className="text-2xl">
                {forfait === 'or' ? '🥇' : forfait === 'argent' ? '🥈' : '🥉'}
              </span>
              <div>
                <p className="font-semibold text-white text-sm">
                  Forfait {forfait?.charAt(0).toUpperCase()}{forfait?.slice(1) || 'Essai gratuit'}
                </p>
                <p className="text-steel-400 text-xs">
                  {forfait ? 'Abonnement actif' : '30 jours d\'essai restants'}
                </p>
              </div>
            </div>
            <Link href="/abonnement" className="btn-secondary text-xs py-1.5 px-3">
              {forfait ? 'Changer de forfait' : 'Choisir un forfait'}
            </Link>
          </div>
        )}

        {/* No garage */}
        {!garage && (
          <div className="card-dark p-10 text-center mb-8">
            <div className="text-5xl mb-4">🔧</div>
            <h2 className="font-display font-bold text-xl text-white mb-2">
              Créez votre fiche garage
            </h2>
            <p className="text-steel-400 mb-6 max-w-sm mx-auto">
              Ajoutez votre garage pour commencer à recevoir des clients.
              C&apos;est rapide et votre essai de 30 jours démarre maintenant.
            </p>
            <Link href="/dashboard/garage/nouveau" className="btn-primary">
              <Plus size={18} />
              Créer ma fiche garage
            </Link>
          </div>
        )}

        {/* Stats grid */}
        {garage && (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {stats.map(({ label, value, icon: Icon, trend }) => (
                <div key={label} className="card-dark p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-9 h-9 rounded-xl bg-brand-500/10 flex items-center justify-center">
                      <Icon size={18} className="text-brand-400" />
                    </div>
                    <span className="text-accent-500 text-xs font-semibold">{trend}</span>
                  </div>
                  <p className="font-display font-bold text-2xl text-white">{value}</p>
                  <p className="text-steel-500 text-xs mt-1">{label}</p>
                </div>
              ))}
            </div>

            {/* Recent RDV */}
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="card-dark p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-semibold text-white">Prochains RDV</h2>
                  <Link href="/dashboard/rdv" className="text-brand-500 hover:text-brand-400 text-sm">
                    Voir tout →
                  </Link>
                </div>

                <div className="space-y-3">
                  {[
                    { nom: 'Jean K.', vehicule: 'Toyota Camry', heure: '09:00', statut: 'confirme' },
                    { nom: 'Marie T.', vehicule: 'Honda CBR 600', heure: '11:30', statut: 'en_attente' },
                    { nom: 'Paul M.', vehicule: 'Mercedes C200', heure: '14:00', statut: 'confirme' },
                  ].map((rdv) => (
                    <div key={rdv.nom} className="flex items-center justify-between py-3 border-b border-steel-800 last:border-0">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-steel-700 flex items-center justify-center text-xs font-semibold text-steel-300">
                          {rdv.nom[0]}
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium">{rdv.nom}</p>
                          <p className="text-steel-500 text-xs">{rdv.vehicule}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-steel-400 text-xs">
                          <Clock size={12} />
                          {rdv.heure}
                        </div>
                        <span className={`text-xs mt-1 inline-block ${
                          rdv.statut === 'confirme' ? 'text-accent-500' : 'text-brand-400'
                        }`}>
                          {rdv.statut === 'confirme' ? '✓ Confirmé' : '⏳ En attente'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick actions */}
              <div className="card-dark p-6">
                <h2 className="font-semibold text-white mb-5">Actions rapides</h2>
                <div className="space-y-3">
                  {[
                    { label: 'Ajouter des photos', href: '/dashboard/garage/photos', icon: '📷' },
                    { label: 'Mettre à jour mes horaires', href: '/dashboard/garage/horaires', icon: '🕐' },
                    { label: 'Voir mes avis clients', href: '/dashboard/avis', icon: '⭐' },
                    { label: 'Booster ma visibilité', href: '/abonnement', icon: '🚀' },
                  ].map((action) => (
                    <Link
                      key={action.label}
                      href={action.href}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-steel-700/50 transition-colors group"
                    >
                      <span className="text-xl">{action.icon}</span>
                      <span className="text-steel-300 group-hover:text-white text-sm transition-colors">
                        {action.label}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
