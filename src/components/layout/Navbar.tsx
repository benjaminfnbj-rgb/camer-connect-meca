'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, Wrench, ChevronDown } from 'lucide-react'

const navLinks = [
  { label: 'Rechercher', href: '/search' },
  { label: 'Comment ça marche', href: '#comment-ca-marche' },
  { label: 'Tarifs', href: '#tarifs' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-steel-900/95 backdrop-blur-md border-b border-steel-800 shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-brand-gradient flex items-center justify-center shadow-orange-glow group-hover:scale-105 transition-transform">
              <Wrench size={18} className="text-white" strokeWidth={2.5} />
            </div>
            <div className="leading-tight">
              <span className="block font-display font-bold text-white text-base">
                Camer Connect
              </span>
              <span className="block text-brand-500 font-semibold text-xs -mt-0.5 tracking-wider uppercase">
                Méca
              </span>
            </div>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-steel-300 hover:text-white font-medium text-sm transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/auth/connexion" className="btn-secondary text-sm py-2 px-4">
              Connexion
            </Link>
            <Link href="/auth/inscription-garage" className="btn-primary text-sm py-2 px-4">
              Mon garage
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-lg text-steel-400 hover:text-white hover:bg-steel-800 transition-colors"
            aria-label="Menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-steel-900/98 backdrop-blur-md border-t border-steel-800 animate-fade-in">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="block px-4 py-3 text-steel-300 hover:text-white hover:bg-steel-800 rounded-xl transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-steel-800 space-y-2">
              <Link href="/auth/connexion" onClick={() => setOpen(false)} className="btn-secondary w-full justify-center text-sm">
                Connexion
              </Link>
              <Link href="/auth/inscription-garage" onClick={() => setOpen(false)} className="btn-primary w-full justify-center text-sm">
                Inscrire mon garage
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
