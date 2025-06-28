"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  DollarSign,
  TrendingUp,
  Calendar,
  PieChart,
  Building2,
  MapPin,
  CheckCircle,
  AlertCircle
} from "lucide-react"

import {
  collection,
  onSnapshot,
  query,
  where
} from "firebase/firestore"
import { db, auth } from "../../firebase/firebaseConfig"

const Earnings = () => {
  const [currentUser, setCurrentUser] = useState(null)
  const [stations, setStations] = useState([])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) setCurrentUser(user)
    })
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    if (!currentUser) return
    const q = query(collection(db, "stations"), where("companyId", "==", currentUser.uid))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const stationList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      setStations(stationList)
    })
    return () => unsubscribe()
  }, [currentUser])

  useEffect(() => {
    if (!currentUser) return
    const unsubscribe = onSnapshot(collection(db, "bookings"), (snapshot) => {
      const all = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      setBookings(all)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [currentUser])

  if (loading || !currentUser) return <p className="text-white">Loading...</p>

  const companyStationIds = stations.map(s => s.id)
  const completedBookings = bookings.filter(
    (b) => companyStationIds.includes(b.stationId) && b.status === "completed"
  )

  const totalRevenue = completedBookings.reduce((sum, b) => sum + (b.cost || 0), 0)
  const totalBookings = completedBookings.length
  const platformCommission = totalRevenue * 0.1
  const netEarnings = totalRevenue - platformCommission
  const avgPerBooking = totalBookings > 0 ? totalRevenue / totalBookings : 0

  const stationStats = stations.map((station) => {
    const stationBookings = completedBookings.filter((b) => b.stationId === station.id)
    const revenue = stationBookings.reduce((sum, b) => sum + (b.cost || 0), 0)
    const bookingCount = stationBookings.length
    return {
      ...station,
      revenue,
      completedBookings: bookingCount,
      avgPerBooking: bookingCount > 0 ? revenue / bookingCount : 0
    }
  })

  const getBorderColor = (status) => {
    switch(status) {
      case "active":
        return "#05df72"
      case "suspended":
        return "#F87171"
      default:
        return "#9CA3AF"
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-400 border-green-500/30";
      case "suspended":
        return "bg-red-500/10 text-red-400 border-red-500/30";
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/30";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return CheckCircle
      case "suspended":
        return AlertCircle
      default:
        return AlertCircle
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Earnings Dashboard</h1>
          <p className="text-gray-400">Overview of your company earnings</p>
        </div>
      </div>

      {/* Earnings Summary Cards (Direct motion.div) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* Total Revenue */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{
            scale: 1.05,
            y: -2,
            borderColor: "#05df72",
            borderWidth: "3px",
          }}
          transition={{ type: "spring", stiffness: 300 }}
          className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-md border border-gray-700 rounded-2xl p-6 shadow-md"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Revenue</p>
              <p className="text-2xl font-bold text-white mt-1">₹ {totalRevenue.toFixed(2)}</p>
            </div>
            <div className="w-12 h-12 bg-green-400/10 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </motion.div>

        {/* Platform Commission */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{
            scale: 1.05,
            y: -2,
            borderColor: "#F87171",
            borderWidth: "3px",
          }}
          transition={{ type: "spring", stiffness: 300 }}
          className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-md border border-gray-700 rounded-2xl p-6 shadow-md"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Platform Commission (10%)</p>
              <p className="text-2xl font-bold text-white mt-1">₹ {platformCommission.toFixed(2)}</p>
            </div>
            <div className="w-12 h-12 bg-red-400/10 rounded-lg flex items-center justify-center">
              <PieChart className="w-6 h-6 text-red-400" />
            </div>
          </div>
        </motion.div>

        {/* Net Earnings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{
            scale: 1.05,
            y: -2,
            borderColor: "#3B82F6",
            borderWidth: "3px",
          }}
          transition={{ type: "spring", stiffness: 300 }}
          className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-md border border-gray-700 rounded-2xl p-6 shadow-md"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Net Earnings</p>
              <p className="text-2xl font-bold text-white mt-1">₹ {netEarnings.toFixed(2)}</p>
            </div>
            <div className="w-12 h-12 bg-blue-400/10 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </motion.div>

        {/* Avg. Per Booking */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{
            scale: 1.05,
            y: -2,
            borderColor: "#A855F7",
            borderWidth: "3px",
          }}
          transition={{ type: "spring", stiffness: 300 }}
          className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-md border border-gray-700 rounded-2xl p-6 shadow-md"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Avg. per Booking</p>
              <p className="text-2xl font-bold text-white mt-1">₹ {avgPerBooking.toFixed(2)}</p>
            </div>
            <div className="w-12 h-12 bg-purple-400/10 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-purple-400" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Station Performance Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ }}
        className="bg-gray-900 border border-gray-600 rounded-xl p-6"
      >
        <h2 className="text-lg font-semibold text-white mb-6">Station Performance</h2>

        {stationStats.length === 0 ? (
          <p className="text-gray-400">No stations registered yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {stationStats.map((station, index) => (
              <motion.div
                key={station.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02, y: -3, borderColor: `${getBorderColor(station.status)}`, borderWidth: "2px"}}
                transition={{ type: "spring", stiffness: 300 }}
                className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-md border border-gray-700 rounded-2xl p-6 shadow-md"
              >
                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                  {(() => {
                    const StatusIcon = getStatusIcon(station.status);
                    return (
                      <span className={`text-sm px-3 py-1 rounded-full flex items-center gap-1 ${getStatusColor(station.status)} border`}>
                        <StatusIcon className="w-4 h-4" />
                        {station.status.toUpperCase()}
                      </span>
                    );
                  })()}
                </div>

                {/* Station Info */}
                <div className="mb-4">
                  <p className="text-gray-400 text-sm">Station</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Building2 className="w-4 h-4 text-blue-400" />
                    <p className="text-white font-semibold">{station.name}</p>
                  </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
                  <div>
                    <p className="text-gray-400 mb-1">Address</p>
                    <div className="flex items-center gap-1 text-white">
                      <MapPin className="w-4 h-4 text-yellow-400" />
                      <span>{station.address || "N/A"}, {station.city || "N/A"}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-400 mb-1">Completed Bookings</p>
                    <div className="flex items-center gap-1 text-white">
                      <Calendar className="w-4 h-4 text-blue-400" />
                      <span>{station.completedBookings}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-400 mb-1">Revenue</p>
                    <div className="flex items-center gap-1 text-green-400 font-medium">
                      <DollarSign className="w-4 h-4" />
                      ₹ {station.revenue.toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-400 mb-1">Avg. per Booking</p>
                    <div className="flex items-center gap-1 text-purple-400 font-medium">
                      <PieChart className="w-4 h-4" />
                      ₹ {station.avgPerBooking.toFixed(2)}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

    </div>
  )
}

export default Earnings
