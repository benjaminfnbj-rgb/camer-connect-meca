import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import DashboardView from '@/components/dashboard/DashboardView'

export const metadata = { title: 'Tableau de bord' }

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/connexion')
  }

  const { data: profil } = await supabase
    .from('profils')
    .select('*')
    .eq('user_id', user.id)
    .single()

  const { data: garage } = await supabase
    .from('garages')
    .select('*, abonnements(*, paiements(*))')
    .eq('proprietaire_id', profil?.id)
    .single()

  return <DashboardView profil={profil} garage={garage} />
}
