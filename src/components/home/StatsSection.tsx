'use client'
import { useEffect, useRef, useState } from 'react'

const stats = [
  { value: 10, suffix: '+', label: 'Régions du Cameroun', icon: '🗺️' },
  { value: 500, suffix: '+', label: 'Garages partenaires', icon: '🔧' },
  { value: 28, suffix: 'M', label: 'Camerounais ciblés', icon: '👥' },
  { value: 30, suffix: 'J', label: "Essai gratuit pour tout garage", icon: '🎁' },
]

function AnimatedNumber({ value, suffix }: { value: number; suffix: string }) {
  const [current, setCurrent] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const duration = 2000
          const steps = 60
          const increment = value / steps
          let current = 0
          const timer = setInterval(() => {
            current += increment
            if (current >= value) {
              setCurrent(value)
              clearInterval(timer)
            } else {
              setCurrent(Math.floor(current))
            }
          }, duration / steps)
        }
      },
      { threshold: 0.5 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [value])

  return (
    <span ref={ref}>
      {current}{suffix}
    </span>
  )
}

export default function StatsSection() {
  return (
    <section className="relative py-20 bg-steel-900/50 border-y border-steel-800">
      {/* Brand line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-500 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="text-center group"
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                {stat.icon}
              </div>
              <div className="font-display font-bold text-4xl md:text-5xl text-white mb-2">
                <AnimatedNumber value={stat.value} suffix={stat.suffix} />
              </div>
              <p className="text-steel-400 text-sm leading-snug">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-500/40 to-transparent" />
    </section>
  )
}
