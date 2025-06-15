"use client"

import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { User, Building2, ArrowLeft, Zap } from "lucide-react"

const LoginTypeSelection = () => {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center text-gray-400 hover:text-white mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <div className="flex items-center justify-center mb-4">
            <Zap className="w-8 h-8 text-green-400 mr-2" />
            <span className="text-white font-bold text-xl">EV Recharge Platform</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-gray-400">Select your account type to continue</p>
        </div>

        {/* Type Selection Cards */}
        <div className="space-y-4">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              to="/login/user"
              className="block w-full p-6 bg-gray-800 border border-gray-700 rounded-xl hover:border-green-400 hover:bg-gray-750 transition-all duration-300 group"
            >
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-400/10 rounded-lg flex items-center justify-center mr-4 group-hover:bg-green-400/20 transition-colors">
                  <User className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Individual User</h3>
                  <p className="text-gray-400 text-sm">Find and book charging stations</p>
                </div>
              </div>
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              to="/login/company"
              className="block w-full p-6 bg-gray-800 border border-gray-700 rounded-xl hover:border-blue-400 hover:bg-gray-750 transition-all duration-300 group"
            >
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-400/10 rounded-lg flex items-center justify-center mr-4 group-hover:bg-blue-400/20 transition-colors">
                  <Building2 className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Company</h3>
                  <p className="text-gray-400 text-sm">Manage charging stations and bookings</p>
                </div>
              </div>
            </Link>
          </motion.div>
        </div>

        {/* Register Link */}
        <div className="text-center mt-8">
          <p className="text-gray-400">
            Don't have an account?{" "}
            <Link to="/register" className="text-green-400 hover:text-green-300 font-medium">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginTypeSelection
