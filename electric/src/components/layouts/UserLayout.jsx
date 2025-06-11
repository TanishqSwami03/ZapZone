"use client"

import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Search, History, User, Menu, X, Zap, LogOut, Wallet, Plus } from "lucide-react"
import { useUser } from "../../context/UserContext"
import AddFundsModal from "../modals/AddFundsModal"

const UserLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showAddFunds, setShowAddFunds] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { logout, currentUser } = useUser()

  const navigation = [
    { name: "Browse Stations", href: "/user/browse", icon: Search },
    { name: "Booking History", href: "/user/history", icon: History },
    { name: "Profile", href: "/user/profile", icon: User },
  ]

  const handleLogout = () => {
    logout()
    navigate("/")
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
            <Zap className="w-8 h-8 text-green-400 mr-2" />
            <motion.span
              style={{ fontFamily: "'Monoton', sans-serif", fontStyle: "normal" }}
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
              Zap<span className="text-green-400">Zone</span>
            </motion.span>
          </div>

          <nav className="mt-8 px-4">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-4 py-3 mb-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-green-400/10 text-green-400 border border-green-400/20"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                  {isActive && (
                    <motion.div layoutId="activeTab" className="ml-auto w-2 h-2 bg-green-400 rounded-full" />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Wallet section below nav */}
          <div className="px-6 py-3 border-t border-gray-700">
            <div className="flex items-center space-x-4 bg-gray-700 rounded-lg px-3 py-2">
              <Wallet className="w-5 h-5 text-green-400" />
              <span className="text-white font-medium">$ 125.50</span>
              <button
                onClick={() => setShowAddFunds(true)}
                className="bg-green-400 text-gray-900 p-1 rounded hover:bg-green-300 transition-colors ml-auto"
                aria-label="Add funds"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="absolute bottom-4 left-4 right-4 border-t border-gray-700 pt-4">
            <button
              onClick={handleLogout}
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
                <Zap className="w-8 h-8 text-green-400 mr-2" />
                <motion.span
                  style={{ fontFamily: "'Monoton', sans-serif", fontStyle: "normal" }}
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
                  Zap<span className="text-green-400">Zone</span>
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
                        ? "bg-green-400/10 text-green-400 border border-green-400/20"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.name}
                    {isActive && (
                      <motion.div layoutId="activeTab" className="ml-auto w-2 h-2 bg-green-400 rounded-full" />
                    )}
                  </Link>
                )
              })}
            </nav>

            {/* Wallet section below nav */}
            <div className="px-6 py-3 border-t border-gray-700">
              <div className="flex items-center space-x-4 bg-gray-700 rounded-lg px-3 py-2">
                <Wallet className="w-5 h-5 text-green-400" />
                <span className="text-white font-medium">$ 125.50</span>
                <button
                  onClick={() => setShowAddFunds(true)}
                  className="bg-green-400 text-gray-900 p-1 rounded hover:bg-green-300 transition-colors ml-auto"
                  aria-label="Add funds"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="absolute bottom-4 left-4 right-4 border-t border-gray-700 pt-4">
              <button
                onClick={handleLogout}
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

          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-gray-900" />
            </div>
            <div className="text-white text-right">
              <span className="text-m text-gray-400">Welcome back, </span>
              <span className="font-medium">{currentUser?.name || "John Doe"}</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>

      {/* Add Funds Modal */}
      <AddFundsModal isOpen={showAddFunds} onClose={() => setShowAddFunds(false)} />
    </div>
  )
}

export default UserLayout
