'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Quote,
  Star,
  ChevronLeft,
  ChevronRight,
  Shield,
  Award
} from 'lucide-react'

const testimonials = [
  {
    name: "Sarah Mitchell",
    role: "Platform Administrator",
    company: "EduTech Solutions",
    image: "SM",
    rating: 5,
    quote: "The MentorMatch admin dashboard has revolutionized how we manage our educational platform. The analytics are comprehensive, and the user management tools are incredibly intuitive.",
    highlight: "Revolutionized platform management"
  },
  {
    name: "David Chen",
    role: "Head of Operations",
    company: "Global Learning Network",
    image: "DC",
    rating: 5,
    quote: "Security features are top-notch. The audit trails and compliance tools have made our regulatory reporting seamless. Best admin platform we've used.",
    highlight: "Top-notch security features"
  },
  {
    name: "Maria Rodriguez",
    role: "System Administrator",
    company: "Academic Connect",
    image: "MR",
    rating: 5,
    quote: "The real-time monitoring and alert system has reduced our incident response time by 70%. The platform practically manages itself now.",
    highlight: "70% faster incident response"
  },
  {
    name: "James Thompson",
    role: "Technical Director",
    company: "LearnHub International",
    image: "JT",
    rating: 5,
    quote: "Scalability and performance are exceptional. We've grown from 1,000 to 50,000 users without any performance degradation. Highly recommended.",
    highlight: "Scaled to 50,000 users seamlessly"
  },
  {
    name: "Emily Watson",
    role: "Chief Information Officer",
    company: "SkillForge Academy",
    image: "EW",
    rating: 5,
    quote: "The API management and integration capabilities are outstanding. We integrated with our existing systems in just a few days.",
    highlight: "Integration completed in days"
  }
]

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    setIsAutoPlaying(false)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
    setIsAutoPlaying(false)
  }

  const goToTestimonial = (index: number) => {
    setCurrentIndex(index)
    setIsAutoPlaying(false)
  }

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-card/50 to-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/10 to-accent/10"></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center space-x-2 bg-card/80 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium text-primary mb-6 font-montserrat border border-border">
            <Quote className="w-4 h-4" />
            <span>Admin Success Stories</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-baskervville font-bold gradient-text mb-6">
            Trusted by Platform Administrators
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto font-montserrat leading-relaxed">
            See what platform administrators and technical leaders are saying about 
            the MentorMatch admin experience and capabilities.
          </p>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center items-center gap-8 mb-12 sm:mb-16"
        >
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-muted-foreground font-montserrat">Enterprise Security</span>
          </div>
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-muted-foreground font-montserrat">Industry Leading</span>
          </div>
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
            ))}
            <span className="text-sm font-medium text-muted-foreground font-montserrat ml-2">4.9/5 Rating</span>
          </div>
        </motion.div>

        {/* Main Testimonial Display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-card/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-border p-8 sm:p-12 relative overflow-hidden">
            {/* Background Quote */}
            <div className="absolute top-4 right-4 sm:top-8 sm:right-8 opacity-10">
              <Quote className="w-16 h-16 sm:w-24 sm:h-24 text-primary" />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="relative z-10"
              >
                {/* Quote */}
                <div className="text-center mb-8">
                  <p className="text-lg sm:text-xl lg:text-2xl text-foreground leading-relaxed font-montserrat italic mb-4">
                    "{testimonials[currentIndex].quote}"
                  </p>
                  <div className="inline-block bg-gradient-to-r from-primary to-accent text-white px-4 py-2 rounded-full text-sm font-semibold font-montserrat">
                    {testimonials[currentIndex].highlight}
                  </div>
                </div>

                {/* Author Info */}
                <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                  {/* Avatar */}
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {testimonials[currentIndex].image}
                  </div>
                  
                  {/* Details */}
                  <div className="text-center sm:text-left">
                    <h4 className="text-lg sm:text-xl font-bold text-foreground font-baskervville">
                      {testimonials[currentIndex].name}
                    </h4>
                    <p className="text-muted-foreground font-montserrat">
                      {testimonials[currentIndex].role}
                    </p>
                    <p className="text-sm text-muted-foreground font-montserrat">
                      {testimonials[currentIndex].company}
                    </p>
                  </div>

                  {/* Rating */}
                  <div className="flex space-x-1">
                    {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

                          {/* Navigation */}
            <div className="flex items-center justify-between mt-8">
              <button
                onClick={prevTestimonial}
                className="p-2 rounded-full bg-background/50 border border-border hover:bg-background transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-foreground" />
              </button>

              {/* Dots Indicator */}
              <div className="flex space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToTestimonial(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentIndex 
                        ? 'bg-primary w-8' 
                        : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={nextTestimonial}
                className="p-2 rounded-full bg-background/50 border border-border hover:bg-background transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-foreground" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Additional Testimonials Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 sm:mt-20"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {testimonials.slice(0, 3).map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-card/95 backdrop-blur-sm rounded-xl shadow-lg border border-border p-6 hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                {/* Mini Quote */}
                <div className="flex items-start space-x-3 mb-4">
                  <Quote className="w-6 h-6 text-primary/60 flex-shrink-0 mt-1" />
                  <p className="text-sm text-muted-foreground font-montserrat leading-relaxed">
                    {testimonial.quote.substring(0, 120)}...
                  </p>
                </div>

                {/* Author */}
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {testimonial.image}
                  </div>
                  <div>
                    <h5 className="text-sm font-semibold text-foreground font-baskervville">
                      {testimonial.name}
                    </h5>
                    <p className="text-xs text-muted-foreground font-montserrat">
                      {testimonial.company}
                    </p>
                  </div>
                  <div className="ml-auto flex space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 text-yellow-500 fill-current" />
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-16 sm:mt-20 text-center"
        >
          <div className="bg-gradient-to-r from-primary to-accent rounded-2xl p-8 sm:p-12 text-white relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-48 sm:w-64 h-48 sm:h-64 bg-white/10 rounded-full -mr-24 sm:-mr-32 -mt-24 sm:-mt-32"></div>
            <div className="absolute bottom-0 left-0 w-32 sm:w-48 h-32 sm:h-48 bg-white/5 rounded-full -ml-16 sm:-ml-24 -mb-16 sm:-mb-24"></div>
            
            <div className="relative z-10">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-baskervville font-bold mb-4">
                Ready to Experience Superior Admin Tools?
              </h3>
              <p className="text-white/90 text-base sm:text-lg font-montserrat mb-8 max-w-2xl mx-auto">
                Join the administrators who trust MentorMatch for their platform management needs. 
                Experience the difference that enterprise-grade tools can make.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => window.location.href = '/admin/login'}
                  className="bg-white text-primary font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 font-montserrat"
                >
                  Access Admin Dashboard
                </button>
                <button className="bg-white/20 backdrop-blur text-white font-semibold py-4 px-8 rounded-xl border border-white/30 hover:bg-white/30 transition-all duration-300 hover:scale-105 font-montserrat">
                  Schedule Demo
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}