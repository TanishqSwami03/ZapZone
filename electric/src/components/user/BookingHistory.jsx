"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Calendar, Clock, Star, DollarSign, Zap, CheckCircle, AlertCircle, MessageSquare, Play, X } from "lucide-react"
import { useUser } from "../../context/UserContext"
import ReviewModal from "../../components/modals/ReviewModal"
import ChargingConfirmModal from "../../components/modals/ChargingConfirmModal"
import ConfirmModal from "../../components/modals/ConfirmModal"

const BookingHistory = () => {
  const { bookings, updateBooking } = useUser()
  const [selectedStatus, setSelectedStatus] = useState("")
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [showChargingConfirm, setShowChargingConfirm] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [chargingTimers, setChargingTimers] = useState({})

  const statusOptions = [
    { value: "", label: "All Bookings" },
    { value: "completed", label: "Completed" },
    { value: "upcoming", label: "Upcoming" },
    { value: "charging", label: "Charging" },
    { value: "cancelled", label: "Cancelled" },
  ]

  // Initialize and manage charging timers
  useEffect(() => {
    const chargingBookings = bookings.filter((booking) => booking.status === "charging")

    // Initialize timers for charging bookings that don't have one yet
    chargingBookings.forEach((booking) => {
      if (!chargingTimers[booking.id]) {
        setChargingTimers((prev) => ({
          ...prev,
          [booking.id]: booking.duration * 60, // Convert minutes to seconds
        }))
      }
    })

    // Set up interval for countdown
    const interval = setInterval(() => {
      setChargingTimers((prev) => {
        const updated = { ...prev }
        let hasChanges = false

        Object.keys(updated).forEach((bookingId) => {
          if (updated[bookingId] > 0) {
            updated[bookingId] -= 1
            hasChanges = true
          } else if (updated[bookingId] === 0) {
            // Timer finished, update booking status to completed
            updateBooking(Number.parseInt(bookingId), { status: "completed" })
            delete updated[bookingId]
            hasChanges = true
          }
        })

        return hasChanges ? updated : prev
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [bookings, updateBooking])

  const filteredBookings = bookings.filter((booking) => !selectedStatus || booking.status === selectedStatus)

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return CheckCircle
      case "upcoming":
        return Clock
      case "charging":
        return Zap
      case "cancelled":
        return AlertCircle
      default:
        return Clock
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "text-green-400 bg-green-400/10 border-green-400/20"
      case "upcoming":
        return "text-blue-400 bg-blue-400/10 border-blue-400/20"
      case "charging":
        return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20"
      case "cancelled":
        return "text-red-400 bg-red-400/10 border-red-400/20"
      default:
        return "text-gray-400 bg-gray-400/10 border-gray-400/20"
    }
  }

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const calculateProgress = (bookingId, totalDuration) => {
    const timeRemaining = chargingTimers[bookingId] || 0
    const totalSeconds = totalDuration * 60
    const progress = ((totalSeconds - timeRemaining) / totalSeconds) * 100
    return Math.min(Math.max(progress, 0), 100)
  }

  const handleLeaveReview = (booking) => {
    setSelectedBooking(booking)
    setShowReviewModal(true)
  }

  const handleStartCharging = (booking) => {
    setSelectedBooking(booking)
    setShowChargingConfirm(true)
  }

  const handleChargingConfirmed = () => {
    setShowChargingConfirm(false)
    // Update booking status to charging and initialize timer
    updateBooking(selectedBooking.id, { status: "charging" })
    setChargingTimers((prev) => ({
      ...prev,
      [selectedBooking.id]: selectedBooking.duration * 60,
    }))
  }

  const handleReviewSubmit = (bookingId, rating, comment) => {
    updateBooking(bookingId, { rating, review: comment })
    setShowReviewModal(false)
    setSelectedBooking(null)
  }

  const handleCancelBooking = (booking) => {
    setSelectedBooking(booking)
    setShowCancelModal(true)
  }

  const handleConfirmCancel = () => {
    updateBooking(selectedBooking.id, { status: "cancelled" })
    setShowCancelModal(false)
    setSelectedBooking(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Booking History</h1>
          <p className="text-gray-400">Track your charging sessions and leave reviews</p>
        </div>

        {/* Status Filter */}
        <div className="mt-4 sm:mt-0">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-400"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Total Bookings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 border border-gray-700 rounded-xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Bookings</p>
              <p className="text-2xl font-bold text-white">{bookings.length}</p>
            </div>
            <div className="w-12 h-12 bg-green-400/10 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </motion.div>

        {/* Total Spent */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-800 border border-gray-700 rounded-xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Spent</p>
              <p className="text-2xl font-bold text-white">
                ${bookings.reduce((sum, booking) => sum + booking.cost, 0).toFixed(2)}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-400/10 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </motion.div>

        {/* Charging Hours */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800 border border-gray-700 rounded-xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Charging Hours</p>
              <p className="text-2xl font-bold text-white">
                {Math.round(bookings.reduce((sum, booking) => sum + booking.duration, 0) / 60)}h
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-400/10 rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-purple-400" />
            </div>
          </div>
        </motion.div>

        {/* Active Sessions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-800 border border-gray-700 rounded-xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active Sessions</p>
              <p className="text-2xl font-bold text-white">{bookings.filter((b) => b.status === "charging").length}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-400/10 rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-yellow-400" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.map((booking, index) => {
          const StatusIcon = getStatusIcon(booking.status)
          const isCharging = booking.status === "charging"
          const timeRemaining = chargingTimers[booking.id] || 0

          return (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-all duration-300"
            >
              <div className="flex flex-col lg:flex-row lg:items-stretch lg:justify-between gap-4">
                {/* Left Column */}
                <div className="flex flex-col justify-between flex-1">
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-1">{booking.stationName}</h3>
                        <div className="flex items-center text-gray-400 text-sm">
                          <Calendar className="w-4 h-4 mr-1" />
                          {booking.date} at {booking.time}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Charger Type</p>
                        <p className="text-white font-medium">{booking.chargerType}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Duration</p>
                        <p className="text-white font-medium">{booking.duration} min</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Cost</p>
                        <p className="text-white font-medium">${booking.cost.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Rating</p>
                        {booking.rating ? (
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                            <span className="text-white font-medium">{booking.rating}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400">Not rated</span>
                        )}
                      </div>
                    </div>

                    {/* Charging Timer and Progress Bar - ONLY ON PAGE */}
                    {isCharging && timeRemaining > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-yellow-400/10 border border-yellow-400/20 rounded-lg p-4 mb-4"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                            >
                              <Zap className="w-5 h-5 text-yellow-400 mr-2" />
                            </motion.div>
                            <span className="text-yellow-400 font-medium">Charging in Progress</span>
                          </div>
                          <div className="text-right">
                            <div className="text-white font-mono text-xl font-bold">{formatTime(timeRemaining)}</div>
                            <div className="text-yellow-400 text-xs">remaining</div>
                          </div>
                        </div>

                        <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden mb-2">
                          <motion.div
                            className="h-full bg-gradient-to-r from-yellow-500 to-yellow-300"
                            style={{ width: `${calculateProgress(booking.id, booking.duration)}%` }}
                            transition={{ duration: 0.5 }}
                          />
                        </div>

                        <div className="flex justify-between text-xs text-gray-400">
                          <span>Started</span>
                          <span>{Math.round(calculateProgress(booking.id, booking.duration))}% Complete</span>
                          <span>{booking.duration} min total</span>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Right Column */}
                <div className="flex flex-col items-end space-y-2 lg:max-w-sm w-full">
                  {/* Status Badge */}
                  <div
                    className={`flex items-center px-3 py-1 rounded-full text-sm border ${getStatusColor(
                      booking.status,
                    )}`}
                  >
                    <StatusIcon className="w-4 h-4 mr-1" />
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </div>

                  {/* Action Buttons */}
                  {booking.status === "upcoming" && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleStartCharging(booking)}
                      className="flex items-center px-4 py-2 bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 rounded-lg hover:bg-yellow-400/20 transition-all duration-200"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start Charging
                    </motion.button>
                  )}

                  {booking.status === "completed" && !booking.rating && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleLeaveReview(booking)}
                      className="flex items-center px-4 py-2 bg-green-400/10 text-green-400 border border-green-400/20 rounded-lg hover:bg-green-400/20 transition-all duration-200"
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Leave Review
                    </motion.button>
                  )}

                  {/* Cancel button - ONLY for upcoming bookings, NOT for charging */}
                  {booking.status === "upcoming" && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleCancelBooking(booking)}
                      className="flex items-center px-4 py-2 bg-red-500/10 text-red-500 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-all duration-200"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel Booking
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* No Bookings Message */}
      {filteredBookings.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-400 mb-2">No bookings found</h3>
          <p className="text-gray-500">
            {selectedStatus ? "No bookings match the selected status" : "Start by booking your first charging session"}
          </p>
        </motion.div>
      )}

      {/* Modals */}
      <ReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        booking={selectedBooking}
        onSubmit={handleReviewSubmit}
      />
      <ChargingConfirmModal
        isOpen={showChargingConfirm}
        onClose={() => setShowChargingConfirm(false)}
        onConfirm={handleChargingConfirmed}
        booking={selectedBooking}
      />
      <ConfirmModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleConfirmCancel}
        title="Cancel Booking"
        message="Are you sure you want to cancel this booking? This action cannot be undone."
        confirmText="Yes, Cancel Booking"
        confirmColor="red"
      />
    </div>
  )
}

export default BookingHistory
