"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  TrendingUp, DollarSign, Users, Building2, Zap, Download, Calendar,
  IndianRupee
} from "lucide-react"
import { collection, getDocs } from "firebase/firestore"
import { db } from "../../firebase/firebaseConfig"

const Reports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("month")

  const [platformStats, setPlatformStats] = useState({
    totalRevenue: 0,
    platformCommission: 0,
    totalBookings: 0,
    activeUsers: 0,
    activeStations: 0,
    averageBookingValue: 0
  })

  const [topStations, setTopStations] = useState([])

  const periodOptions = [
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
    { value: "quarter", label: "This Quarter" },
    { value: "year", label: "This Year" }
  ]

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [stationSnap, bookingSnap, userSnap] = await Promise.all([
          getDocs(collection(db, "stations")),
          getDocs(collection(db, "bookings")),
          getDocs(collection(db, "users"))
        ])

        const stations = stationSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        const bookings = bookingSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        const users = userSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))

        const totalRevenue = bookings.reduce((sum, b) => sum + (b.cost || 0), 0)
        const totalBookings = bookings.length
        const platformCommission = totalRevenue * 0.10
        const averageBookingValue = totalBookings > 0 ? totalRevenue / totalBookings : 0
        const activeUsers = users.filter(u => u.status === "active").length
        const activeStations = stations.filter(s => s.status === "active").length

        const statsMap = {}
        stations.forEach(s => {
          statsMap[s.id] = {
            name: s.name,
            revenue: s.revenue || 0,
            bookings: s.completedBookings || 0,
            rating: s.rating || 0
          }
        })

        const stationsList = Object.values(statsMap)
        const sortedStations = stationsList
          .sort((a, b) => b.revenue - a.revenue)
          .slice(0, 5)

        setPlatformStats({
          totalRevenue,
          platformCommission,
          totalBookings,
          activeUsers,
          activeStations,
          averageBookingValue: Number(averageBookingValue.toFixed(2))
        })

        setTopStations(sortedStations)
      } catch (err) {
        console.error("Error loading analytics", err)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Analytics & Reports</h1>
          <p className="text-gray-400">Platform performance and business insights</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Total Revenue */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.05, y: -2, borderColor: "#05df72", borderWidth: "3px" }}
          transition={{ type: "spring", stiffness: 300 }}
          className="backdrop-blur-sm border border-gray-900 rounded-2xl p-6 shadow-md"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Revenue</p>
              <p className="text-2xl font-bold text-white">₹ {platformStats.totalRevenue.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-green-400/10 rounded-lg flex items-center justify-center">
              <IndianRupee className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </motion.div>

        {/* Commission */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.05, y: -2, borderColor: "#3B82F6", borderWidth: "3px" }}
          transition={{ type: "spring", stiffness: 300 }}
          className="backdrop-blur-sm border border-gray-900 rounded-2xl p-6 shadow-md"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Commission</p>
              <p className="text-2xl font-bold text-white">₹ {platformStats.platformCommission.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-blue-400/10 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </motion.div>

        {/* Total Bookings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.05, y: -2, borderColor: "#A855F7", borderWidth: "3px" }}
          transition={{ type: "spring", stiffness: 300 }}
          className="backdrop-blur-sm border border-gray-900 rounded-2xl p-6 shadow-md"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Bookings</p>
              <p className="text-2xl font-bold text-white">{platformStats.totalBookings}</p>
            </div>
            <div className="w-12 h-12 bg-purple-400/10 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-purple-400" />
            </div>
          </div>
        </motion.div>

        {/* Active Users */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.05, y: -2, borderColor: "#FACC15", borderWidth: "3px" }}
          transition={{ type: "spring", stiffness: 300 }}
          className="backdrop-blur-sm border border-gray-900 rounded-2xl p-6 shadow-md"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active Users</p>
              <p className="text-2xl font-bold text-white">{platformStats.activeUsers}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-400/10 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-yellow-400" />
            </div>
          </div>
        </motion.div>

        {/* Active Stations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.05, y: -2, borderColor: "#FB923C", borderWidth: "3px" }}
          transition={{ type: "spring", stiffness: 300 }}
          className="backdrop-blur-sm border border-gray-900 rounded-2xl p-6 shadow-md"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active Stations</p>
              <p className="text-2xl font-bold text-white">{platformStats.activeStations}</p>
            </div>
            <div className="w-12 h-12 bg-orange-400/10 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-orange-400" />
            </div>
          </div>
        </motion.div>

        {/* Avg. Booking */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.05, y: -2, borderColor: "#EC4899", borderWidth: "3px" }}
          transition={{ type: "spring", stiffness: 300 }}
          className="backdrop-blur-sm border border-gray-900 rounded-2xl p-6 shadow-md"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Avg. Booking</p>
              <p className="text-2xl font-bold text-white">₹ {platformStats.averageBookingValue}</p>
            </div>
            <div className="w-12 h-12 bg-pink-400/10 rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-pink-400" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Top Stations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{
          scale: 1.02,
          y: -2,
          borderColor: "#c084fc",
          borderWidth: "1.5px"
        }}
        transition={{ type: "spring", stiffness: 300 }}
        className="backdrop-blur-md border border-gray-900 rounded-2xl p-6 shadow-md"
        style={{
          background: "radial-gradient(125% 125% at 75% 10%, #000000 40%, #c27aff40 100%)",
        }}
      >
        <h2 className="text-xl font-semibold text-white mb-6">🏆 Top Performing Stations</h2>

        <div className="grid grid-cols-1 xl:grid-cols-3 sm:grid-cols-2 gap-4">
          {topStations.map((station, index) => (
            <motion.div
              key={station.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.08 }}
              className="flex items-center justify-between p-5 backdrop-blur-sm border border-gray-700 rounded-xl hover:shadow-xl hover:border-purple-400/30 transition duration-200"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-purple-500/10 text-purple-400 border border-purple-400/20 flex items-center justify-center font-bold">
                  {index + 1}
                </div>
                <div>
                  <h3 className="text-white font-medium text-sm">{station.name}</h3>
                  <div className="flex gap-2 mt-1">
                    <span 
                      className="text-xs px-2 py-0.5 rounded-full backdrop-blur-sm border border-gray-800 text-gray-300"
                      style={{
                        background: "radial-gradient(125% 125% at 75% 10%, #000000 40%, #c27aff40 100%)",
                      }}
                    >
                      📦 {station.bookings} bookings
                    </span>
                    <span 
                      className="text-xs px-2 py-0.5 rounded-full backdrop-blur-sm border border-gray-800 text-yellow-300"
                      style={{
                        background: "radial-gradient(125% 125% at 75% 10%, #000000 40%, #c27aff40 100%)",
                      }}
                    >
                      ⭐ {station.rating}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-xs">Revenue</p>
                <p className="text-white font-semibold text-sm">₹{station.revenue.toLocaleString()}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

    </div>
  )
}

export default Reports
