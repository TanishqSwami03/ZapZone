"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, Zap, AlertTriangle } from "lucide-react"

const ChargingConfirmModal = ({ isOpen, onClose, onConfirm, booking }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="charging-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/50"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-gray-800 rounded-xl p-6 w-full max-w-md border border-gray-700"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Confirm Charging</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-yellow-400/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-yellow-400" />
              </div>

              <h3 className="text-lg font-semibold text-white mb-3">Ready to Start Charging?</h3>

              <div className="bg-gray-700 rounded-lg p-4 mb-4">
                <p className="text-white font-medium mb-2">{booking?.stationName}</p>
                <p className="text-gray-400 text-sm">
                  {booking?.chargerType} • {booking?.date} at {booking?.time}
                </p>
              </div>

              <p className="text-gray-300 text-sm leading-relaxed">
                Please confirm that you are at the charging station and your vehicle is properly connected before
                starting the charging session.
              </p>
            </div>

            {/* Confirmation */}
            <div className="bg-yellow-400/10 border border-yellow-400/20 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <Zap className="w-5 h-5 text-yellow-400 mt-0.5 mr-3 flex-shrink-0" />
                <p className="text-yellow-400 font-medium">Are you at the charger and connected with your vehicle?</p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Not Yet
              </button>
              <button
                onClick={onConfirm}
                className="flex-1 px-4 py-3 bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-300 transition-colors font-medium"
              >
                Yes, Start Charging
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ChargingConfirmModal
