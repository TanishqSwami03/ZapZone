"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Eye, EyeOff, ArrowLeft, Zap, Building2, Mail, Lock } from "lucide-react"
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { auth, db } from "../../firebase/firebaseConfig"
import ConfirmModal from "../modals/ConfirmModal"

const CompanyLogin = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({ email: "", password: "" })

  const [modalOpen, setModalOpen] = useState(false)
  const [modalData, setModalData] = useState({
    title: "",
    message: "",
    type: "error",
    confirmColor: "red",
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const openModal = ({ title, message, type = "error", confirmColor = "red" }) => {
    setModalData({ title, message, type, confirmColor })
    setModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const companyCred = await signInWithEmailAndPassword(auth, formData.email, formData.password)
      const uid = companyCred.user.uid

      const companyDoc = await getDoc(doc(db, "companies", uid))
      const companyData = companyDoc.data()

      if (!companyDoc.exists() || companyData.status !== "active") {
        openModal({
          title: "Account Inactive",
          message: "Your account is not active. Please contact support.",
          type: "warning",
          confirmColor: "yellow",
        })
        return
      }

      localStorage.setItem("company", JSON.stringify(companyData))
      console.log("Company Logged in !!")
      navigate("/company/")
    } catch (error) {
      openModal({
        title: "Login Failed",
        message: "Something went wrong. Please try again.",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/login" className="inline-flex items-center text-gray-400 hover:text-white mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Selection
          </Link>
          <div className="flex items-center justify-center mb-4">
            <Zap className="w-8 h-8 text-blue-400 mr-2" />
            <span className="text-white font-bold text-xl">EV Recharge Platform</span>
          </div>
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-blue-400/10 rounded-lg flex items-center justify-center mr-3">
              <Building2 className="w-6 h-6 text-blue-400" />
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-bold text-white">Company Login</h1>
              <p className="text-gray-400 text-sm">Access your business dashboard</p>
            </div>
          </div>
        </div>

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-800 rounded-xl p-6 border border-gray-700"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Company Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  placeholder="Enter company email"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-12 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center text-gray-300">
                <input
                  type="checkbox"
                  className="mr-2 rounded border-gray-600 bg-gray-700 text-blue-400 focus:ring-blue-400"
                />
                Remember me
              </label>
              <Link to="/forgot-password" className="text-blue-400 hover:text-blue-300">
                Forgot password?
              </Link>
            </div>

            {/* Login Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-gradient-to-r from-blue-400 to-blue-500 text-white py-3 rounded-lg font-semibold hover:from-blue-500 hover:to-blue-600 transition-all duration-300"
            >
              Sign In
            </motion.button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-800 text-gray-400">Or continue with</span>
              </div>
            </div>

            {/* Google Login */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              className="w-full bg-white text-gray-900 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </motion.button>
          </form>
        </motion.div>

        {/* Register Link */}
        <div className="text-center mt-6">
          <p className="text-gray-400">
            Don't have an account?{" "}
            <Link to="/register/company" className="text-blue-400 hover:text-blue-300 font-medium">
              Sign up as Company
            </Link>
          </p>
        </div>
      </div>
      <ConfirmModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={() => setModalOpen(false)}
        title={modalData.title}
        message={modalData.message}
        type={modalData.type}
        confirmColor={modalData.confirmColor}
        confirmText="Okay"
      />
    </div>
  )
}

export default CompanyLogin
