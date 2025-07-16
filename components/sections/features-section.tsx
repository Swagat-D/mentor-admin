'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { 
  Users,
  BarChart3,
  Shield,
  Settings,
  Database,
  Bell,
  Lock,
  Globe,
  Zap,
  FileText,
  Monitor,
  HeadphonesIcon
} from 'lucide-react'

const features = [
  {
    icon: Users,
    title: "User Management",
    description: "Comprehensive user administration with role-based access control, user verification, and activity monitoring.",
    color: "bg-blue-600",
    features: ["Role-based permissions", "User verification", "Activity tracking", "Bulk operations"]
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Real-time insights into platform performance, user engagement, and business metrics with customizable dashboards.",
    color: "bg-green-600",
    features: ["Real-time data", "Custom reports", "Performance metrics", "Growth analytics"]
  },
  {
    icon: Shield,
    title: "Security Center",
    description: "Advanced security controls including threat detection, audit logs, and compliance management tools.",
    color: "bg-red-600",
    features: ["Threat detection", "Audit logging", "Compliance tools", "Access monitoring"]
  },
  {
    icon: Settings,
    title: "System Configuration",
    description: "Centralized platform settings management with environment controls and feature flag management.",
    color: "bg-purple-600",
    features: ["Environment control", "Feature flags", "API management", "System optimization"]
  },
  {
    icon: Database,
    title: "Data Management",
    description: "Powerful data administration tools for backup, recovery, migration, and data integrity management.",
    color: "bg-indigo-600",
    features: ["Data backup", "Recovery tools", "Migration support", "Integrity checks"]
  },
  {
    icon: Bell,
    title: "Notification System",
    description: "Comprehensive notification management for alerts, announcements, and automated communications.",
    color: "bg-orange-600",
    features: ["Alert management", "Automated notifications", "Custom templates", "Delivery tracking"]
  }
]

const additionalFeatures = [
  {
    icon: Lock,
    title: "Multi-Factor Authentication",
    description: "Enhanced security with multiple authentication methods"
  },
  {
    icon: Globe,
    title: "Global Infrastructure",
    description: "Worldwide server distribution for optimal performance"
  },
  {
    icon: Zap,
    title: "API Management",
    description: "Comprehensive API controls and rate limiting"
  },
  {
    icon: FileText,
    title: "Audit & Compliance",
    description: "Complete audit trails and regulatory compliance"
  },
  {
    icon: Monitor,
    title: "System Monitoring",
    description: "24/7 system health and performance monitoring"
  },
  {
    icon: HeadphonesIcon,
    title: "Priority Support",
    description: "Dedicated admin support with priority response"
  }
]

export default function FeaturesSection() {
  return (
    <section id="features" className="py-16 sm:py-20 lg:py-24 bg-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 to-accent/5"></div>
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
            <Settings className="w-4 h-4" />
            <span>Admin Features</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-baskervville font-bold gradient-text mb-6">
            Comprehensive Admin Tools
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto font-montserrat leading-relaxed">
            Everything you need to manage, monitor, and maintain the MentorMatch platform 
            with enterprise-grade tools and intuitive interfaces.
          </p>
        </motion.div>

        {/* Main Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative"
            >
              <div className="bg-card/95 backdrop-blur-sm rounded-2xl shadow-lg border border-border p-6 sm:p-8 hover:shadow-xl transition-all duration-300 hover:scale-105 h-full">
                {/* Icon */}
                <div className={`w-12 h-12 sm:w-16 sm:h-16 ${feature.color} rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <feature.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                
                {/* Content */}
                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-3 sm:mb-4 font-baskervville group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed font-montserrat text-sm sm:text-base mb-4">
                  {feature.description}
                </p>

                {/* Feature List */}
                <div className="space-y-2">
                  {feature.features.map((item, idx) => (
                    <div key={idx} className="flex items-center space-x-2 text-xs sm:text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                      <span className="font-montserrat">{item}</span>
                    </div>
                  ))}
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-primary to-accent rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden"
        >
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-48 sm:w-64 h-48 sm:h-64 bg-white/10 rounded-full -mr-24 sm:-mr-32 -mt-24 sm:-mt-32"></div>
          <div className="absolute bottom-0 left-0 w-32 sm:w-48 h-32 sm:h-48 bg-white/5 rounded-full -ml-16 sm:-ml-24 -mb-16 sm:-mb-24"></div>
          
          <div className="relative z-10">
            <div className="text-center mb-8 sm:mb-12">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-baskervville font-bold mb-4">
                Enterprise-Grade Capabilities
              </h3>
              <p className="text-white/90 text-base sm:text-lg font-montserrat max-w-2xl mx-auto">
                Advanced features designed for scalability, security, and operational excellence
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {additionalFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center group"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:bg-white/30 transition-colors">
                    <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h4 className="text-base sm:text-lg font-semibold mb-2 font-baskervville">
                    {feature.title}
                  </h4>
                  <p className="text-white/80 text-sm font-montserrat leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Security & Compliance Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 sm:mt-20"
        >
          <div className="bg-card/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-lg border border-border p-8 sm:p-12">
            <div className="text-center mb-8 sm:mb-12">
              <div className="inline-flex items-center space-x-2 bg-background/80 rounded-full px-4 py-2 text-sm font-medium text-primary mb-4 border border-border">
                <Shield className="w-4 h-4" />
                <span>Security & Compliance</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-baskervville font-bold text-foreground mb-4">
                Bank-Level Security Standards
              </h3>
              <p className="text-muted-foreground font-montserrat text-base sm:text-lg max-w-2xl mx-auto">
                Our platform meets the highest security and compliance standards to protect user data and ensure regulatory compliance.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {[
                { title: "SOC 2 Type II", description: "Security & availability compliance" },
                { title: "ISO 27001", description: "Information security management" },
                { title: "GDPR Compliant", description: "Data protection & privacy" },
                { title: "256-bit SSL", description: "End-to-end encryption" }
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-base sm:text-lg font-semibold text-foreground mb-2 font-baskervville">
                    {item.title}
                  </h4>
                  <p className="text-muted-foreground text-sm font-montserrat">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}