"use client"

import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Building2, Calendar, DollarSign, Menu, X, Zap, LogOut } from "lucide-react"
import { useUser } from "../../context/UserContext"
import ConfirmModal from "../modals/ConfirmModal"

const CompanyLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { logout, currentUser } = useUser()

  const navigation = [
    { name: "Manage Stations", href: "/company/stations", icon: Building2 },
    { name: "Booking Management", href: "/company/bookings", icon: Calendar },
    { name: "Earnings", href: "/company/earnings", icon: DollarSign },
  ]

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  const confirmLogout = () => {
    setShowLogoutConfirm(false)
    handleLogout()
  }

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Mobile sidebar backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 backdrop-blur-sm bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar - Hidden on mobile, visible on desktop */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex flex-col flex-grow bg-gray-800 border-r border-gray-700">
          <div className="flex items-center h-16 px-6 border-b border-gray-700">
            <Zap className="w-8 h-8 text-blue-400 mr-2" />
            <motion.span
              style={{ fontFamily: "'Monoton', sans-serif", fontStyle:'normal' }}
              className="text-white text-2xl tracking-wide uppercase relative overflow-hidden"
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
              Zap<span className="text-blue-400">Zone</span>
            </motion.span>
          </div>

          <nav className="mt-8 px-4 flex-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-4 py-3 mb-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-blue-400/10 text-blue-400 border border-blue-400/20"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                  {isActive && <motion.div layoutId="activeTab" className="ml-auto w-2 h-2 bg-blue-400 rounded-full" />}
                </Link>
              )
            })}
          </nav>

          <div className="p-4 border-t border-gray-700">
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="flex items-center w-full px-4 py-3 text-gray-300 hover:bg-red-600 hover:text-white rounded-lg transition-all duration-200"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed inset-y-0 left-0 z-50 w-64 bg-gray-800 border-r border-gray-700 lg:hidden"
          >
            <div className="flex items-center justify-between h-16 px-6 border-b border-gray-700">
              <div className="flex items-center">
                <Zap className="w-8 h-8 text-blue-400 mr-2" />
                <motion.span
                  style={{ fontFamily: "'Monoton', sans-serif", fontStyle:'normal' }}
                  className="text-white text-xl tracking-wide uppercase relative overflow-hidden"
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
                  Zap<span className="text-blue-400">Zone</span>
                </motion.span>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="mt-8 px-4 flex-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center px-4 py-3 mb-2 rounded-lg transition-all duration-200 ${
                      isActive
                        ? "bg-blue-400/10 text-blue-400 border border-blue-400/20"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.name}
                    {isActive && (
                      <motion.div layoutId="activeTab" className="ml-auto w-2 h-2 bg-blue-400 rounded-full" />
                    )}
                  </Link>
                )
              })}
            </nav>

            <div className="absolute bottom-4 left-4 right-4 border-t border-gray-700 pt-4">
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="flex items-center w-full px-4 py-3 text-gray-300 hover:bg-red-600 hover:text-white rounded-lg transition-all duration-200"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 lg:pl-64">
        {/* Header */}
        <header className="bg-gray-800 border-b border-gray-700 h-16 flex items-center justify-between px-6">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-400 hover:text-white">
            <Menu className="w-6 h-6" />
          </button>

          {/* Empty space for mobile */}
          <div className="lg:hidden"></div>

          {/* User info - always on the right */}
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center">
              <Building2 className="w-4 h-4 text-gray-900" />
            </div>
            <div className="text-white text-left">
              <span className="ml-1 text-sm text-gray-400">EV Solutions Inc.</span>
              <span className="ml-1 font-medium block">Company Dashboard</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>

      {/* Logout Confirmation Modal */}
      <ConfirmModal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={confirmLogout}
        title="Confirm Logout"
        message="Are you sure you want to logout? You will need to sign in again to access your account."
        confirmText="Logout"
        confirmColor="red"
      />
    </div>
  )
}

export default CompanyLayout
