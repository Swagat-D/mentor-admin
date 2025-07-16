'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Menu, 
  X, 
  Shield,
  ChevronDown,
  Settings,
  BarChart3,
  Users,
  Lock
} from 'lucide-react'

export default function Navbar() {
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('.mobile-menu') && !target.closest('.mobile-menu-button')) {
        setIsMobileMenuOpen(false)
      }
    }

    if (isMobileMenuOpen) {
      document.addEventListener('click', handleClickOutside)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.removeEventListener('click', handleClickOutside)
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  const navItems = [
    { 
      href: '#features', 
      label: 'Features',
      icon: Settings,
      dropdown: [
        { name: 'User Management', href: '#features', icon: Users },
        { name: 'Analytics Dashboard', href: '#analytics', icon: BarChart3 },
        { name: 'Security Center', href: '#security', icon: Lock },
        { name: 'System Settings', href: '#features', icon: Settings }
      ]
    },
    { href: '#analytics', label: 'Analytics', icon: BarChart3 },
    { href: '#security', label: 'Security', icon: Lock },
    { href: '#support', label: 'Support', icon: Users }
  ]

  const handleDropdownToggle = (label: string) => {
    setActiveDropdown(activeDropdown === label ? null : label)
  }

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-background/95 backdrop-blur-md shadow-lg border-b border-border' 
            : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20">
            {/* Logo */}
            <motion.div 
              className="flex items-center space-x-2 sm:space-x-3 cursor-pointer"
              whileHover={{ scale: 1.02 }}
              onClick={() => window.location.href = '/'}
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-orange-600 to-orange-700 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl lg:text-2xl font-bold text-orange-700 font-baskervville leading-tight">
                  MentorMatch
                </span>
                <span className="text-xs lg:text-sm text-muted-foreground font-montserrat -mt-0.5 sm:-mt-1 hidden sm:block">
                  Admin Dashboard
                </span>
              </div>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
              {navItems.map((item, index) => (
                <div key={item.label} className="relative group">
                  {item.dropdown ? (
                    <div className="relative">
                      <button
                        className="flex items-center space-x-1 text-muted-foreground hover:text-foreground transition-colors font-montserrat font-medium py-2 group"
                        onMouseEnter={() => setActiveDropdown(item.label)}
                        onMouseLeave={() => setActiveDropdown(null)}
                      >
                        <item.icon className="w-4 h-4" />
                        <span>{item.label}</span>
                        <ChevronDown className="w-3 h-3 transition-transform group-hover:rotate-180" />
                      </button>
                      
                      <AnimatePresence>
                        {activeDropdown === item.label && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full left-0 mt-2 w-56 bg-card/95 backdrop-blur-md rounded-xl shadow-xl border border-border py-2"
                            onMouseEnter={() => setActiveDropdown(item.label)}
                            onMouseLeave={() => setActiveDropdown(null)}
                          >
                            {item.dropdown.map((dropdownItem, idx) => (
                              <a
                                key={idx}
                                href={dropdownItem.href}
                                className="flex items-center space-x-3 px-4 py-3 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors font-montserrat text-sm"
                              >
                                <dropdownItem.icon className="w-4 h-4" />
                                <span>{dropdownItem.name}</span>
                              </a>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <motion.a
                      href={item.href}
                      className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors font-montserrat font-medium relative group py-2"
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      whileHover={{ y: -2 }}
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.label}</span>
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-600 to-orange-700 transition-all duration-300 group-hover:w-full"></span>
                    </motion.a>
                  )}
                </div>
              ))}
            </div>

            {/* Sign In Button & Mobile Menu */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <motion.button
                onClick={() => router.push('/admin/login')}
                className="bg-gradient-to-r from-orange-600 to-orange-700 text-white px-3 sm:px-4 lg:px-6 py-2 lg:py-3 rounded-lg hover:shadow-lg transition-all duration-300 font-montserrat font-semibold text-xs sm:text-sm lg:text-base flex items-center space-x-1 sm:space-x-2"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden xs:inline">Admin Sign In</span>
                <span className="xs:hidden">Sign In</span>
              </motion.button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors mobile-menu-button"
                aria-label="Toggle mobile menu"
              >
                <motion.div
                  animate={{ rotate: isMobileMenuOpen ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {isMobileMenuOpen ? (
                    <X className="w-5 h-5 sm:w-6 sm:h-6 text-foreground" />
                  ) : (
                    <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-foreground" />
                  )}
                </motion.div>
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Mobile Menu */}
            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ duration: 0.3, type: 'tween' }}
              className="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-card/95 backdrop-blur-md border-l border-border z-50 lg:hidden mobile-menu"
            >
              <div className="flex flex-col h-full">
                {/* Mobile Menu Header */}
                <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-600 to-orange-700 rounded-lg flex items-center justify-center">
                      <Shield className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <span className="text-lg font-bold text-foreground font-baskervville">MentorMatch</span>
                      <p className="text-xs text-muted-foreground font-montserrat">Admin Dashboard</p>
                    </div>
                  </div>
                </div>

                {/* Mobile Menu Items */}
                <div className="flex-1 overflow-y-auto py-4">
                  <div className="space-y-2 px-4">
                    {navItems.map((item, index) => (
                      <div key={item.label}>
                        {item.dropdown ? (
                          <div>
                            <button
                              onClick={() => handleDropdownToggle(item.label)}
                              className="w-full flex items-center justify-between p-3 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors font-montserrat"
                            >
                              <div className="flex items-center space-x-3">
                                <item.icon className="w-4 h-4" />
                                <span>{item.label}</span>
                              </div>
                              <ChevronDown className={`w-4 h-4 transition-transform ${
                                activeDropdown === item.label ? 'rotate-180' : ''
                              }`} />
                            </button>
                            
                            <AnimatePresence>
                              {activeDropdown === item.label && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.3 }}
                                  className="ml-4 mt-2 space-y-1 border-l border-border pl-4"
                                >
                                  {item.dropdown.map((dropdownItem, idx) => (
                                    <a
                                      key={idx}
                                      href={dropdownItem.href}
                                      className="flex items-center space-x-3 p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors font-montserrat text-sm"
                                      onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                      <dropdownItem.icon className="w-4 h-4" />
                                      <span>{dropdownItem.name}</span>
                                    </a>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        ) : (
                          <motion.a
                            href={item.href}
                            className="flex items-center space-x-3 p-3 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors font-montserrat"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <item.icon className="w-4 h-4" />
                            <span>{item.label}</span>
                          </motion.a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mobile Menu Footer */}
                <div className="p-4 border-t border-border">
                  <div className="text-xs text-muted-foreground font-montserrat text-center">
                    Secure Admin Access
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}