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
  const [loading, setLoading] = useState(false)

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
    <div 
      className="min-h-screen flex items-center justify-center px-4 py-8"
      style={{
        backgroundColor: "#000000",
        backgroundImage: `
          radial-gradient(circle, rgba(255, 255, 255, 0.08) 1.5px, transparent 1.5px),
          radial-gradient(125% 90% at 30% 85%, #000000 30%, #111b46 100%)
        `,
        backgroundSize: "30px 30px, cover",
        backgroundPosition: "0 0, center",
        backgroundRepeat: "repeat, no-repeat",
      }}
    >
      <div className="max-w-md w-full">
        {/* Header */}
        <motion.div 
          className="text-center mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link to="/register" className="inline-flex items-center text-gray-400 hover:text-white mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Selection
          </Link>
          <div className="flex items-center justify-center mb-3">
            <Zap className="w-6 h-6 text-green-400 mr-2" />
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
          <div className="flex items-center justify-center mb-3">
            <div className="w-10 h-10 bg-green-400/10 rounded-lg flex items-center justify-center mr-3">
              <User className="w-5 h-5 text-green-400" />
            </div>
            <div className="text-left">
              <h1 className="text-xl font-bold text-white">Create User Account</h1>
              <p className="text-gray-400 text-sm">Join as an individual user</p>
            </div>
          </div>
        </motion.div>

        {/* Registration Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-xl p-5 border border-gray-800"
        >
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-3">
              {/* First Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 backdrop-blur-sm border border-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent text-sm"
                  placeholder="First name"
                  required
                />
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 backdrop-blur-sm border border-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent text-sm"
                  placeholder="Last name"
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-400 z-1" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2.5 backdrop-blur-sm border border-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent text-sm"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Phone Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-400 z-1" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2.5 backdrop-blur-sm border border-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent text-sm"
                  placeholder="Enter phone number"
                  required
                />
              </div>
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-1 gap-3">
              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-400 z-1" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-9 pr-10 py-2.5 backdrop-blur-sm border border-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent text-sm"
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

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-400 z-1" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-9 pr-10 py-2.5 backdrop-blur-sm border border-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent text-sm"
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

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                {/* <span className="px-2 bg-gray-800 text-gray-400">Or continue with</span> */}
              </div>
            </div>

            {/* Register Button */}
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className={`w-full ${
                  loading ? "opacity-50 cursor-not-allowed" : "hover:text-white"
              } bg-gradient-to-r via-green-400 text-black py-2.5 rounded-lg font-semibold transition-all duration-300 text-lg`}
            >
              {loading ? "Registering..." : "Create User Account"}
            </motion.button>
          </form>
        </motion.div>

        {/* Login Link */}
        <motion.div 
          className="text-center mt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-gray-400 text-sm">
            Already have an account?{" "}
            <Link to="/login/user" className="text-green-400 hover:text-green-300 font-medium">
              Sign in here
            </Link>
          </p>
        </motion.div>
      </div>
      {modal.isOpen && <ConfirmModal {...modal} />}
    </div>
  )
}

export default UserRegister
