"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import {
  Zap,
  MapPin,
  Clock,
  Star,
  ArrowRight,
  Menu,
  X,
  Mail,
  Phone,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react"

const LandingPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [email, setEmail] = useState("")

  const features = [
    {
      icon: MapPin,
      title: "Find Stations",
      description: "Locate charging stations near you with real-time availability",
    },
    {
      icon: Clock,
      title: "Quick Booking",
      description: "Reserve your charging slot in advance with instant confirmation",
    },
    {
      icon: Star,
      title: "Quality Assured",
      description: "All stations are verified and rated by our community",
    },
  ]

  const stats = [
    { number: "10,000+", label: "Charging Sessions" },
    { number: "500+", label: "Charging Stations" },
    { number: "50+", label: "Partner Companies" },
    { number: "98%", label: "Customer Satisfaction" },
  ]

  const handleNewsletterSubmit = (e) => {
    e.preventDefault()
    // Handle newsletter signup
    console.log("Newsletter signup:", email)
    setEmail("")
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Navigation */}
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center h-14">
              <Zap className="w-11 h-11 text-green-400 mr-2" />
              <motion.span
                style={{ fontFamily: "'Monoton', sans-serif", fontStyle: "normal" }}
                className="text-white text-3xl tracking-wide uppercase relative overflow-hidden"
                animate={{
                  x: [0, -2, 2, -1, 1, 0],
                  skewX: [0, 5, -5, 3, -3, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "easeInOut",
                }}
              >
                Zap<span className="text-green-400">Zone</span>
              </motion.span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link to="/login" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-green-400 text-gray-900 hover:bg-green-300 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Get Started
                </Link>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-400 hover:text-white">
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-700">
              <Link
                to="/login"
                className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-green-400 text-gray-900 hover:bg-green-300 block px-3 py-2 rounded-md text-base font-medium"
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
              <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6">
                Power Your Journey with
                <span className="text-green-400"> Smart EV Charging</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Find, book, and manage EV charging stations effortlessly. Join thousands of drivers making the switch to
                sustainable transportation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-lg hover:shadow-green-400/20 transition-all duration-300 text-center"
                >
                  Start Charging Today
                </Link>
                <Link
                  to="/browse"
                  className="border border-gray-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-800 transition-all duration-300 text-center"
                >
                  Browse Stations
                </Link>
              </div>
            </motion.div>

            {/* Right Illustration */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative w-full h-96 lg:h-[500px]">
                {/* Main charging scene */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 to-blue-500/10 rounded-3xl border border-green-400/20 overflow-hidden">
                  {/* Background pattern */}
                  <div className="absolute inset-0 opacity-5">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <defs>
                        <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                          <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" />
                        </pattern>
                      </defs>
                      <rect width="100" height="100" fill="url(#grid)" />
                    </svg>
                  </div>

                  {/* Electric car */}
                  <motion.div
                    animate={{
                      y: [0, -5, 0],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                    className="absolute bottom-20 left-8"
                  >
                    <div className="w-32 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl relative shadow-lg">
                      {/* Car body */}
                      <div className="absolute -top-6 left-4 right-4 h-10 bg-gradient-to-r from-blue-400 to-purple-400 rounded-t-xl" />
                      {/* Windows */}
                      <div className="absolute -top-4 left-6 right-6 h-6 bg-blue-300/30 rounded-t-lg" />
                      {/* Wheels */}
                      <div className="absolute -bottom-3 left-2 w-6 h-6 bg-gray-800 rounded-full border-2 border-gray-600" />
                      <div className="absolute -bottom-3 right-2 w-6 h-6 bg-gray-800 rounded-full border-2 border-gray-600" />
                      {/* Charging port */}
                      <motion.div
                        animate={{
                          opacity: [0.5, 1, 0.5],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "easeInOut",
                        }}
                        className="absolute top-2 right-2 w-4 h-4 bg-green-400 rounded-full shadow-lg"
                      />
                    </div>
                  </motion.div>

                  {/* Charging station */}
                  <motion.div
                    animate={{
                      scale: [1, 1.02, 1],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                    className="absolute bottom-16 right-16"
                  >
                    <div className="w-6 h-24 bg-gradient-to-t from-gray-700 to-gray-500 rounded-t-lg shadow-lg" />
                    <div className="absolute top-4 -left-4 w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    {/* Charging cable */}
                    <div className="absolute top-12 -left-12 w-12 h-2 bg-green-400 rounded-full transform -rotate-45" />
                  </motion.div>

                  {/* Floating UI elements */}
                  <motion.div
                    animate={{
                      y: [0, -10, 0],
                      rotate: [0, 2, 0],
                    }}
                    transition={{
                      duration: 5,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                    className="absolute top-16 left-16 bg-blue-400/20 backdrop-blur-sm border border-blue-400/30 rounded-xl p-3"
                  >
                    <MapPin className="w-6 h-6 text-blue-400 mb-1" />
                    <div className="text-blue-400 text-xs font-semibold">Find Stations</div>
                  </motion.div>

                  <motion.div
                    animate={{
                      y: [0, -15, 0],
                      rotate: [0, -2, 0],
                    }}
                    transition={{
                      duration: 6,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                      delay: 1,
                    }}
                    className="absolute top-32 right-8 bg-green-400/20 backdrop-blur-sm border border-green-400/30 rounded-xl p-3"
                  >
                    <div className="text-green-400 text-lg font-bold">85%</div>
                    <div className="text-green-400 text-xs">Charged</div>
                  </motion.div>

                  <motion.div
                    animate={{
                      y: [0, -8, 0],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                      delay: 2,
                    }}
                    className="absolute bottom-32 right-4 bg-purple-400/20 backdrop-blur-sm border border-purple-400/30 rounded-xl p-3"
                  >
                    <div className="text-purple-400 text-sm font-semibold">45kW</div>
                    <div className="text-purple-400 text-xs">Fast Charge</div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Why Choose Our Platform?</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Experience the future of EV charging with our comprehensive platform designed for drivers and station
              operators.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="bg-gray-700 rounded-xl p-8 text-center hover:bg-gray-600 transition-colors"
              >
                <div className="w-16 h-16 bg-green-400/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl lg:text-4xl font-bold text-green-400 mb-2">{stat.number}</div>
                <div className="text-gray-300">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Toned Down */}
      <section className="py-20 bg-gray-800 border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Ready to Start Your EV Journey?</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of drivers who have already made the switch to sustainable transportation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-green-400 text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-300 transition-colors inline-flex items-center justify-center"
              >
                Get Started Today
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link
                to="/browse"
                className="border border-gray-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-700 transition-colors"
              >
                Browse Stations
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-1">
              <div className="flex items-center mb-4">
                <Zap className="w-8 h-8 text-green-400 mr-2" />
                <span className="text-white font-bold text-xl">EV Recharge</span>
              </div>
              <p className="text-gray-400 mb-4">
                Leading the future of electric vehicle charging with smart, reliable, and accessible charging solutions.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/browse" className="text-gray-400 hover:text-white transition-colors">
                    Find Stations
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="text-gray-400 hover:text-white transition-colors">
                    Sign Up
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="text-gray-400 hover:text-white transition-colors">
                    Login
                  </Link>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    How It Works
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Cookie Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Support
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact & Newsletter */}
            <div>
              <h3 className="text-white font-semibold mb-4">Stay Connected</h3>
              <div className="space-y-4">
                <div className="flex items-center text-gray-400">
                  <Mail className="w-4 h-4 mr-2" />
                  <span className="text-sm">support@evrecharge.com</span>
                </div>
                <div className="flex items-center text-gray-400">
                  <Phone className="w-4 h-4 mr-2" />
                  <span className="text-sm">+1 (555) 123-4567</span>
                </div>
                <form onSubmit={handleNewsletterSubmit} className="mt-4">
                  <div className="flex">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-l-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400"
                      required
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-green-400 text-gray-900 rounded-r-lg hover:bg-green-300 transition-colors"
                    >
                      Subscribe
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-400">© {new Date().getFullYear()} EV Recharge Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
