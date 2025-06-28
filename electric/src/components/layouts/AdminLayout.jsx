"use client"

import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Shield, BarChart3, Menu, X, Zap, LogOut, Building2, User, Home } from "lucide-react"
import { useUser } from "../../context/UserContext"
import { signOut, onAuthStateChanged } from "firebase/auth"
import { auth, db } from "../../firebase/firebaseConfig"
import { doc, getDoc, collection, query, where, getDocs, onSnapshot } from "firebase/firestore"

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { logout, currentUser } = useUser()

  const overviewNavigation = [{ name: "Dashboard Overview", href: "/admin", icon: Home }]

  const stationNavigation = [{ name: "Station Moderation", href: "/admin/stations", icon: Building2 }]

  const userNavigation = [
    { name: "Individual Users", href: "/admin/users", icon: User },
    { name: "Companies", href: "/admin/companies", icon: Building2 },
  ]

  const reportsNavigation = [{ name: "Analytics & Reports", href: "/admin/reports", icon: BarChart3 }]

  const handleLogout = async () => {
    try {
      await signOut(auth)
      navigate("/")
    } catch (err) {
      console.error("Logout failed", err)
    }
  }

  const confirmLogout = () => {
    setShowLogoutConfirm(false)
    handleLogout()
  }

  const isActiveSection = (href) => {
    if (href === "/admin") {
      return location.pathname === "/admin" || location.pathname === "/admin/"
    }
    return location.pathname === href
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
        <div className="flex flex-col flex-grow border-r bg-gradient-to-br from-gray-800 to-gray-900 backdrop-blur-md border border-gray-700 shadow-md">
          {/* Logo */}
          <div className="h-16 w-full border-b border-gray-700 flex justify-center items-center px-6">
            <div className="flex items-center">
              <Zap className="w-8 h-8 text-purple-400 mr-2" />
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
                Zap<span className="text-purple-400">Zone</span>
              </motion.span>
            </div>
          </div>

          <nav className="mt-8 px-4 flex-1 space-y-6">
            {/* Overview Section */}
            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Overview</h3>
              {overviewNavigation.map((item) => {
                const isActive = isActiveSection(item.href)
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center px-4 py-3 mb-2 rounded-lg transition-all duration-200 ${
                      isActive
                        ? "bg-purple-400/10 text-purple-400 border border-purple-400/20"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    }`}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.name}
                    {isActive && (
                      <motion.div layoutId="activeTab" className="ml-auto w-2 h-2 bg-purple-400 rounded-full" />
                    )}
                  </Link>
                )
              })}
            </div>

            {/* Station Management Section */}
            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Station Management</h3>
              {stationNavigation.map((item) => {
                const isActive = isActiveSection(item.href)
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center px-4 py-3 mb-2 rounded-lg transition-all duration-200 ${
                      isActive
                        ? "bg-purple-400/10 text-purple-400 border border-purple-400/20"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    }`}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.name}
                    {isActive && (
                      <motion.div layoutId="activeTab" className="ml-auto w-2 h-2 bg-purple-400 rounded-full" />
                    )}
                  </Link>
                )
              })}
            </div>

            {/* User Management Section */}
            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">User Management</h3>
              {userNavigation.map((item) => {
                const isActive = isActiveSection(item.href)
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center px-4 py-3 mb-2 rounded-lg transition-all duration-200 ${
                      isActive
                        ? "bg-purple-400/10 text-purple-400 border border-purple-400/20"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    }`}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.name}
                    {isActive && (
                      <motion.div layoutId="activeTab" className="ml-auto w-2 h-2 bg-purple-400 rounded-full" />
                    )}
                  </Link>
                )
              })}
            </div>

            {/* Reports Section */}
            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Analytics</h3>
              {reportsNavigation.map((item) => {
                const isActive = isActiveSection(item.href)
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center px-4 py-3 mb-2 rounded-lg transition-all duration-200 ${
                      isActive
                        ? "bg-purple-400/10 text-purple-400 border border-purple-400/20"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    }`}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.name}
                    {isActive && (
                      <motion.div layoutId="activeTab" className="ml-auto w-2 h-2 bg-purple-400 rounded-full" />
                    )}
                  </Link>
                )
              })}
            </div>
          </nav>

          {/* Logout */}
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
            className="fixed inset-y-0 left-0 z-50 w-64 border-r lg:hidden bg-gradient-to-br from-gray-800 to-gray-900 backdrop-blur-md border border-gray-700 shadow-md"
          >
            <div className="flex items-center justify-between h-16 px-6 border-b border-gray-700">
              <div className="flex items-center">
                <Zap className="w-8 h-8 text-purple-400 mr-2" />
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
                  Zap<span className="text-purple-400">Zone</span>
                </motion.span>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="mt-8 px-4 flex-1 space-y-6">
              {/* Overview Section */}
              <div>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Overview</h3>
                {overviewNavigation.map((item) => {
                  const isActive = isActiveSection(item.href)
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex items-center px-4 py-3 mb-2 rounded-lg transition-all duration-200 ${
                        isActive
                          ? "bg-purple-400/10 text-purple-400 border border-purple-400/20"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white"
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon className="w-5 h-5 mr-3" />
                      {item.name}
                      {isActive && (
                        <motion.div layoutId="activeTab" className="ml-auto w-2 h-2 bg-purple-400 rounded-full" />
                      )}
                    </Link>
                  )
                })}
              </div>

              {/* Station Management Section */}
              <div>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  Station Management
                </h3>
                {stationNavigation.map((item) => {
                  const isActive = isActiveSection(item.href)
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex items-center px-4 py-3 mb-2 rounded-lg transition-all duration-200 ${
                        isActive
                          ? "bg-purple-400/10 text-purple-400 border border-purple-400/20"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white"
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon className="w-5 h-5 mr-3" />
                      {item.name}
                      {isActive && (
                        <motion.div layoutId="activeTab" className="ml-auto w-2 h-2 bg-purple-400 rounded-full" />
                      )}
                    </Link>
                  )
                })}
              </div>

              {/* User Management Section */}
              <div>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">User Management</h3>
                {userNavigation.map((item) => {
                  const isActive = isActiveSection(item.href)
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex items-center px-4 py-3 mb-2 rounded-lg transition-all duration-200 ${
                        isActive
                          ? "bg-purple-400/10 text-purple-400 border border-purple-400/20"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white"
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon className="w-5 h-5 mr-3" />
                      {item.name}
                      {isActive && (
                        <motion.div layoutId="activeTab" className="ml-auto w-2 h-2 bg-purple-400 rounded-full" />
                      )}
                    </Link>
                  )
                })}
              </div>

              {/* Reports Section */}
              <div>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Analytics</h3>
                {reportsNavigation.map((item) => {
                  const isActive = isActiveSection(item.href)
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex items-center px-4 py-3 mb-2 rounded-lg transition-all duration-200 ${
                        isActive
                          ? "bg-purple-400/10 text-purple-400 border border-purple-400/20"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white"
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon className="w-5 h-5 mr-3" />
                      {item.name}
                      {isActive && (
                        <motion.div layoutId="activeTab" className="ml-auto w-2 h-2 bg-purple-400 rounded-full" />
                      )}
                    </Link>
                  )
                })}
              </div>
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
        <header className="border-b h-16 flex items-center justify-between px-6 bg-gradient-to-br from-gray-800 to-gray-900 backdrop-blur-lg border border-gray-700 p-6 shadow-md">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-400 hover:text-white">
            <Menu className="w-6 h-6" />
          </button>

          {/* User info - always on the right */}
          <div className="flex items-center space-x-4">
            <div className="text-white text-right">
              <span className="text-sm text-gray-400">System Administrator</span>
              <span className="ml-1 font-medium block">Admin Dashboard</span>
            </div>
            <div className="w-8 h-8 bg-purple-400 rounded-full flex items-center justify-center">
              <Shield className="w-4 h-4 text-gray-900" />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 backdrop-blur-lg bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-sm border border-gray-700">
            <h2 className="text-white text-lg font-semibold mb-4">Confirm Logout</h2>
            <p className="text-gray-300 mb-6">Are you sure you want to logout?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 rounded bg-gray-700 text-gray-300 hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}  
    </div>
  )
}

export default AdminLayout
