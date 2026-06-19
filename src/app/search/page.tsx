import { Suspense } from 'react'
import SearchView from '@/components/garage/SearchView'

export const metadata = { title: 'Rechercher un garage' }

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-steel-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-steel-400">Chargement...</p>
        </div>
      </div>
    }>
      <SearchView />
    </Suspense>
  )
}
