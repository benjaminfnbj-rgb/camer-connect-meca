import Navbar from '@/components/layout/Navbar'
import HeroSection from '@/components/home/HeroSection'
import StatsSection from '@/components/home/StatsSection'
import HowItWorks from '@/components/home/HowItWorks'
import ForfaitsSection from '@/components/home/ForfaitsSection'
import TestimonialsSection from '@/components/home/TestimonialsSection'
import CTASection from '@/components/home/CTASection'
import Footer from '@/components/layout/Footer'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-steel-950">
      <Navbar />
      <HeroSection />
      <StatsSection />
      <HowItWorks />
      <ForfaitsSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </main>
  )
}
