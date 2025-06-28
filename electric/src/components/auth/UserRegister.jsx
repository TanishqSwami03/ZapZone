"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Eye, EyeOff, ArrowLeft, Zap, User, Mail, Lock, Phone } from "lucide-react"
import { auth, db } from "../../firebase/firebaseConfig"
import { createUserWithEmailAndPassword } from "firebase/auth"
import {
  doc,
  setDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore"
import ConfirmModal from "../modals/ConfirmModal"

const UserRegister = () => {
  const navigate = useNavigate()

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })

  const [modal, setModal] = useState({ isOpen: false })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      return setModal({
        isOpen: true,
        type: "error",
        title: "Password Mismatch",
        message: "Passwords do not match.",
        onConfirm: () => setModal(prev => ({ ...prev, isOpen: false }))
        
      })
    }

    if (!/^\d{10}$/.test(formData.phone)) {
      return setModal({
        isOpen: true,
        type: "error",
        title: "Invalid Phone Number",
        message: "Phone number must be 10 digits.",
        onConfirm: () => setModal(prev => ({ ...prev, isOpen: false }))
      })
    }

    setLoading(true);
    try {
      const usersRef = collection(db, "users")
      const q = query(usersRef, where("phone", "==", formData.phone))
      const snap = await getDocs(q)

      if (!snap.empty) {
        return setModal({
          isOpen: true,
          type: "error",
          title: "Phone Exists",
          message: "This phone number is already registered.",
          onConfirm: () => setModal(prev => ({ ...prev, isOpen: false }))
        })
      }

      const userCred = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      )
      console.log("User created:", userCred)

      const uid = userCred.user.uid
      const now = new Date().toString()

      await setDoc(doc(db, "users", uid), {
        uid,
        name: formData.firstName + " " + formData.lastName,
        email: formData.email.toLowerCase(),
        phone: formData.phone.trim(),
        joinDate: now,
        // lastActive: now,
        status: "active",
        wallet: 0,
        bookings: 0,
        chargingHours: 0,
        expenditure: 0,
      })
      console.log("User doc written")

      setModal({
        isOpen: true,
        type: "success",
        title: "User Registered",
        message: "Your user account has been created successfully.",
        onConfirm: () => {
          setModal(prev => ({ ...prev, isOpen: false }))
          navigate("/login/user")
        },
        confirmColor:"green",
      })
    } catch (error) {
        console.error("Registration error:", error)
        let title = "Error"
        let message = "Something went wrong."

        if (error.code === "auth/email-already-in-use") {
            title = "Email In Use"
            message = "This email is already registered."
        } else if (error.code === "auth/weak-password") {
            title = "Weak Password"
            message = "Password should be at least 6 characters."
        }

        setModal({
            isOpen: true,
            type: "error",
            title,
            message,
            onConfirm: () => setModal(prev => ({ ...prev, isOpen: false }))
        })
        setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-6">
          <Link to="/register" className="inline-flex items-center text-gray-400 hover:text-white mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Selection
          </Link>
          <div className="flex items-center justify-center mb-3">
            <Zap className="w-6 h-6 text-green-400 mr-2" />
            <span className="text-white font-bold text-lg">EV Recharge Platform</span>
          </div>
          <div className="flex items-center justify-center mb-3">
            <div className="w-10 h-10 bg-green-400/10 rounded-lg flex items-center justify-center mr-3">
              <User className="w-5 h-5 text-green-400" />
            </div>
            <div className="text-left">
              <h1 className="text-xl font-bold text-white">Create User Account</h1>
              <p className="text-gray-400 text-sm">Join as an individual user</p>
            </div>
          </div>
        </div>

        {/* Registration Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-800 rounded-xl p-5 border border-gray-700"
        >
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent text-sm"
                  placeholder="First name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent text-sm"
                  placeholder="Last name"
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent text-sm"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Phone Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent text-sm"
                  placeholder="Enter phone number"
                  required
                />
              </div>
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-9 pr-10 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent text-sm"
                    placeholder="Create password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-9 pr-10 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent text-sm"
                    placeholder="Confirm password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Terms Checkbox */}
            {/* <div className="flex items-start">
              <input
                type="checkbox"
                className="mt-1 mr-2 rounded border-gray-600 bg-gray-700 text-green-400 focus:ring-green-400"
                required
              />
              <label className="text-sm text-gray-300">
                I agree to the{" "}
                <Link to="/terms" className="text-green-400 hover:text-green-300">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-green-400 hover:text-green-300">
                  Privacy Policy
                </Link>
              </label>
            </div> */}

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                {/* <span className="px-2 bg-gray-800 text-gray-400">Or continue with</span> */}
              </div>
            </div>

            {/* Register Button */}
            <motion.button
            disabled={loading}
            className={`w-full ${
                loading ? "opacity-50 cursor-not-allowed" : "hover:from-green-500 hover:to-green-600"
            } bg-gradient-to-r from-green-400 to-green-500 text-white py-2.5 rounded-lg font-semibold transition-all duration-300 text-sm`}
            >
            {loading ? "Registering..." : "Create Account"}
            </motion.button>

            {/* Divider */}
            {/* <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-800 text-gray-400">Or continue with</span>
              </div>
            </div> */}

            {/* Google Register */}
            {/* <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              className="w-full bg-white text-gray-900 py-2.5 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center text-sm"
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
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
            </motion.button> */}
          </form>
        </motion.div>

        {/* Login Link */}
        <div className="text-center mt-4">
          <p className="text-gray-400 text-sm">
            Already have an account?{" "}
            <Link to="/login/user" className="text-green-400 hover:text-green-300 font-medium">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
      {modal.isOpen && <ConfirmModal {...modal} />}
    </div>
  )
}

export default UserRegister
