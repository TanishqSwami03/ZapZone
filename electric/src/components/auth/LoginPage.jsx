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
    { value: "admin", label: "Admin", icon: Shield, description: "Platform administration" },
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
          <div className="grid grid-cols-3 gap-2">
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

        {/* Login Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
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
