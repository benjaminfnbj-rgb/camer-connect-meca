import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: {
    default: 'Camer Connect Méca — Trouvez votre garage au Cameroun',
    template: '%s | Camer Connect Méca',
  },
  description:
    'La plateforme numérique qui connecte professionnels de la mécanique et automobilistes au Cameroun. Garages moto, voiture, camion — RDV en ligne, avis vérifiés.',
  keywords: [
    'garage cameroun', 'mécanicien cameroun', 'réparation voiture cameroun',
    'garage douala', 'garage yaoundé', 'mécanique moto cameroun',
  ],
  openGraph: {
    type: 'website',
    locale: 'fr_CM',
    url: 'https://meca.comconnectservice.com',
    title: 'Camer Connect Méca',
    description: 'Trouvez le meilleur garage près de chez vous au Cameroun',
    siteName: 'Camer Connect Méca',
  },
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#f97316',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-steel-950 text-steel-100 antialiased">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1e293b',
              color: '#f1f5f9',
              border: '1px solid #334155',
              borderRadius: '12px',
            },
            success: { iconTheme: { primary: '#f97316', secondary: '#fff' } },
          }}
        />
        {children}
      </body>
    </html>
  )
}
