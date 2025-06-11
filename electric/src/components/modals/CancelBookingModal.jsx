"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, AlertTriangle, Ban, CheckCircle2 } from "lucide-react"

const CancelBookingModal = ({ isOpen, onClose, onConfirm, booking }) => {
  const [isCancelled, setIsCancelled] = useState(false)

  // Reset cancel state on open/close
  useEffect(() => {
    if (!isOpen) {
      setIsCancelled(false)
    }
  }, [isOpen])

  const handleConfirm = () => {
    onConfirm()           // Calls parent's updateBooking
    setIsCancelled(true)  // Show cancelled confirmation UI
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-gray-800 rounded-xl p-6 w-full max-w-md border border-gray-700"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">
                {isCancelled ? "Booking Cancelled" : "Cancel Booking"}
              </h2>
              <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="text-center mb-6">
              {isCancelled ? (
                <>
                  <div className="w-16 h-16 bg-green-400/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-green-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-3">Your booking has been cancelled.</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    You can make a new booking anytime.
                  </p>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 bg-red-400/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="w-8 h-8 text-red-400" />
                  </div>

                  <h3 className="text-lg font-semibold text-white mb-3">Are you sure you want to cancel?</h3>

                  <div className="bg-gray-700 rounded-lg p-4 mb-4">
                    <p className="text-white font-medium mb-2">{booking?.stationName}</p>
                    <p className="text-gray-400 text-sm">
                      {booking?.chargerType} • {booking?.date} at {booking?.time}
                    </p>
                  </div>

                  <p className="text-gray-300 text-sm leading-relaxed">
                    Cancelling this booking may make it unavailable to you or others. This action cannot be undone.
                  </p>

                  {/* Confirmation Note */}
                  <div className="bg-red-400/10 border border-red-400/20 rounded-lg p-4 mb-6">
                    <div className="flex items-start">
                      <Ban className="w-5 h-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" />
                      <p className="text-red-400 font-medium">Do you want to cancel this booking?</p>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
              >
                {isCancelled ? "Close" : "Keep Booking"}
              </button>
              {!isCancelled && (
                <button
                  onClick={handleConfirm}
                  className="flex-1 px-4 py-3 bg-red-400 text-gray-900 rounded-lg hover:bg-red-300 transition-colors font-medium"
                >
                  Yes, Cancel
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default CancelBookingModal
