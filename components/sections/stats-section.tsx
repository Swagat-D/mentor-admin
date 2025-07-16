'use client'

import React, { useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  TrendingUp,
  Globe,
  Clock,
  Shield,
  Star
} from 'lucide-react'

const stats = [
  {
    icon: Users,
    number: 10247,
    label: 'Active Users',
    description: 'Students and mentors using the platform',
    color: 'from-blue-500 to-blue-600',
    suffix: ''
  },
  {
    icon: GraduationCap,
    number: 1250,
    label: 'Expert Mentors',
    description: 'Verified professionals across disciplines',
    color: 'from-green-500 to-green-600',
    suffix: '+'
  },
  {
    icon: BookOpen,
    number: 45672,
    label: 'Sessions Completed',
    description: 'Successful mentoring sessions delivered',
    color: 'from-purple-500 to-purple-600',
    suffix: ''
  },
  {
    icon: TrendingUp,
    number: 98.5,
    label: 'Success Rate',
    description: 'Student satisfaction and goal achievement',
    color: 'from-orange-500 to-orange-600',
    suffix: '%'
  },
  {
    icon: Globe,
    number: 85,
    label: 'Countries Served',
    description: 'Global reach across continents',
    color: 'from-cyan-500 to-cyan-600',
    suffix: '+'
  },
  {
    icon: Clock,
    number: 99.9,
    label: 'Platform Uptime',
    description: 'Reliable service availability',
    color: 'from-red-500 to-red-600',
    suffix: '%'
  },
  {
    icon: Shield,
    number: 100,
    label: 'Security Score',
    description: 'Bank-level security standards',
    color: 'from-indigo-500 to-indigo-600',
    suffix: '%'
  },
  {
    icon: Star,
    number: 4.9,
    label: 'Average Rating',
    description: 'User satisfaction across all services',
    color: 'from-yellow-500 to-yellow-600',
    suffix: '/5'
  }
]

function AnimatedNumber({ 
  value, 
  duration = 2000,
  suffix = '' 
}: { 
  value: number
  duration?: number
  suffix?: string 
}) {
  const [current, setCurrent] = useState(0)
  const ref = React.useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return

    const startTime = Date.now()
    const startValue = 0
    const endValue = value

    const updateNumber = () => {
      const now = Date.now()
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Easing function for smooth animation
      const easeOutCubic = 1 - Math.pow(1 - progress, 3)
      const currentValue = startValue + (endValue - startValue) * easeOutCubic
      
      setCurrent(currentValue)
      
      if (progress < 1) {
        requestAnimationFrame(updateNumber)
      } else {
        setCurrent(endValue)
      }
    }

    requestAnimationFrame(updateNumber)
  }, [isInView, value, duration])

  return (
    <span ref={ref}>
      {value < 10 ? current.toFixed(1) : Math.floor(current).toLocaleString()}{suffix}
    </span>
  )
}

export default function StatsSection() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-card/50 to-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-accent/20 rounded-full blur-3xl"></div>
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
            <TrendingUp className="w-4 h-4" />
            <span>Platform Statistics</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-baskervville font-bold gradient-text mb-6">
            Trusted by Thousands Worldwide
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto font-montserrat leading-relaxed">
            Our platform continues to grow and serve the global learning community with excellence. 
            Here are the numbers that showcase our impact and reliability.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative"
            >
              <div className="bg-card/95 backdrop-blur-sm rounded-2xl shadow-lg border border-border p-6 sm:p-8 text-center hover:shadow-xl transition-all duration-300 hover:scale-105 h-full">
                {/* Icon */}
                <div className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <stat.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                
                {/* Number */}
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2 font-baskervville">
                  <AnimatedNumber value={stat.number} suffix={stat.suffix} />
                </div>
                
                {/* Label */}
                <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2 font-montserrat">
                  {stat.label}
                </h3>
                
                {/* Description */}
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-montserrat">
                  {stat.description}
                </p>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
          className="mt-16 sm:mt-20"
        >
          <div className="bg-gradient-to-r from-primary to-accent rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-48 sm:w-64 h-48 sm:h-64 bg-white/10 rounded-full -mr-24 sm:-mr-32 -mt-24 sm:-mt-32"></div>
            <div className="absolute bottom-0 left-0 w-32 sm:w-48 h-32 sm:h-48 bg-white/5 rounded-full -ml-16 sm:-ml-24 -mb-16 sm:-mb-24"></div>
            
            <div className="relative z-10 text-center">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-baskervville font-bold mb-4 sm:mb-6">
                Powering the Future of Online Learning
              </h3>
              <p className="text-white/90 text-base sm:text-lg font-montserrat mb-8 max-w-3xl mx-auto leading-relaxed">
                Our robust administrative platform ensures seamless operations, maintains high security standards, 
                and provides comprehensive insights to support continuous platform improvement and user satisfaction.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto">
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold font-baskervville mb-2">24/7</div>
                  <div className="text-white/80 font-montserrat">Monitoring & Support</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold font-baskervville mb-2">&lt; 1s</div>
                  <div className="text-white/80 font-montserrat">Average Response Time</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold font-baskervville mb-2">ISO 27001</div>
                  <div className="text-white/80 font-montserrat">Security Certified</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}