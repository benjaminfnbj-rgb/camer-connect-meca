'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Wrench, Mail, Lock, User, Phone, Eye, EyeOff, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

type Mode = 'connexion' | 'inscription-garage' | 'inscription-client'

interface Props {
  mode: Mode
}

export default function AuthForm({ mode }: Props) {
  const router = useRouter()
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nom, setNom] = useState('')
  const [telephone, setTelephone] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loadingGoogle, setLoadingGoogle] = useState(false)

  const isInscription = mode !== 'connexion'
  const isGarage = mode === 'inscription-garage'

  const handleGoogle = async () => {
    setLoadingGoogle(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${
          isGarage ? '/dashboard/garage/nouveau' : '/dashboard'
        }`,
      },
    })
    if (error) {
      toast.error('Erreur connexion Google')
      setLoadingGoogle(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (mode === 'connexion') {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        toast.success('Connexion réussie !')
        router.push('/dashboard')
        router.refresh()
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: nom,
              role: isGarage ? 'professionnel' : 'client',
            },
          },
        })
        if (error) throw error

        // Mettre à jour le profil avec téléphone
        if (data.user && telephone) {
          await supabase
            .from('profils')
            .update({ telephone, nom })
            .eq('user_id', data.user.id)
        }

        toast.success('Compte créé ! Vérifiez votre email.')
        if (isGarage) {
          router.push('/dashboard/garage/nouveau')
        } else {
          router.push('/dashboard')
        }
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Une erreur est survenue'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-steel-950 flex items-center justify-center px-4 py-12">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-80 h-80 bg-brand-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-brand-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2.5 mb-8 group">
          <div className="w-10 h-10 rounded-xl bg-brand-gradient flex items-center justify-center shadow-orange-glow">
            <Wrench size={20} className="text-white" strokeWidth={2.5} />
          </div>
          <div>
            <span className="block font-display font-bold text-white text-lg">Camer Connect</span>
            <span className="block text-brand-500 font-semibold text-xs -mt-0.5 uppercase tracking-wider">Méca</span>
          </div>
        </Link>

        <div className="card-dark p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="font-display font-bold text-2xl text-white mb-2">
              {mode === 'connexion' && 'Connexion'}
              {mode === 'inscription-garage' && 'Inscrire mon garage'}
              {mode === 'inscription-client' && 'Créer un compte'}
            </h1>
            <p className="text-steel-400 text-sm">
              {mode === 'inscription-garage' && '30 jours d\'essai gratuit · Sans carte bancaire'}
              {mode === 'connexion' && 'Bienvenue sur Camer Connect Méca'}
            </p>
          </div>

          {/* Google Sign In */}
          <button
            onClick={handleGoogle}
            disabled={loadingGoogle}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-xl border border-gray-200 transition-all duration-200 mb-6 disabled:opacity-60"
          >
            {loadingGoogle ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            Continuer avec Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-steel-700" />
            <span className="text-steel-600 text-xs">ou par email</span>
            <div className="flex-1 h-px bg-steel-700" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isInscription && (
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-steel-500" />
                <input
                  type="text"
                  placeholder="Nom complet"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  required
                  className="input-dark pl-10"
                />
              </div>
            )}

            {isInscription && (
              <div className="relative">
                <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-steel-500" />
                <input
                  type="tel"
                  placeholder="Téléphone (+237...)"
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                  className="input-dark pl-10"
                />
              </div>
            )}

            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-steel-500" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-dark pl-10"
              />
            </div>

            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-steel-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="input-dark pl-10 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-steel-500 hover:text-steel-300"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {mode === 'connexion' && (
              <div className="text-right">
                <Link href="/auth/reset-password" className="text-brand-500 hover:text-brand-400 text-sm">
                  Mot de passe oublié ?
                </Link>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-3.5"
            >
              {loading && <Loader2 size={18} className="animate-spin" />}
              {mode === 'connexion' && 'Se connecter'}
              {mode === 'inscription-garage' && 'Créer mon compte garage'}
              {mode === 'inscription-client' && 'Créer mon compte'}
            </button>
          </form>

          {/* Switch mode */}
          <p className="text-center text-steel-500 text-sm mt-6">
            {mode === 'connexion' ? (
              <>
                Pas encore de compte ?{' '}
                <Link href="/auth/inscription-garage" className="text-brand-500 hover:text-brand-400 font-medium">
                  Inscrire mon garage
                </Link>
              </>
            ) : (
              <>
                Déjà inscrit ?{' '}
                <Link href="/auth/connexion" className="text-brand-500 hover:text-brand-400 font-medium">
                  Se connecter
                </Link>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}
