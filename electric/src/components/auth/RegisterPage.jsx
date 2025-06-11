"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Eye, EyeOff, Zap, ArrowLeft, User, Building2 } from "lucide-react"
import { useUser } from "../../context/UserContext"

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    userType: "user",
    companyName: "",
    agreeToTerms: false,
  })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { register } = useUser()

  const userTypes = [
    { value: "user", label: "Individual User", icon: User, description: "Browse and book charging stations" },
    { value: "company", label: "Company", icon: Building2, description: "Manage charging stations and fleet" },
  ]

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name) newErrors.name = "Name is required"
    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format"
    }
    if (!formData.phone) newErrors.phone = "Phone number is required"
    if (formData.userType === "company" && !formData.companyName) {
      newErrors.companyName = "Company name is required"
    }
    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const userData = {
        name: formData.name,
        email: formData.email,
        type: formData.userType,
        companyName: formData.companyName,
      }

      register(userData)

      // Redirect based on user type
      switch (formData.userType) {
        case "user":
          navigate("/user")
          break
        case "company":
          navigate("/company")
          break
        default:
          navigate("/")
      }
    } catch (error) {
      setErrors({ submit: "Registration failed. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  const getPasswordStrength = () => {
    const password = formData.password
    let strength = 0
    if (password.length >= 8) strength++
    if (password.match(/[a-z]+/)) strength++
    if (password.match(/[A-Z]+/)) strength++
    if (password.match(/[0-9]+/)) strength++
    if (password.match(/[$@#&!]+/)) strength++
    return strength
  }

  const getPasswordStrengthLabel = () => {
    const strength = getPasswordStrength()
    switch (strength) {
      case 0:
      case 1:
        return { label: "Very Weak", color: "bg-red-500" }
      case 2:
        return { label: "Weak", color: "bg-red-400" }
      case 3:
        return { label: "Medium", color: "bg-yellow-500" }
      case 4:
        return { label: "Strong", color: "bg-green-500" }
      case 5:
        return { label: "Very Strong", color: "bg-green-600" }
      default:
        return { label: "", color: "bg-gray-500" }
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
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

          <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-gray-400">Join our platform and start your EV journey</p>
        </motion.div>

        {/* User Type Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <label className="block text-white font-medium mb-3">I am a:</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userTypes.map((type) => (
              <motion.button
                key={type.value}
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleInputChange("userType", type.value)}
                className={`p-4 rounded-lg border transition-all duration-200 text-left ${
                  formData.userType === type.value
                    ? "border-green-400 bg-green-400/10 text-green-400"
                    : "border-gray-600 bg-gray-800 text-gray-300 hover:border-gray-500"
                }`}
              >
                <div className="flex items-center mb-2">
                  <type.icon className="w-5 h-5 mr-2" />
                  <span className="font-medium">{type.label}</span>
                </div>
                <p className="text-sm opacity-75">{type.description}</p>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Registration Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* Name and Email Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name Field */}
            <div className="relative">
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className={`w-full px-4 py-3 bg-gray-800 border rounded-xl text-white placeholder-transparent focus:outline-none transition-all duration-300 peer ${
                  errors.name ? "border-red-400" : "border-gray-600 focus:border-green-400"
                }`}
                placeholder="Full name"
                id="name"
              />
              <label
                htmlFor="name"
                className={`absolute left-4 transition-all duration-300 pointer-events-none ${
                  formData.name
                    ? "-top-2 text-xs bg-gray-900 px-2 text-green-400"
                    : "top-3 text-gray-400 peer-focus:-top-2 peer-focus:text-xs peer-focus:bg-gray-900 peer-focus:px-2 peer-focus:text-green-400"
                }`}
              >
                {formData.userType === "company" ? "Contact Person" : "Full Name"}
              </label>
              <AnimatePresence>
                {errors.name && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-red-400 text-sm mt-1"
                  >
                    {errors.name}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

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
          </div>

          {/* Company Name Field (for companies) */}
          <AnimatePresence>
            {formData.userType === "company" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="relative"
              >
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange("companyName", e.target.value)}
                  className={`w-full px-4 py-3 bg-gray-800 border rounded-xl text-white placeholder-transparent focus:outline-none transition-all duration-300 peer ${
                    errors.companyName ? "border-red-400" : "border-gray-600 focus:border-green-400"
                  }`}
                  placeholder="Company name"
                  id="companyName"
                />
                <label
                  htmlFor="companyName"
                  className={`absolute left-4 transition-all duration-300 pointer-events-none ${
                    formData.companyName
                      ? "-top-2 text-xs bg-gray-900 px-2 text-green-400"
                      : "top-3 text-gray-400 peer-focus:-top-2 peer-focus:text-xs peer-focus:bg-gray-900 peer-focus:px-2 peer-focus:text-green-400"
                  }`}
                >
                  Company Name
                </label>
                <AnimatePresence>
                  {errors.companyName && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-red-400 text-sm mt-1"
                    >
                      {errors.companyName}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Phone and Password Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Phone Field */}
            <div className="relative">
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className={`w-full px-4 py-3 bg-gray-800 border rounded-xl text-white placeholder-transparent focus:outline-none transition-all duration-300 peer ${
                  errors.phone ? "border-red-400" : "border-gray-600 focus:border-green-400"
                }`}
                placeholder="Phone number"
                id="phone"
              />
              <label
                htmlFor="phone"
                className={`absolute left-4 transition-all duration-300 pointer-events-none ${
                  formData.phone
                    ? "-top-2 text-xs bg-gray-900 px-2 text-green-400"
                    : "top-3 text-gray-400 peer-focus:-top-2 peer-focus:text-xs peer-focus:bg-gray-900 peer-focus:px-2 peer-focus:text-green-400"
                }`}
              >
                Phone Number
              </label>
              <AnimatePresence>
                {errors.phone && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-red-400 text-sm mt-1"
                  >
                    {errors.phone}
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
          </div>

          {/* Password Strength Indicator */}
          {formData.password && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-2">
              <div className="flex items-center space-x-2">
                <div className="flex-1 bg-gray-700 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(getPasswordStrength() / 5) * 100}%` }}
                    className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthLabel().color}`}
                  />
                </div>
                <span
                  className={`text-xs font-medium ${
                    getPasswordStrength() <= 1
                      ? "text-red-400"
                      : getPasswordStrength() <= 3
                        ? "text-yellow-400"
                        : "text-green-400"
                  }`}
                >
                  {getPasswordStrengthLabel().label}
                </span>
              </div>
            </motion.div>
          )}

          {/* Confirm Password */}
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
              className={`w-full px-4 py-3 bg-gray-800 border rounded-xl text-white placeholder-transparent focus:outline-none transition-all duration-300 peer pr-12 ${
                errors.confirmPassword ? "border-red-400" : "border-gray-600 focus:border-green-400"
              }`}
              placeholder="Confirm password"
              id="confirmPassword"
            />
            <label
              htmlFor="confirmPassword"
              className={`absolute left-4 transition-all duration-300 pointer-events-none ${
                formData.confirmPassword
                  ? "-top-2 text-xs bg-gray-900 px-2 text-green-400"
                  : "top-3 text-gray-400 peer-focus:-top-2 peer-focus:text-xs peer-focus:bg-gray-900 peer-focus:px-2 peer-focus:text-green-400"
              }`}
            >
              Confirm Password
            </label>
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-3 text-gray-400 hover:text-white transition-colors"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
            <AnimatePresence>
              {errors.confirmPassword && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-red-400 text-sm mt-1"
                >
                  {errors.confirmPassword}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Terms and Conditions */}
          <div className="relative">
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.agreeToTerms}
                onChange={(e) => handleInputChange("agreeToTerms", e.target.checked)}
                className="w-5 h-5 text-green-400 bg-gray-800 border-gray-600 rounded focus:ring-green-400 focus:ring-2 mt-0.5"
              />
              <span className="text-gray-300 text-sm leading-relaxed">
                I agree to the{" "}
                <Link to="/terms" className="text-green-400 hover:text-green-300 transition-colors">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-green-400 hover:text-green-300 transition-colors">
                  Privacy Policy
                </Link>
              </span>
            </label>
            <AnimatePresence>
              {errors.agreeToTerms && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-red-400 text-sm mt-1"
                >
                  {errors.agreeToTerms}
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
              "Create Account"
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

        {/* Sign in link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-6"
        >
          <p className="text-gray-400">
            Already have an account?{" "}
            <Link to="/login" className="text-green-400 hover:text-green-300 transition-colors">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default RegisterPage
