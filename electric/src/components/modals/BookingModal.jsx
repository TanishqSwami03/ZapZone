"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Calendar, Clock, Zap, DollarSign, MapPin, CheckCircle, IndianRupee } from "lucide-react"
import { db } from "../../firebase/firebaseConfig"
import { collection, addDoc, serverTimestamp, doc, getDoc, setDoc } from "firebase/firestore"


const BookingModal = ({ isOpen, onClose, station }) => {
  const [showInsufficientFunds, setShowInsufficientFunds] = useState(false)
  const [duration, setDuration] = useState(30)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [wallet, setWallet] = useState(0)
  const [userId, setUserId] = useState(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("user")
      if (stored) {
        try {
          const user = JSON.parse(stored)
          if (user.uid) {
            setUserId(user.uid)
          }
        } catch (error) {
          console.error("Invalid user in localStorage")
        }
      }
    }
  }, [])

  useEffect(() => {
    const fetchBalance = async () => {
      if (!userId) return
      const userRef = doc(db, "users", userId)
      const userSnap = await getDoc(userRef)
      if (userSnap.exists()) {
        const data = userSnap.data()
        setWallet(data.wallet || 0)
      }
    }

    fetchBalance()
  }, [userId])


  const durationOptions = [15, 30, 45, 60, 90, 120]

  const calculateCost = () => {
    if (!station) return 0
    const pricePerMinute = station.pricePerMinute || 0
    return pricePerMinute * duration
  }

  const handleBooking = async () => {
    const cost = calculateCost()

    if (!station || !userId) return

    // Fetch latest wallet value before booking
    const userRef = doc(db, "users", userId)
    const userSnap = await getDoc(userRef)

    if (!userSnap.exists()) return

    const userData = userSnap.data()
    const latestWallet = userData.wallet || 0

    if (latestWallet < cost) {
      setShowInsufficientFunds(true)
      return
    }

    const now = new Date().toString()
    const onlyDate = now.split(" ").slice(0, 4).join(" ")
    const onlyTime = now.split(" ")[4]

    const booking = {
      userId,
      stationId: station.id,
      stationName: station.name,
      date: onlyDate,
      time: onlyTime,
      duration,
      cost,
      status: "confirmed",
      createdAt: serverTimestamp(),
    }

    try {
      // Add booking
      await addDoc(collection(db, "bookings"), booking)

      // Update user wallet, expenditure, chargingHours, bookings
      await setDoc(userRef, {
        wallet: latestWallet - cost,
        expenditure: (userData.expenditure || 0) + cost,
        chargingHours: (userData.chargingHours || 0) + duration,
        bookings: (userData.bookings || 0) + 1
      }, { merge: true })

      // Update station: revenue, completedBookings, vacantChargers
      const stationRef = doc(db, "stations", station.id)
      const stationSnap = await getDoc(stationRef)
      const stationData = stationSnap.data()

      await setDoc(stationRef, {
        revenue: (stationData.revenue || 0) + cost,
        completedBookings: (stationData.completedBookings || 0) + 1,
        vacantChargers: Math.max((stationData.vacantChargers || 0) - 1, 0)
      }, { merge: true })

      setShowConfirmation(true)
      setTimeout(() => {
        setShowConfirmation(false)
        resetForm()
        onClose()
      }, 2000)
    } catch (error) {
      console.error("Booking failed:", error)
    }
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
            className="rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-700"
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
            <AnimatePresence>
              {showInsufficientFunds && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute inset-0 backdrop-blur-sm bg-opacity-80 flex items-center justify-center z-50 rounded-xl"
                >
                  <div className="bg-gray-900 p-6 rounded-lg text-center border border-red-500 max-w-sm w-full">
                    <h3 className="text-xl font-semibold text-red-400 mb-2">Insufficient Balance</h3>
                    <p className="text-gray-300 mb-4">You don't have enough balance to book this session.</p>
                    <p className="text-gray-400 mb-4">Your Wallet: ₹{wallet.toFixed(2)}</p>
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
                <div className="backdrop-blur-sm border border-gray-800 rounded-lg p-4 mb-6">
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
                        className={`p-2 rounded text-sm ${
                          duration === mins
                            ? "bg-green-400 text-gray-900 font-medium"
                            : "backdrop-blur-sm border border-gray-800 text-gray-300 "
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
                  className="backdrop-blur-sm border border-gray-800 rounded-lg p-4 mb-6"
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
                  <motion.button
                    whileHover={{scale:1.05}}
                    onClick={handleClose}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-black via-gray-600 to-black text-white rounded-lg "
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleBooking}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-black via-green-600 to-black text-white font-medium rounded-lg "
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
                  className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
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
                  <CheckCircle className="w-10 h-10 text-green-400" />
                </motion.div>
                <h3 className="text-2xl font-bold text-white mb-2">Booking Confirmed!</h3>
                <p className="text-gray-400 mb-4">Your charging session has been successfully booked.</p>
                <p className="text-gray-400 mb-4">Start charging your vehicle from the Bookings page.</p>
                <div className="backdrop-blur-sm border border-gray-800 rounded-lg p-4 text-left">
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
