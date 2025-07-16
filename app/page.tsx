'use client'

import Navbar from '@/components/layout/navbar'
import HeroSection from '@/components/sections/hero-section'
import StatsSection from '@/components/sections/stats-section'
import FeaturesSection from '@/components/sections/features-section'
import TestimonialsSection from '@/components/sections/testimonials-section'
import Footer from '@/components/layout/footer'

export default function AdminLandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-warm-100 to-card overflow-x-hidden">
      <Navbar />
      <main>
        <HeroSection />
        <StatsSection />
        <FeaturesSection />
        <TestimonialsSection />
      </main>
      <Footer />
    </div>
  )
}