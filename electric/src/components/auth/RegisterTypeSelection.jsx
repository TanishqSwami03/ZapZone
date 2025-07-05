"use client"

import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { User, Building2, ArrowLeft, Zap } from "lucide-react"

const RegisterTypeSelection = () => {
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
          <Link to="/" className="inline-flex items-center text-gray-400 hover:text-white mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
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
          <h1 className="text-2xl font-bold text-white mb-2">Join Our Platform</h1>
          <p className="text-gray-400">Select your account type to get started</p>
        </motion.div>

        {/* Type Selection Cards */}
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              to="/register/user"
              className="hover-radial-bg-green block border border-gray-800 w-full p-6 rounded-xl hover:border-green-400 hover:bg-gray-750 transition-all duration-300 group"
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
              to="/register/company"
              className="hover-radial-bg-blue block w-full p-6 border border-gray-800 rounded-xl hover:border-blue-400 hover:bg-gray-750 transition-all duration-300 group"
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
        </motion.div>

        {/* Login Link */}
        <motion.div 
          className="text-center mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-gray-400">
            Already have an account?{" "}
            <Link to="/login" className="text-green-400 hover:text-green-300 font-medium">
              Sign in here
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default RegisterTypeSelection
