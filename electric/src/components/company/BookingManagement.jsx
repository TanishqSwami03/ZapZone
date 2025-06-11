"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Calendar, Clock, MapPin, User, DollarSign, CheckCircle, AlertCircle, XCircle } from "lucide-react"
import { useUser } from "../../context/UserContext"

const BookingManagement = () => {
  const { bookings, stations } = useUser()
  const [selectedStatus, setSelectedStatus] = useState("")
  const [selectedStation, setSelectedStation] = useState("")

  // Filter bookings for company stations (mock company ID = 1)
  const companyStations = stations.filter((station) => station.companyId === 1)
  const companyStationIds = companyStations.map((station) => station.id)
  const companyBookings = bookings.filter((booking) => companyStationIds.includes(booking.stationId))

  const statusOptions = [
    { value: "", label: "All Bookings" },
    { value: "upcoming", label: "Upcoming" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
  ]

  const filteredBookings = companyBookings.filter((booking) => {
    const matchesStatus = !selectedStatus || booking.status === selectedStatus
    const matchesStation = !selectedStation || booking.stationId.toString() === selectedStation
    return matchesStatus && matchesStation
  })

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return CheckCircle
      case "upcoming":
        return Clock
      case "cancelled":
        return XCircle
      default:
        return AlertCircle
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "text-green-400 bg-green-400/10 border-green-400/20"
      case "upcoming":
        return "text-blue-400 bg-blue-400/10 border-blue-400/20"
      case "cancelled":
        return "text-red-400 bg-red-400/10 border-red-400/20"
      default:
        return "text-gray-400 bg-gray-400/10 border-gray-400/20"
    }
  }

  const totalRevenue = filteredBookings
    .filter((booking) => booking.status === "completed")
    .reduce((sum, booking) => sum + booking.cost, 0)

  const upcomingBookings = filteredBookings.filter((booking) => booking.status === "upcoming").length

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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 border border-gray-700 rounded-xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Bookings</p>
              <p className="text-2xl font-bold text-white">{companyBookings.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-400/10 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
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
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800 border border-gray-700 rounded-xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Revenue (Completed)</p>
              <p className="text-2xl font-bold text-white">${totalRevenue.toFixed(2)}</p>
            </div>
            <div className="w-12 h-12 bg-green-400/10 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-800 border border-gray-700 rounded-xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Completion Rate</p>
              <p className="text-2xl font-bold text-white">
                {companyBookings.length > 0
                  ? Math.round(
                      (companyBookings.filter((b) => b.status === "completed").length / companyBookings.length) * 100,
                    )
                  : 0}
                %
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-400/10 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-purple-400" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Filter by Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-400"
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
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-400"
            >
              <option value="">All Stations</option>
              {companyStations.map((station) => (
                <option key={station.id} value={station.id}>
                  {station.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.map((booking, index) => {
          const StatusIcon = getStatusIcon(booking.status)
          const station = stations.find((s) => s.id === booking.stationId)

          return (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-all duration-300"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">Booking #{booking.id}</h3>
                      <div className="flex items-center text-gray-400 text-sm">
                        <MapPin className="w-4 h-4 mr-1" />
                        {station?.name || "Unknown Station"}
                      </div>
                    </div>
                    <div
                      className={`flex items-center px-3 py-1 rounded-full text-sm border ${getStatusColor(booking.status)}`}
                    >
                      <StatusIcon className="w-4 h-4 mr-1" />
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Customer</p>
                      <div className="flex items-center">
                        <User className="w-4 h-4 text-blue-400 mr-1" />
                        <span className="text-white font-medium">John Doe</span>
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
                        <span className="text-white font-medium">{booking.time}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Charger Type</p>
                      <span className="px-2 py-1 bg-blue-400/10 text-blue-400 text-xs rounded border border-blue-400/20">
                        {booking.chargerType}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Duration</p>
                      <p className="text-white font-medium">{booking.duration} min</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Revenue</p>
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 text-green-400 mr-1" />
                        <span className="text-white font-medium">${booking.cost.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {booking.status === "completed" && booking.rating && (
                    <div className="mt-4 p-3 bg-gray-700 rounded-lg">
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
