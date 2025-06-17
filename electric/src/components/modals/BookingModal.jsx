"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Calendar, Clock, Zap, DollarSign, MapPin, CheckCircle, IndianRupee } from "lucide-react"
import { useUser } from "../../context/UserContext"

const BookingModal = ({ isOpen, onClose, station }) => {
  const { addBooking, walletBalance } = useUser()
  const [showInsufficientFunds, setShowInsufficientFunds] = useState(false)

  const [duration, setDuration] = useState(30)
  const [showConfirmation, setShowConfirmation] = useState(false)

  const durationOptions = [15, 30, 45, 60, 90, 120]

  const calculateCost = () => {
    if (!station) return 0
    const pricePerMinute = station.pricePerMinute || 0
    return pricePerMinute * duration
  }

  const handleBooking = () => {
    const cost = calculateCost()

    if (walletBalance < cost) {
      setShowInsufficientFunds(true)
      return
    }
    const now = new Date().toString()
    const onlyDate = now.split(' ').slice(0, 4).join(' ');
    const onlyTime = now.split(' ')[4];

    const booking = {
      stationId: station.id,
      stationName: station.name,
      date: onlyDate,
      time: onlyTime,
      duration,
      cost,
    }

    addBooking(booking)
    setShowConfirmation(true)

    setTimeout(() => {
      setShowConfirmation(false)
      resetForm()
      onClose()
    }, 2000)
  }


  const resetForm = () => {
    setDuration(30)
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  if (!station) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-gray-800 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-700"
          >
            <AnimatePresence>
  {showInsufficientFunds && (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 rounded-xl"
    >
      <div className="bg-gray-900 p-6 rounded-lg text-center border border-red-500 max-w-sm w-full">
        <h3 className="text-xl font-semibold text-red-400 mb-2">Insufficient Balance</h3>
        <p className="text-gray-300 mb-4">You don't have enough balance to book this session.</p>
        <p className="text-gray-400 mb-4">Your Wallet: ₹{walletBalance.toFixed(2)}</p>
        <button
          onClick={() => setShowInsufficientFunds(false)}
          className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          Close
        </button>
      </div>
    </motion.div>
  )}
</AnimatePresence>

            {!showConfirmation ? (
              <>
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-white">Book Charging Session</h2>
                    <div className="flex items-center text-gray-400 text-sm mt-1">
                      <MapPin className="w-4 h-4 mr-1" />
                      {station.name}
                    </div>
                  </div>
                  <button onClick={handleClose} className="text-gray-400 hover:text-white transition-colors">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Station Info */}
                <div className="bg-gray-700 rounded-lg p-4 mb-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400 text-sm">Address</p>
                      <p className="text-white font-medium">{station.address}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">City</p>
                      <p className="text-white font-medium">{station.city}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Vacant Chargers</p>
                      <p className="text-white font-medium">{station.vacantChargers}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Rating</p>
                      <p className="text-white font-medium">⭐ {station.rating}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-gray-400 text-sm">Price Per Minute</p>
                      <p className="text-white font-medium">₹{station.pricePerMinute} / min</p>
                    </div>
                  </div>
                </div>

                {/* Duration Selection */}
                <div className="mb-6">
                  <label className="block text-white font-medium mb-3">Duration (minutes)</label>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                    {durationOptions.map((mins) => (
                      <motion.button
                        key={mins}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setDuration(mins)}
                        className={`p-2 rounded text-sm transition-all duration-200 ${
                          duration === mins
                            ? "bg-blue-400 text-gray-900 font-medium"
                            : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        }`}
                      >
                        {mins}m
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Cost Summary */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-700 rounded-lg p-4 mb-6"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Estimated Cost</p>
                      <p className="text-white font-medium">
                        {duration} minutes × ₹ {station.pricePerMinute} / min.
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center text-green-400">
                        <IndianRupee className="w-5 h-5 mr-1" />
                        <span className="text-2xl font-bold">{calculateCost().toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <button
                    onClick={handleClose}
                    className="flex-1 px-4 py-3 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleBooking}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-green-400 to-blue-500 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-green-400/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Confirm Booking
                  </motion.button>
                </div>
              </>
            ) : (
              /* Confirmation Screen */
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="w-20 h-20 bg-green-400/10 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <CheckCircle className="w-10 h-10 text-green-400" />
                </motion.div>
                <h3 className="text-2xl font-bold text-white mb-2">Booking Confirmed!</h3>
                <p className="text-gray-400 mb-4">Your charging session has been successfully booked.</p>
                <p className="text-gray-400 mb-4">Start charging your vehicle from the Bookings page.</p>
                <div className="bg-gray-700 rounded-lg p-4 text-left">
                  <p className="text-white font-medium">{station.name}</p>
                  <p className="text-gray-400 text-sm">
                    {duration} minutes
                  </p>
                  <p className="text-green-400 font-medium mt-2">Total: ₹ {calculateCost().toFixed(2)}</p>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default BookingModal
