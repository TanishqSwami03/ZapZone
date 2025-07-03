"use client"

import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search,
  History,
  User,
  Menu,
  X,
  Zap,
  LogOut,
  Wallet,
  Plus,
} from "lucide-react"
import AddFundsModal from "../modals/AddFundsModal"
import { signOut, onAuthStateChanged } from "firebase/auth"
import { auth, db } from "../../firebase/firebaseConfig"
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
} from "firebase/firestore"

const UserLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showAddFunds, setShowAddFunds] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const [userData, setUserData] = useState(null)

  const navigation = [
    { name: "Browse Stations", href: "/user/browse", icon: Search },
    { name: "Booking History", href: "/user/history", icon: History },
    { name: "Profile", href: "/user/profile", icon: User },
  ]

  const handleLogout = async () => {
    try {
      await signOut(auth)
      navigate("/")
    } catch (err) {
      console.error("Logout failed", err)
    }
  }

  useEffect(() => {
    let unsubscribeUser = null

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        console.log("User not logged in")
        return
      }

      const q = query(collection(db, "users"), where("uid", "==", user.uid))

      unsubscribeUser = onSnapshot(
        q,
        (querySnapshot) => {
          if (!querySnapshot.empty) {
            const userDocData = querySnapshot.docs[0].data()
            setUserData(userDocData)
          } else {
            console.warn("⚠️ No matching user found in Firestore")
          }
        },
        (err) => {
          console.error("❌ Firestore listener error:", err)
        }
      )
    })

    return () => {
      if (unsubscribeUser) unsubscribeUser()
      unsubscribeAuth()
    }
  }, [])

  return (
    <div className="min-h-screen w-full relative bg-black">
      {/* Radial Glow Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 50% 0%, rgba(34, 197, 94, 0.25), transparent 70%),
            radial-gradient(circle at 1px 1px, rgba(139, 92, 246, 0.2) 1px, transparent 0),
            radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.18) 1px, transparent 0),
            radial-gradient(circle at 1px 1px, rgba(236, 72, 153, 0.15) 1px, transparent 0),
            #000000
          `,
          backgroundSize: `
            100% 100%,
            20px 20px,
            30px 30px,
            25px 25px,
            auto
          `,
          backgroundPosition: `
            center,
            0 0,
            10px 10px,
            15px 5px,
            center
          `,
        }}
      />

      {/* Foreground Content */}
      <div className="relative z-10 flex min-h-screen bg-transparent">
        {/* Mobile backdrop */}
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

        {/* Sidebar */}
        <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
          <div className="flex flex-col flex-grow border-r backdrop-blur-sm border border-gray-800 shadow-md">
            {/* Logo */}
            <div className="flex items-center h-16 px-6 border-b border-gray-700">
              <Zap className="w-8 h-8 text-green-400 mr-2" />
              <motion.span
                style={{ fontFamily: "'Monoton', sans-serif" }}
                className="text-white text-2xl tracking-wide uppercase"
                animate={{ x: [0, -2, 2, -1, 1, 0], skewX: [0, 5, -5, 3, -3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                Zap<span className="text-green-400">Zone</span>
              </motion.span>
            </div>

            {/* Navigation */}
            <nav className="mt-8 px-4">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Overview
              </h3>
              {navigation.map((item) => {
                const isActive = location.pathname === item.href
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center px-4 py-3 mb-2 rounded-lg ${
                      isActive
                        ? "bg-green-400/10 text-green-400 border border-green-400/20"
                        : "text-gray-300 hover:border hover:border-gray-500 hover:text-white"
                    }`}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.name}
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="ml-auto w-2 h-2 bg-green-400 rounded-full"
                      />
                    )}
                  </Link>
                )
              })}
            </nav>

            {/* Wallet Section */}
            <div className="px-6 py-3 border-t border-gray-700">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Wallet
              </h3>
              <div 
                className="flex items-center space-x-4 border border-gray-700 rounded-lg px-3 py-2"
                style={{
                  background: "radial-gradient(125% 125% at 100% 10%, #000000 10%, #072607 100%)",
                }}  
              >
                <Wallet className="w-5 h-5 text-green-400" />
                ₹ {userData?.wallet !== undefined ? userData.wallet.toFixed(2) : "Can't Load"}
                <button
                  onClick={() => setShowAddFunds(true)}
                  className="bg-green-400 text-gray-900 p-1 rounded hover:bg-green-300 transition-colors ml-auto"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Logout Button */}
            <div className="absolute bottom-4 left-4 right-4 border-t border-gray-700 pt-4">
              <button
                onClick={() => setShowLogoutModal(true)}
                className="flex items-center w-full px-4 py-3 text-gray-300 hover:bg-red-600 hover:text-white rounded-lg transition-all duration-200"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed inset-y-0 left-0 z-50 w-64 border-r lg:hidden bg-gradient-to-br backdrop-blur-2xl border border-gray-700 shadow-md"
            >
              <div className="flex items-center justify-between h-16 px-6 border-b border-gray-700">
                <div className="flex items-center">
                  <Zap className="w-8 h-8 text-green-400 mr-2" />
                  <motion.span
                    style={{ fontFamily: "'Monoton', sans-serif" }}
                    className="text-white text-xl tracking-wide uppercase"
                    animate={{ x: [0, -2, 2, -1, 1, 0], skewX: [0, 5, -5, 3, -3, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    Zap<span className="text-green-400">Zone</span>
                  </motion.span>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="text-gray-400 hover:text-white"
                >
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
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center px-4 py-3 mb-2 rounded-lg transition-all duration-200 ${
                        isActive
                          ? "bg-green-400/10 text-green-400 border border-green-400/20"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white"
                      }`}
                    >
                      <item.icon className="w-5 h-5 mr-3" />
                      {item.name}
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className="ml-auto w-2 h-2 bg-green-400 rounded-full"
                        />
                      )}
                    </Link>
                  )
                })}
              </nav>

              <div className="px-6 py-3 border-t border-gray-700">
                <div 
                  className="flex items-center space-x-4 border border-gray-700 rounded-lg px-3 py-2"
                  style={{
                    background: "radial-gradient(125% 125% at 100% 10%, #000000 10%, #072607 100%)",
                  }}  
                >
                  <Wallet className="w-5 h-5 text-green-400" />
                  <span className="text-white font-medium">
                    ₹ {userData?.wallet !== undefined ? userData.wallet.toFixed(2) : "Can't Load"}
                  </span>
                  <button
                    onClick={() => setShowAddFunds(true)}
                    className="bg-green-400 text-gray-900 p-1 rounded hover:bg-green-300 transition-colors ml-auto"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="absolute bottom-4 left-4 right-4 border-t border-gray-700 pt-4">
                <button
                  onClick={() => setShowLogoutModal(true)}
                  className="flex items-center w-full px-4 py-3 text-gray-300 hover:bg-red-600 hover:text-white rounded-lg transition-all duration-200"
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  Logout
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="flex-1 lg:pl-64">
          <header className="border-b h-16 flex items-center justify-between px-6 bg-gradient-to-br backdrop-blur-lg border border-gray-700 shadow-md">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="lg:hidden" />
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-gray-900" />
              </div>
              <div className="text-white text-right">
                <span className="text-m text-gray-400">Welcome back, </span>
                <span className="font-medium">{userData?.name || "Loading..."}</span>
              </div>
            </div>
          </header>
          <main className="p-6">{children}</main>
        </div>

        {/* Add Funds Modal */}
        <AddFundsModal isOpen={showAddFunds} onClose={() => setShowAddFunds(false)} />

        {/* Logout Confirm Modal */}
        {showLogoutModal && (
          <div 
            className="fixed inset-0 z-50 backdrop-blur-lg bg-opacity-50 flex items-center justify-center"
          >
            <div 
              className="rounded-lg p-6 w-full max-w-sm border border-gray-700"
              style={{
                background: "#000000",
                backgroundImage: `
                  radial-gradient(circle at 1px 1px, rgba(139, 92, 246, 0.2) 1px, transparent 0),
                  radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.18) 1px, transparent 0),
                  radial-gradient(circle at 1px 1px, rgba(236, 72, 153, 0.15) 1px, transparent 0)
                `,
                backgroundSize: "20px 20px, 30px 30px, 25px 25px",
                backgroundPosition: "0 0, 10px 10px, 15px 5px",
              }}
            >
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
    </div>
  )
}

export default UserLayout
