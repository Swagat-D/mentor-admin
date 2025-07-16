'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, useScroll, useTransform } from 'framer-motion'
import { 
  ArrowRight,
  Shield,
  Users,
  BarChart3,
  Settings,
  Database,
  Lock,
  Zap,
  TrendingUp,
  Globe,
  Clock,
  CheckCircle
} from 'lucide-react'

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

export default function HeroSection() {
  const router = useRouter()
  const [activeFeature, setActiveFeature] = useState(0)
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])

  const features = [
    { icon: Users, label: "User Management", color: "from-blue-500 to-blue-600" },
    { icon: BarChart3, label: "Analytics Dashboard", color: "from-green-500 to-green-600" },
    { icon: Shield, label: "Security Controls", color: "from-red-500 to-red-600" },
    { icon: Settings, label: "System Settings", color: "from-purple-500 to-purple-600" }
  ]

  const keyMetrics = [
    { number: "10K+", label: "Active Users", icon: Users },
    { number: "500+", label: "Mentors", icon: Shield },
    { number: "99.9%", label: "Uptime", icon: TrendingUp },
    { number: "24/7", label: "Support", icon: Clock }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [features.length])

  return (
    <section className="relative pt-20 sm:pt-28 lg:pt-32 pb-12 sm:pb-16 lg:pb-20 overflow-hidden min-h-screen flex items-center" id='hero'>
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          style={{ y }}
          className="absolute top-20 left-10 w-48 sm:w-72 h-48 sm:h-72 bg-gradient-to-br from-primary/30 to-accent/30 rounded-full blur-3xl"
        />
        <motion.div 
          style={{ y: useTransform(scrollYProgress, [0, 1], ['0%', '-30%']) }}
          className="absolute top-40 right-10 w-64 sm:w-96 h-64 sm:h-96 bg-gradient-to-br from-accent/40 to-primary/40 rounded-full blur-3xl"
        />
        <motion.div 
          style={{ y: useTransform(scrollYProgress, [0, 1], ['0%', '20%']) }}
          className="absolute bottom-20 left-1/2 w-48 sm:w-80 h-48 sm:h-80 bg-gradient-to-br from-muted/50 to-accent/20 rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="space-y-6 sm:space-y-8 text-center lg:text-left"
          >
            <motion.div variants={fadeInUp} className="space-y-4 sm:space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center space-x-2 bg-card/80 backdrop-blur-sm rounded-full px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-primary border border-border shadow-sm font-montserrat">
                <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Secure Admin Platform</span>
              </div>
              
              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-baskervville font-bold leading-tight">
                Powerful Admin{' '}
                <span className="gradient-text block lg:inline">Dashboard</span>
                {' '}for MentorMatch
              </h1>
              
              {/* Subtitle */}
              <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground leading-relaxed max-w-2xl mx-auto lg:mx-0 font-montserrat">
                Manage users, analyze platform performance, ensure security, and maintain 
                the highest standards for the MentorMatch ecosystem with advanced administrative tools.
              </p>

              {/* Key Benefits */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-4">
                <div className="flex items-center justify-center lg:justify-start space-x-2 text-foreground">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="font-montserrat font-medium text-sm sm:text-base">Real-time Analytics</span>
                </div>
                <div className="flex items-center justify-center lg:justify-start space-x-2 text-foreground">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="font-montserrat font-medium text-sm sm:text-base">Advanced Security</span>
                </div>
                <div className="flex items-center justify-center lg:justify-start space-x-2 text-foreground">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="font-montserrat font-medium text-sm sm:text-base">User Management</span>
                </div>
                <div className="flex items-center justify-center lg:justify-start space-x-2 text-foreground">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="font-montserrat font-medium text-sm sm:text-base">24/7 Monitoring</span>
                </div>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
              <button
                onClick={() => router.push('/admin/login')}
                className="bg-gradient-to-r from-primary to-accent text-white font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2 text-base sm:text-lg font-montserrat group"
              >
                <span>Access Dashboard</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button 
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-card/90 backdrop-blur-sm text-foreground font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-xl border border-border shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2 text-base sm:text-lg font-montserrat group"
              >
                <Database className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
                <span>Explore Features</span>
              </button>
            </motion.div>

            {/* Quick Stats */}
            <motion.div variants={fadeInUp} className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
              {keyMetrics.map((metric, index) => (
                <div key={index} className="text-center lg:text-left">
                  <div className="flex items-center justify-center lg:justify-start space-x-2 mb-1">
                    <metric.icon className="w-4 h-4 text-primary" />
                    <span className="text-xl sm:text-2xl font-bold text-foreground font-montserrat">
                      {metric.number}
                    </span>
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground font-montserrat">{metric.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Content - Admin Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative mt-8 lg:mt-0"
          >
            <div className="relative">
              {/* Main Dashboard Container */}
              <div className="relative w-full h-80 sm:h-96 md:h-[500px] lg:h-[600px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-card to-muted border border-border">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent" />
                
                {/* Dashboard Header */}
                <div className="absolute top-0 left-0 right-0 h-16 bg-card/95 backdrop-blur-sm border-b border-border flex items-center justify-between px-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                      <Shield className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-semibold text-foreground font-montserrat">Admin Dashboard</span>
                  </div>
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                </div>

                {/* Dashboard Content */}
                <div className="absolute top-16 left-0 right-0 bottom-0 p-6 space-y-6">
                  {/* Feature Cards Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    {features.map((feature, index) => (
                      <motion.div
                        key={index}
                        className={`p-4 rounded-xl border border-border transition-all duration-300 ${
                          activeFeature === index 
                            ? 'bg-card shadow-lg scale-105' 
                            : 'bg-card/50'
                        }`}
                        animate={{
                          scale: activeFeature === index ? 1.05 : 1,
                          opacity: activeFeature === index ? 1 : 0.7
                        }}
                      >
                        <div className={`w-8 h-8 bg-gradient-to-br ${feature.color} rounded-lg flex items-center justify-center mb-2`}>
                          <feature.icon className="w-4 h-4 text-white" />
                        </div>
                        <p className="text-xs font-medium text-foreground font-montserrat">{feature.label}</p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Charts Area */}
                  <div className="bg-card/80 backdrop-blur-sm rounded-xl p-4 border border-border">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-foreground font-montserrat">Platform Analytics</span>
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    </div>
                    
                    {/* Animated Chart Bars */}
                    <div className="space-y-2">
                      {[85, 70, 95, 60].map((height, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-16 text-xs text-muted-foreground font-montserrat">
                            {['Users', 'Sessions', 'Revenue', 'Support'][index]}
                          </div>
                          <div className="flex-1 bg-muted rounded-full h-2">
                            <motion.div
                              className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${height}%` }}
                              transition={{ duration: 1, delay: index * 0.2 }}
                            />
                          </div>
                          <span className="text-xs text-foreground font-montserrat w-8">{height}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Status Indicators */}
                  <div className="flex justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-muted-foreground font-montserrat">System Online</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Globe className="w-3 h-3 text-blue-500" />
                      <span className="text-xs text-muted-foreground font-montserrat">Global Access</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Lock className="w-3 h-3 text-primary" />
                      <span className="text-xs text-muted-foreground font-montserrat">Secure</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="absolute -top-4 sm:-top-6 -right-4 sm:-right-6 bg-card/95 backdrop-blur-sm rounded-2xl shadow-lg border border-border p-4 sm:p-6 max-w-xs floating-element"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-xl sm:text-2xl font-bold text-foreground font-baskervville">99.9%</p>
                    <p className="text-xs sm:text-sm text-muted-foreground font-montserrat">System Uptime</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="absolute -bottom-4 sm:-bottom-6 -left-4 sm:-left-6 bg-card/95 backdrop-blur-sm rounded-2xl shadow-lg border border-border p-4 sm:p-6 max-w-xs floating-element"
                style={{ animationDelay: '2s' }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                    <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-xl sm:text-2xl font-bold text-foreground font-baskervville">Secure</p>
                    <p className="text-xs sm:text-sm text-muted-foreground font-montserrat">Bank-level Security</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}