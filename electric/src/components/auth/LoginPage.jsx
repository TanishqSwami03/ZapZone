"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Eye, EyeOff, Zap, ArrowLeft, User, Building2, Shield } from "lucide-react"
import { useUser } from "../../context/UserContext"

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    userType: "user",
  })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useUser()

  const userTypes = [
    { value: "user", label: "User", icon: User, description: "Browse and book charging stations" },
    { value: "company", label: "Company", icon: Building2, description: "Manage charging stations" },
    // { value: "admin", label: "Admin", icon: Shield, description: "Platform administration" },
  ]

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.email) newErrors.email = "Email is required"
    if (!formData.password) newErrors.password = "Password is required"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const userData = {
        name: "John Doe",
        email: formData.email,
        type: formData.userType,
      }

      login(userData)

      // Redirect based on user type
      switch (formData.userType) {
        case "user":
          navigate("/user")
          break
        case "company":
          navigate("/company")
          break
        case "admin":
          navigate("/admin")
          break
        default:
          navigate("/")
      }
    } catch (error) {
      setErrors({ submit: "Invalid credentials" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    try {
      // Simulate Google OAuth
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const userData = {
        name: "Google User",
        email: "user@gmail.com",
        type: formData.userType,
      }

      login(userData)

      // Redirect based on user type
      switch (formData.userType) {
        case "user":
          navigate("/user")
          break
        case "company":
          navigate("/company")
          break
        case "admin":
          navigate("/admin")
          break
        default:
          navigate("/")
      }
    } catch (error) {
      setErrors({ submit: "Google login failed" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <Link to="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center text-gray-400 hover:text-white transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </motion.button>
          </Link>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6"
          >
            <Zap className="w-8 h-8 text-white" />
          </motion.div>

          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-gray-400">Sign in to your account</p>
        </motion.div>

        {/* User Type Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <label className="block text-white font-medium mb-3">I am a:</label>
          <div className="grid grid-cols-2 gap-2">
            {userTypes.map((type) => (
              <motion.button
                key={type.value}
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleInputChange("userType", type.value)}
                className={`p-3 rounded-lg border transition-all duration-200 ${
                  formData.userType === type.value
                    ? "border-green-400 bg-green-400/10 text-green-400"
                    : "border-gray-600 bg-gray-800 text-gray-300 hover:border-gray-500"
                }`}
              >
                <type.icon className="w-5 h-5 mx-auto mb-1" />
                <div className="text-xs font-medium">{type.label}</div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Google Login Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full mb-6 flex items-center justify-center px-4 py-3 bg-white text-gray-900 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
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

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-900 text-gray-400">Or continue with email</span>
          </div>
        </div>

        {/* Login Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* Email Field */}
          <div className="relative">
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className={`w-full px-4 py-3 bg-gray-800 border rounded-xl text-white placeholder-transparent focus:outline-none transition-all duration-300 peer ${
                errors.email ? "border-red-400" : "border-gray-600 focus:border-green-400"
              }`}
              placeholder="Email address"
              id="email"
            />
            <label
              htmlFor="email"
              className={`absolute left-4 transition-all duration-300 pointer-events-none ${
                formData.email
                  ? "-top-2 text-xs bg-gray-900 px-2 text-green-400"
                  : "top-3 text-gray-400 peer-focus:-top-2 peer-focus:text-xs peer-focus:bg-gray-900 peer-focus:px-2 peer-focus:text-green-400"
              }`}
            >
              Email Address
            </label>
            <AnimatePresence>
              {errors.email && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-red-400 text-sm mt-1"
                >
                  {errors.email}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Password Field */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              className={`w-full px-4 py-3 bg-gray-800 border rounded-xl text-white placeholder-transparent focus:outline-none transition-all duration-300 peer pr-12 ${
                errors.password ? "border-red-400" : "border-gray-600 focus:border-green-400"
              }`}
              placeholder="Password"
              id="password"
            />
            <label
              htmlFor="password"
              className={`absolute left-4 transition-all duration-300 pointer-events-none ${
                formData.password
                  ? "-top-2 text-xs bg-gray-900 px-2 text-green-400"
                  : "top-3 text-gray-400 peer-focus:-top-2 peer-focus:text-xs peer-focus:bg-gray-900 peer-focus:px-2 peer-focus:text-green-400"
              }`}
            >
              Password
            </label>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-3 text-gray-400 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
            <AnimatePresence>
              {errors.password && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-red-400 text-sm mt-1"
                >
                  {errors.password}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
            className="w-full py-3 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-green-400/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mx-auto"
              />
            ) : (
              "Sign In"
            )}
          </motion.button>

          {/* Error Message */}
          <AnimatePresence>
            {errors.submit && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-red-400 text-sm text-center"
              >
                {errors.submit}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.form>

        {/* Sign up link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-6"
        >
          <p className="text-gray-400">
            Don't have an account?{" "}
            <Link to="/register" className="text-green-400 hover:text-green-300 transition-colors">
              Sign up
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default LoginPage
