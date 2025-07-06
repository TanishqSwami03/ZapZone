"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, CheckCircle } from "lucide-react"

const ChargingStartedModal = ({ isOpen, onClose, booking }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="rounded-xl p-6 w-full max-w-md border border-gray-700"
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
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Charging Started!</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-20 h-20 bg-green-400/10 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <CheckCircle className="w-10 h-10 text-green-400" />
              </motion.div>

              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-lg font-semibold text-white mb-3"
              >
                Charging Session Started
              </motion.h3>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="backdrop-blur-sm border border-gray-700 rounded-lg p-4 mb-4"
              >
                <p className="text-white font-medium mb-1">{booking?.stationName}</p>
                <p className="text-gray-400 text-sm">{booking?.chargerType}</p>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-gray-300 text-sm mb-6"
              >
                Your charging session has started. You can monitor the progress and timer in your booking history.
              </motion.p>

              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                onClick={onClose}
                className="w-full px-4 py-3 bg-gradient-to-r via-green-400/40 text-white rounded-lg font-medium"
              >
                Continue
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default ChargingStartedModal
