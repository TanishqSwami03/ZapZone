"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Calendar, Clock, MapPin, User,
  DollarSign, CheckCircle, AlertCircle, XCircle,
  IndianRupee
} from "lucide-react"
import { collection, onSnapshot, query, where } from "firebase/firestore"
import { db, auth } from "../../firebase/firebaseConfig"

const BookingManagement = () => {
  const [bookings, setBookings] = useState([])
  const [stations, setStations] = useState([])
  const [selectedStatus, setSelectedStatus] = useState("")
  const [selectedStation, setSelectedStation] = useState("")
  const [companyId, setCompanyId] = useState(null)
  const [users, setUsers] = useState([])

  // ✅ Get current user's UID (auth state)
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCompanyId(user.uid) // Directly use UID
      }
    })
    return () => unsubscribe()
  }, [])

  // 🟢 Get stations for the logged-in company
  useEffect(() => {
    if (!companyId) return

    const q = query(collection(db, "stations"), where("companyId", "==", companyId))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const stationList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      setStations(stationList)
    })

    return () => unsubscribe()
  }, [companyId])

  useEffect(() => {
    if (!companyId) return

    const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
      const userList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      setUsers(userList)
    })

    return () => unsubscribe()
  }, [companyId])

  // 🔵 Get bookings for those stations
  useEffect(() => {
    if (stations.length === 0) return

    const unsubscribe = onSnapshot(collection(db, "bookings"), (snapshot) => {
      const allBookings = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))

      const stationIds = stations.map((s) => s.id)
      const filtered = allBookings.filter((b) => stationIds.includes(b.stationId))
      setBookings(filtered)
    })

    return () => unsubscribe()
  }, [stations])

  // 🟡 Loading state
  if (companyId === null) {
    return (
      <div className="text-center text-gray-400 py-10">
        Loading booking data...
      </div>
    )
  }

  // 🔍 Filtered bookings
  const filteredBookings = bookings.filter((booking) => {
    const matchesStatus = !selectedStatus || booking.status === selectedStatus
    const matchesStation = !selectedStation || booking.stationId === selectedStation
    return matchesStatus && matchesStation
  })

  const statusOptions = [
    { value: "", label: "All Bookings" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
    { value: "charging", label: "Charging" },
  ]

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed": return CheckCircle
      case "cancelled": return XCircle
      case "charging": return Zap
      default: return AlertCircle
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "completed": return "text-green-400 bg-green-400/10 border-green-400/20"
      case "charging": return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20"
      case "cancelled": return "text-red-400 bg-red-400/10 border-red-400/20"
      default: return "text-gray-400 bg-gray-400/10 border-gray-400/20"
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

  const totalRevenue = filteredBookings
    .filter((booking) => booking.status === "completed")
    .reduce((sum, booking) => sum + (booking.cost || 0), 0)

  const getUserName = (userId) => {
    const user = users.find((u) => u.uid === userId)
    return user ? user.name : "Unknown User"
  }

  const formatTo12Hour = (time24) => {
    const [hours, minutes, seconds] = time24.split(":")
    const date = new Date()
    date.setHours(+hours)
    date.setMinutes(+minutes)
    date.setSeconds(+seconds || 0)

    return date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  const completedCount = bookings.filter((b) => b.status === "completed").length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Booking Management</h1>
          <p className="text-gray-400">Monitor and manage bookings across your stations</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        {/* Completed Bookings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.05, y: -2, borderColor: "#51a2ff", borderWidth: "3px" }}
          transition={{ type: "spring", stiffness: 300 }}
          className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-md border border-gray-700 rounded-2xl p-6 shadow-md"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Completed Bookings</p>
              <p className="text-2xl font-bold text-white">{completedCount}</p>
            </div>
            <div className="w-12 h-12 bg-blue-400/10 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </motion.div>

        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-800 border border-gray-700 rounded-xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Upcoming</p>
              <p className="text-2xl font-bold text-white">{upcomingBookings}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-400/10 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-400" />
            </div>
          </div>
        </motion.div> */}

        {/* Revenue */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.05, y: -2, borderColor: "#05df72", borderWidth: "2px"}}
          transition={{ type: "spring", stiffness: 300 }}
          className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-md border border-gray-700 rounded-2xl p-6 shadow-md"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Revenue (Completed)</p>
              <p className="text-2xl font-bold text-white">₹ {totalRevenue.toFixed(2)}</p>
            </div>
            <div className="w-12 h-12 bg-green-400/10 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </motion.div>

        {/* Completion Rate */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.05, y: -2, borderColor: "#b773f0", borderWidth: "2px"}}
          transition={{ type: "spring", stiffness: 300 }}
          className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-md border border-gray-700 rounded-2xl p-6 shadow-md"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Completion Rate</p>
              <p className="text-2xl font-bold text-white">
                {bookings.length > 0
                  ? Math.round((bookings.filter((b) => b.status === "completed").length / bookings.length) * 100)
                  : 0}%
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-400/10 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-purple-400" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
        className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-md border border-gray-700 rounded-2xl p-6 shadow-md"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Filter by Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-400"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Filter by Station</label>
            <select
              value={selectedStation}
              onChange={(e) => setSelectedStation(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-400"
            >
              <option value="">All Stations</option>
              {stations.map((station) => (
                <option key={station.id} value={station.id}>
                  {station.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {/* Bookings List */}
      <div className="space-y-1 grid grid-cols-1 md:grid-cols-2 gap-7">
        {filteredBookings.map((booking, index) => {
          const StatusIcon = getStatusIcon(booking.status)
          const station = stations.find((s) => s.id === booking.stationId)

          return (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.02, y: -3, borderColor: `${getBorderColor(booking.status)}`, borderWidth: "2px" }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-md border border-gray-700 rounded-2xl p-6 shadow-md"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="flex-2">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Customer</p>
                      <div className="flex items-center">
                        <User className="w-4 h-4 text-blue-400 mr-1" />
                        <span className="text-white font-medium">{getUserName(booking.userId)}</span>
                      </div>
                    </div>
                    <div className={`flex items-center px-3 py-1 rounded-full text-sm border ${getStatusColor(booking.status)}`}>
                      <StatusIcon className="w-4 h-4 mr-1" />
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Station</p>
                      <div className="flex items-center">
                        <MapPin className="w-4 text-yellow-400 h-4 mr-1" />
                        {station?.name || "Unknown Station"}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Date & Time</p>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 text-green-400 mr-1" />
                        <span className="text-white font-medium">{booking.date}</span>
                      </div>
                      <div className="flex items-center mt-1">
                        <Clock className="w-4 h-4 text-green-400 mr-1" />
                        <span className="text-white font-medium">{formatTo12Hour(booking.time)}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Duration</p>
                      <p className="text-white font-medium">{booking.duration} min</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Revenue</p>
                      <div className="flex items-center">
                        <IndianRupee className="w-4 h-4 text-green-400 mr-1" />
                        <span className="text-white font-medium">{booking.cost.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {booking.status === "completed" && booking.rating && (
                    <div className="w-fit mt-4 p-3 bg-gray-800 rounded-lg">
                      <p className="text-xs text-gray-400 mb-1">Customer Rating</p>
                      <div className="flex items-center">
                        <span className="text-yellow-400 mr-2">{"★".repeat(booking.rating)}</span>
                        <span className="text-white">{booking.rating}/5</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* No Bookings */}
      {filteredBookings.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-400 mb-2">No bookings found</h3>
          <p className="text-gray-500">
            {selectedStatus || selectedStation
              ? "No bookings match the selected filters"
              : "Bookings will appear here once customers start using your stations"}
          </p>
        </motion.div>
      )}
    </div>
  )
}

export default BookingManagement
