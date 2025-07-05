"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Eye, EyeOff, ArrowLeft, Zap, User, Mail, Lock } from "lucide-react"
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { auth, db } from "../../firebase/firebaseConfig"
import ConfirmModal from "../modals/ConfirmModal"

const UserLogin = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [loading, setLoading] = useState(false)
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

    setLoading(true);
    try {
      const userCred = await signInWithEmailAndPassword(auth, formData.email, formData.password)
      const uid = userCred.user.uid

      const userDoc = await getDoc(doc(db, "users", uid))
      const userData = userDoc.data()

      if (!userDoc.exists() || userData.status !== "active") {
        openModal({
          title: "Account Inactive",
          message: "Your account is not active. Please contact support.",
          type: "warning",
          confirmColor: "yellow",
        })
        return
      }

      localStorage.setItem("user", JSON.stringify(userData))
      navigate("/user/")

    } catch (error) {
      openModal({
        title: "Login Failed",
        message: "Something went wrong. Please try again.",
      })
      setLoading(true);
    }
  }

  // const handleGoogleLogin = async () => {
  //   try {
  //     const provider = new GoogleAuthProvider()
  //     const result = await signInWithPopup(auth, provider)
  //     const uid = result.user.uid

  //     const userDoc = await getDoc(doc(db, "users", uid))
  //     const userData = userDoc.data()

  //     if (!userDoc.exists() || userData.status !== "active") {
  //       openModal({
  //         title: "Account Inactive",
  //         message: "Your Google account exists but is not active.",
  //         type: "warning",
  //         confirmColor: "yellow",
  //       })
  //       return
  //     }

  //     localStorage.setItem("user", JSON.stringify(userData))
  //     navigate("/dashboard/user")
  //   } catch (error) {
  //     openModal({
  //       title: "Google Login Failed",
  //       message: error.message || "Could not log in with Google.",
  //     })
  //   }
  // }

  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4"
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
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link to="/login" className="inline-flex items-center text-gray-400 hover:text-white mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Selection
          </Link>
          <div className="flex items-center justify-center mb-4">
            <Zap className="w-8 h-8 text-green-400 mr-2" />
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
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-green-400/10 rounded-lg flex items-center justify-center mr-3">
              <User className="w-6 h-6 text-green-400" />
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-bold text-white">User Login</h1>
              <p className="text-gray-400 text-sm">Access your charging dashboard</p>
            </div>
          </div>
        </motion.div>

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-xl p-6 border border-gray-800"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-400 z-1" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 backdrop-blur-sm border border-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-400 z-1" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-12 py-3 backdrop-blur-sm border border-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
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

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                {/* <span className="px-2 bg-gray-800 text-gray-400">Or continue with</span> */}
              </div>
            </div>

            {/* Login Button */}
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              type="submit"
              className={`w-full ${
                  loading ? "opacity-50 cursor-not-allowed" : "hover:text-white"
                } bg-gradient-to-r from-black via-green-400 to-black text-black hover:text-white text-lg opacity-70 hover:opacity-100 py-3 rounded-lg font-semibold`
              }
            >
              {loading ? "Signing in.." : "Sign in"}
            </motion.button>
          </form>
        </motion.div>

        {/* Register Link */}
        <motion.div 
          className="text-center mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-gray-400">
            Don't have an account?{" "}
            <Link to="/register/user" className="text-green-400 hover:text-green-300 font-medium">
              Sign up as User
            </Link>
          </p>
        </motion.div>
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

export default UserLogin
    