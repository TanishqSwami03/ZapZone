"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Calendar, Clock, Star, DollarSign, Zap, CheckCircle, AlertCircle, Play, X, Check, Stars } from "lucide-react"
import ReviewModal from "../../components/modals/ReviewModal"
import ChargingConfirmModal from "../../components/modals/ChargingConfirmModal"
import ConfirmModal from "../../components/modals/ConfirmModal"
import RatingConfirmationModal from "../../components/modals/RatingConfirmationModal"
import { db } from "../../firebase/firebaseConfig"
import { collection, query, where, onSnapshot, doc, updateDoc, getDoc, getDocs } from "firebase/firestore"


const BookingHistory = () => {
  const [selectedStatus, setSelectedStatus] = useState("")
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [showChargingConfirm, setShowChargingConfirm] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [chargingTimers, setChargingTimers] = useState({})
  const [bookings, setBookings] = useState([])
  const [userId, setUserId] = useState(null)
  const [userStats, setUserStats] = useState(null)
  const [showRatingConfirmation, setShowRatingConfirmation] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"))
    if (user?.uid) {
      setUserId(user.uid)
      const unsubscribe = fetchUserStats(user.uid)

      const q = query(collection(db, "bookings"), where("userId", "==", user.uid))
      const unsubscribeBookings = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }))

        // 🔥 Sort by createdAt timestamp, newest first
        data.sort((a, b) => {
          const aTime = a.createdAt?.toMillis?.() || 0
          const bTime = b.createdAt?.toMillis?.() || 0
          return bTime - aTime
        })

        setBookings(data)
      })

      return () => {
        if (typeof unsubscribe === 'function') unsubscribe()
        if (typeof unsubscribeBookings === 'function') unsubscribeBookings()
      }
    }
  }, [])

  const updateBooking = useCallback(async (bookingId, data) => {
    const bookingRef = doc(db, "bookings", bookingId)
    await updateDoc(bookingRef, data)
  }, [])

  const fetchUserStats = (uid) => {
    const userRef = doc(db, "users", uid)
    return onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        setUserStats(docSnap.data())
      }
    })
  }

  const statusOptions = [
    { value: "", label: "All Bookings" },
    { value: "completed", label: "Completed" },
    { value: "charging", label: "Charging" },
    { value: "cancelled", label: "Cancelled" },
  ]

  // Initialize and manage charging timers
  useEffect(() => {
    const chargingBookings = bookings.filter((booking) => booking.status === "charging")

    // Initialize timers for charging bookings that don't have one yet
    chargingBookings.forEach((booking) => {
      if (!chargingTimers[booking.id] && booking.chargingStart) {
        const startTime = new Date(booking.chargingStart).getTime()
        const now = Date.now()
        const elapsed = Math.floor((now - startTime) / 1000) // in seconds
        const remaining = booking.duration * 60 - elapsed

        setChargingTimers((prev) => ({
          ...prev,
          [booking.id]: remaining > 0 ? remaining : 0,
        }))

        // Optionally mark as completed immediately if it's over and not updated
        if (remaining <= 0 && booking.status === "charging") {
          updateBooking(booking.id, { status: "completed" })
          incrementVacantCharger(booking.stationId)
        }
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
            updateBooking(bookingId, { status: "completed" })

            const completedBooking = bookings.find(b => b.id === bookingId)
            if (completedBooking?.stationId) {
              incrementVacantCharger(completedBooking.stationId)
            }

            delete updated[bookingId]
            hasChanges = true
          }
        })

        return hasChanges ? updated : prev
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [bookings, updateBooking])

  const incrementVacantCharger = async (stationId) => {
    try {
      const stationRef = doc(db, "stations", stationId)
      const stationSnap = await getDoc(stationRef)

      if (stationSnap.exists()) {
        const currentVacant = stationSnap.data().vacantChargers || 0
        await updateDoc(stationRef, {
          vacantChargers: currentVacant + 1
        })
      }
    } catch (error) {
      console.error("Error incrementing vacant chargers:", error)
    }
  }

  const filteredBookings = bookings.filter((booking) => {
    const matchesStatus = !selectedStatus || booking.status === selectedStatus
    const searchText = searchQuery.toLowerCase()

    const matchesSearch =
      booking.stationName?.toLowerCase().includes(searchText) ||
      booking.date?.toLowerCase().includes(searchText) ||
      booking.duration?.toString().includes(searchText)

    return matchesStatus && matchesSearch
  })

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return CheckCircle
      case "confirmed":
        return Check
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
      case "confirmed":
        return "text-blue-400 bg-blue-400/10 border-blue-400/20"
      case "charging":
        return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20"
      case "cancelled":
        return "text-red-400 bg-red-400/10 border-red-400/20"
      default:
        return "text-gray-400 bg-gray-400/10 border-gray-400/20"
    }
  }

  const getBorderColor = (status) => {
    switch(status) {
      case "completed":
        return "#05df72"
      case "confirmed":
        return "#51a2ff"
      case "charging":
        return "#fdc700"
      case "cancelled":
        return "#F87171"
      default:
        return "#9CA3AF"
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

  const handleChargingConfirmed = async () => {
    setShowChargingConfirm(false)
    const now = new Date().toISOString()
    await updateBooking(selectedBooking.id, {
      status: "charging",
      chargingStart: now,
    })
  }

  const handleReviewSubmit = async (bookingId, rating) => {
    try {
      // 1. Update the booking with the submitted rating
      await updateBooking(bookingId, { rating })

      // 2. Get the booking details to retrieve the station ID
      const bookingDocRef = doc(db, "bookings", bookingId)
      const bookingDoc = await getDoc(bookingDocRef)
      const bookingData = bookingDoc.data()
      
      const stationId = bookingData?.stationId
      if (!stationId) throw new Error("Station ID not found in booking.")

      // 3. Fetch the station document
      const stationRef = doc(db, "stations", stationId)
      const stationSnap = await getDoc(stationRef)

      if (stationSnap.exists()) {
        const stationData = stationSnap.data()

        const previousTotal = stationData.totalRatings || 0
        const previousCount = stationData.ratingCount || 0

        const newTotal = previousTotal + rating
        const newCount = previousCount + 1
        const newAverage = newTotal / newCount

        // 4. Update the station with the new rating info
        await updateDoc(stationRef, {
          totalRatings: newTotal,
          ratingCount: newCount,
          rating: newAverage
        })
      } else {
        throw new Error("Station document does not exist.")
      }

      // 5. UI: Close modal and show confirmation
      setShowReviewModal(false)
      setSelectedBooking(null)
      setShowRatingConfirmation(true)

      setTimeout(() => {
        setShowRatingConfirmation(false)
      }, 4500)

    } catch (error) {
      console.error("Error submitting review:", error)
    }
  }

  const handleCancelBooking = (booking) => {
    setSelectedBooking(booking)
    setShowCancelModal(true)
  }

  const handleConfirmCancel = async () => {
    try {
      const booking = selectedBooking
      if (!booking) return

      // 1. Update booking status
      await updateBooking(booking.id, { status: "cancelled" })

      // 2. Refund money to user's wallet
      const userRef = doc(db, "users", booking.userId)
      const userSnap = await getDoc(userRef)
      if (userSnap.exists()) {
        const userData = userSnap.data()
        const currentWallet = userData?.wallet || 0
        const currentBookings = userData?.bookings || 0
        const currentSpendings = userData?.expenditure || 0
        const currentChargingHours = userData?.chargingHours || 0

        await updateDoc(userRef, {
          wallet: currentWallet + booking.cost,
          bookings: Math.max(currentBookings - 1, 0),
          expenditure: Math.max(currentSpendings - booking.cost, 0),
          chargingHours: Math.max(currentChargingHours - booking.duration, 0),
        })
      }

      // 3. Deduct money from station's revenue
      const stationRef = doc(db, "stations", booking.stationId)
      const stationSnap = await getDoc(stationRef)
      if (stationSnap.exists()) {
        const stationData = stationSnap.data()
        const currentRevenue = stationData?.revenue || 0
        const completedBookings = stationData?.completedBookings || 0
        const currentVacant = stationData?.vacantChargers || 0

        await updateDoc(stationRef, {
          revenue: Math.max(currentRevenue - booking.cost, 0),
          completedBookings: Math.max(completedBookings - 1, 0),
          vacantChargers: currentVacant + 1,
        })
      }

      // 4. Close modal and reset state
      setShowCancelModal(false)
      setSelectedBooking(null)
    } catch (error) {
      console.error("Error cancelling booking:", error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Booking History</h1>
          <p className="text-gray-400">Track your charging sessions and leave rating.</p>
        </div>

        {/* Status Filter */}
        <div className="mt-4 sm:mt-0">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-800 rounded-lg text-white focus:outline-none focus:border-green-400"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value} className="bg-gray-900 text-white">
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Search Input */}
      <div className="mt-2 w-full sm:w-2/3 md:w-1/2 lg:w-1/3">
        <input
          type="text"
          placeholder="Search your bookings..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:max-w-xs px-4 py-2 border border-gray-800 text-white rounded-lg placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-green-400 transition"
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Completed Bookings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.05, y: -2, borderColor: "#05df72", borderWidth: "2px" }}
          transition={{ type: "spring", stiffness: 300 }}
          className="bg-gradient-to-br backdrop-blur-md border border-gray-800 rounded-2xl p-6 shadow-md"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Completed Bookings</p>
              <p className="text-2xl font-bold text-white">{userStats?.bookings ?? 0}</p>
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
          whileHover={{ scale: 1.05, y: -2, borderColor: "#51a2ff", borderWidth: "2px" }}
          transition={{ type: "spring", stiffness: 300 }}
          className="bg-gradient-to-br backdrop-blur-md border border-gray-800 rounded-2xl p-6 shadow-md"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Spent</p>
              <p className="text-2xl font-bold text-white">
                ₹ {userStats?.expenditure?.toFixed(2) ?? "0.00"}
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
          whileHover={{ scale: 1.05, y: -2, borderColor: "#c27aff", borderWidth: "2px" }}
          transition={{ type: "spring", stiffness: 300 }}
          className="bg-gradient-to-br backdrop-blur-md border border-gray-800 rounded-2xl p-6 shadow-md6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Charging Duration</p>
              <p className="text-2xl font-bold text-white">
                {(() => {
                  const totalMin = userStats?.chargingHours ?? 0;
                  const hours = Math.floor(totalMin / 60);
                  const minutes = totalMin % 60;
                  return `${hours > 0 ? `${hours}h ` : ""}${minutes}m`;
                })()}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-400/10 rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-purple-400" />
            </div>
          </div>
        </motion.div>

      </div>

      {/* Bookings List */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredBookings.map((booking, index) => {
          const StatusIcon = getStatusIcon(booking.status);
          const isCharging = booking.status === "charging";
          const timeRemaining = chargingTimers[booking.id] || 0;

          return (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05, y: -3, borderColor: `${getBorderColor(booking.status)}`, borderWidth: "3px" }}
              transition={{ type: "spring", stiffness: 300 }}
              className="relative hover:shadow-xl backdrop-blur-md border border-gray-900 rounded-2xl p-6 shadow-md"
              style={{
                background: "radial-gradient(125% 125% at 100% 10%, #000000 40%, #072607 100%)",
              }}
            >
              {/* Status badge */}
              <div className={`absolute top-4 left-4 flex items-center gap-2 px-3 py-1 text-sm rounded-full border ${getStatusColor(booking.status)}`}>
                <StatusIcon className="w-4 h-4" />
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </div>

              {/* Station + date */}
              <h3 className="text-xl font-bold text-white mb-1 mt-8">{booking.stationName}</h3>
              <div className="text-sm text-gray-400 flex items-center mb-4">
                <Calendar className="w-4 h-4 mr-1" />
                {booking.date} at {booking.time}
              </div>

              {/* Grid meta info */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Duration</p>
                  <p className="text-white font-medium">{booking.duration} min</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Cost</p>
                  <p className="text-white font-medium">₹ {booking.cost.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Rating</p>
                  {booking.rating ? (
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                      <span className="text-white font-medium">{booking.rating}</span>
                    </div>
                  ) : (
                    <span className="text-gray-500 italic">Not rated</span>
                  )}
                </div>
              </div>

              {/* Timer if charging */}
              {isCharging && timeRemaining > 0 && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center text-yellow-400 font-medium gap-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      >
                        <Zap className="w-4 h-4 mr-2" />
                      </motion.div>
                      Charging...
                    </div>
                    <div className="text-sm font-mono text-white">{formatTime(timeRemaining)}</div>
                  </div>
                  <div className="w-full h-2 rounded-full bg-gray-700 overflow-hidden">
                    <motion.div
                      className="h-full bg-yellow-400"
                      style={{ width: `${calculateProgress(booking.id, booking.duration)}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <div className="text-sm text-gray-100 mt-1 text-right">
                    {Math.round(calculateProgress(booking.id, booking.duration))} % complete
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="mt-6 flex flex-col gap-2">
                {booking.status === "confirmed" && (
                  <motion.button
                    whileHover={{scale:1.05}}
                    onClick={() => handleStartCharging(booking)}
                    className="glow-effect-startCharging w-full flex items-center justify-center px-4 py-2 bg-gradient-to-r via-yellow-400/40 text-white rounded-lg "
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start Charging
                  </motion.button>
                )}

                {booking.status === "completed" && !booking.rating && (
                  <motion.button
                    animate={{
                      x: [0, -60, 60, -40, 40, 0],
                    }}
                    transition={{
                      duration: 0.6,
                      repeat: Infinity,
                      repeatDelay: 1,
                      ease: "easeInOut",
                    }}
                    onClick={() => handleLeaveReview(booking)}
                    className="w-full flex items-center justify-center px-4 py-2 bg-gradient-to-r via-green-400/40 text-white rounded-lg transition"
                  >
                    <Stars className="w-4 h-4 mr-2" />
                    Leave Rating
                  </motion.button>
                )}

                {booking.status === "confirmed" && (
                  <motion.button
                    whileHover={{scale:1.05}}
                    onClick={() => handleCancelBooking(booking)}
                    className="w-full flex items-center justify-center px-4 py-2 bg-gradient-to-r via-red-400/40 text-white rounded-lg "
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel Booking
                  </motion.button>
                )}
              </div>
            </motion.div>
          );
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
      <RatingConfirmationModal isVisible={showRatingConfirmation} />
    </div>
  )
}

export default BookingHistory