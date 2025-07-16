'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Shield,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Heart
} from 'lucide-react'

export default function Footer() {
  const [email, setEmail] = useState('')
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    forAdmins: [
      { name: 'Dashboard Access', href: '/admin/login' },
      { name: 'Admin Resources', href: '#' },
      { name: 'Security Guide', href: '#security' },
      { name: 'Platform Analytics', href: '#analytics' },
      { name: 'User Management', href: '#features' }
    ],
    forUsers: [
      { name: 'Find Mentors', href: '#' },
      { name: 'How it Works', href: '#' },
      { name: 'Download App', href: '#' },
      { name: 'User Support', href: '#' },
      { name: 'Success Stories', href: '#' }
    ],
    company: [
      { name: 'About Us', href: '#' },
      { name: 'Careers', href: '#' },
      { name: 'Press Kit', href: '#' },
      { name: 'Blog', href: '#' },
      { name: 'Contact', href: '#' }
    ],
    legal: [
      { name: 'Privacy Policy', href: '#' },
      { name: 'Terms of Service', href: '#' },
      { name: 'Cookie Policy', href: '#' },
      { name: 'GDPR', href: '#' },
      { name: 'Safety Guidelines', href: '#' }
    ]
  }

  const socialLinks = [
    { icon: Facebook, href: '#', name: 'Facebook' },
    { icon: Twitter, href: '#', name: 'Twitter' },
    { icon: Linkedin, href: '#', name: 'LinkedIn' },
    { icon: Instagram, href: '#', name: 'Instagram' }
  ]

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle newsletter subscription
    console.log('Subscribe email:', email)
    setEmail('')
  }

  return (
    <footer className="bg-gray-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/10 to-accent/10"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main Footer Content */}
        <div className="py-12 sm:py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Brand Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="lg:col-span-4 space-y-6"
            >
              {/* Logo */}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-600 to-orange-700 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="text-2xl font-bold text-white font-baskervville">
                  MentorMatch
                </span>
              </div>

              {/* Description */}
              <p className="text-gray-300 font-montserrat leading-relaxed max-w-md">
                Connecting expert mentors with ambitious students worldwide. Transform lives through personalized learning and professional guidance.
              </p>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-gray-300">
                  <div className="w-6 h-6 bg-orange-600/20 rounded flex items-center justify-center">
                    <Mail className="w-3 h-3 text-orange-400" />
                  </div>
                  <span className="font-montserrat text-sm">Email</span>
                </div>
                <p className="text-white font-montserrat ml-9">hello@mentormatch.com</p>
                
                <div className="flex items-center space-x-3 text-gray-300">
                  <div className="w-6 h-6 bg-orange-600/20 rounded flex items-center justify-center">
                    <Phone className="w-3 h-3 text-orange-400" />
                  </div>
                  <span className="font-montserrat text-sm">Phone</span>
                </div>
                <p className="text-white font-montserrat ml-9">+1 (555) 123-4567</p>
                
                <div className="flex items-center space-x-3 text-gray-300">
                  <div className="w-6 h-6 bg-orange-600/20 rounded flex items-center justify-center">
                    <MapPin className="w-3 h-3 text-orange-400" />
                  </div>
                  <span className="font-montserrat text-sm">Address</span>
                </div>
                <p className="text-white font-montserrat ml-9">San Francisco, CA</p>
              </div>

              {/* Social Links */}
              <div className="flex space-x-3">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    className="w-10 h-10 bg-orange-600/20 rounded flex items-center justify-center text-orange-400 hover:text-white hover:bg-orange-600 transition-all duration-300"
                    whileHover={{ scale: 1.1, y: -2 }}
                    aria-label={social.name}
                  >
                    <social.icon className="w-4 h-4" />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Links Sections */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* For Admins */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <h4 className="text-lg font-semibold text-white mb-6 font-baskervville">
                  For Admins
                </h4>
                <ul className="space-y-3">
                  {footerLinks.forAdmins.map((link, index) => (
                    <li key={index}>
                      <a
                        href={link.href}
                        className="text-gray-300 hover:text-orange-400 transition-colors font-montserrat text-sm block"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* For Users */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <h4 className="text-lg font-semibold text-white mb-6 font-baskervville">
                  For Users
                </h4>
                <ul className="space-y-3">
                  {footerLinks.forUsers.map((link, index) => (
                    <li key={index}>
                      <a
                        href={link.href}
                        className="text-gray-300 hover:text-orange-400 transition-colors font-montserrat text-sm block"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Company */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <h4 className="text-lg font-semibold text-white mb-6 font-baskervville">
                  Company
                </h4>
                <ul className="space-y-3">
                  {footerLinks.company.map((link, index) => (
                    <li key={index}>
                      <a
                        href={link.href}
                        className="text-gray-300 hover:text-orange-400 transition-colors font-montserrat text-sm block"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Legal */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <h4 className="text-lg font-semibold text-white mb-6 font-baskervville">
                  Legal
                </h4>
                <ul className="space-y-3">
                  {footerLinks.legal.map((link, index) => (
                    <li key={index}>
                      <a
                        href={link.href}
                        className="text-gray-300 hover:text-orange-400 transition-colors font-montserrat text-sm block"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="border-t border-gray-800 py-8"
        >
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-2 font-baskervville">
              Stay Updated with MentorMatch
            </h3>
            <p className="text-gray-300 font-montserrat mb-6 max-w-2xl mx-auto">
              Get the latest updates on platform features, success stories, and tips for effective mentoring.
            </p>
            
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent font-montserrat"
                required
              />
              <button
                type="submit"
                className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors font-montserrat"
              >
                Subscribe
              </button>
            </form>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="border-t border-gray-800 py-6"
        >
          <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
            <div className="text-sm text-gray-400 font-montserrat">
              © {currentYear} MentorMatch. All rights reserved.
            </div>

            <div className="flex items-center space-x-2 text-sm text-gray-400 font-montserrat">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              <span>for education</span>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}