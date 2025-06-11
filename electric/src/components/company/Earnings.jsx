"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { DollarSign, TrendingUp, Calendar, PieChart, Download, Building2 } from "lucide-react"
import { useUser } from "../../context/UserContext"

const Earnings = () => {
  const { bookings, stations } = useUser()
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const [selectedStation, setSelectedStation] = useState("")

  // Filter for company stations and bookings
  const companyStations = stations.filter((station) => station.companyId === 1)
  const companyStationIds = companyStations.map((station) => station.id)
  const companyBookings = bookings.filter(
    (booking) => companyStationIds.includes(booking.stationId) && booking.status === "completed",
  )

  const periodOptions = [
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
    { value: "quarter", label: "This Quarter" },
    { value: "year", label: "This Year" },
  ]

  // Calculate earnings
  const totalRevenue = companyBookings.reduce((sum, booking) => sum + booking.cost, 0)
  const platformCommission = totalRevenue * 0.15 // 15% platform fee
  const netEarnings = totalRevenue - platformCommission

  // Mock data for charts and trends
  const monthlyData = [
    { month: "Jan", revenue: 1250, bookings: 45 },
    { month: "Feb", revenue: 1680, bookings: 62 },
    { month: "Mar", revenue: 2100, bookings: 78 },
    { month: "Apr", revenue: 1890, bookings: 69 },
    { month: "May", revenue: 2340, bookings: 85 },
    { month: "Jun", revenue: 2650, bookings: 94 },
  ]

  const stationEarnings = companyStations
    .map((station) => {
      const stationBookings = companyBookings.filter((booking) => booking.stationId === station.id)
      const revenue = stationBookings.reduce((sum, booking) => sum + booking.cost, 0)
      return {
        ...station,
        revenue,
        bookings: stationBookings.length,
      }
    })
    .sort((a, b) => b.revenue - a.revenue)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Earnings Dashboard</h1>
          <p className="text-gray-400">Track your revenue and financial performance</p>
        </div>

        <div className="mt-4 sm:mt-0 flex space-x-2">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-400"
          >
            {periodOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center px-4 py-2 bg-blue-400/10 text-blue-400 border border-blue-400/20 rounded-lg hover:bg-blue-400/20 transition-all duration-200"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </motion.button>
        </div>
      </div>

      {/* Revenue Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 border border-gray-700 rounded-xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Revenue</p>
              <p className="text-2xl font-bold text-white">${totalRevenue.toFixed(2)}</p>
              <p className="text-green-400 text-sm mt-1">+12.5% from last month</p>
            </div>
            <div className="w-12 h-12 bg-green-400/10 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-400" />
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
              <p className="text-gray-400 text-sm">Platform Commission</p>
              <p className="text-2xl font-bold text-white">${platformCommission.toFixed(2)}</p>
              <p className="text-gray-400 text-sm mt-1">15% of total revenue</p>
            </div>
            <div className="w-12 h-12 bg-red-400/10 rounded-lg flex items-center justify-center">
              <PieChart className="w-6 h-6 text-red-400" />
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
              <p className="text-gray-400 text-sm">Net Earnings</p>
              <p className="text-2xl font-bold text-white">${netEarnings.toFixed(2)}</p>
              <p className="text-blue-400 text-sm mt-1">After platform fees</p>
            </div>
            <div className="w-12 h-12 bg-blue-400/10 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-400" />
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
              <p className="text-gray-400 text-sm">Avg. per Booking</p>
              <p className="text-2xl font-bold text-white">
                ${companyBookings.length > 0 ? (totalRevenue / companyBookings.length).toFixed(2) : "0.00"}
              </p>
              <p className="text-purple-400 text-sm mt-1">Revenue efficiency</p>
            </div>
            <div className="w-12 h-12 bg-purple-400/10 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-purple-400" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Revenue Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gray-800 border border-gray-700 rounded-xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-white">Revenue Trend</h2>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-400 rounded-full mr-2"></div>
              <span className="text-gray-400">Revenue</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
              <span className="text-gray-400">Bookings</span>
            </div>
          </div>
        </div>

        <div className="h-64 flex items-end justify-between space-x-2">
          {monthlyData.map((data, index) => (
            <div key={data.month} className="flex-1 flex flex-col items-center">
              <div className="w-full flex flex-col items-center space-y-1 mb-2">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(data.revenue / 3000) * 100}%` }}
                  transition={{ delay: index * 0.1 }}
                  className="w-8 bg-blue-400 rounded-t"
                />
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(data.bookings / 100) * 100}%` }}
                  transition={{ delay: index * 0.1 + 0.05 }}
                  className="w-4 bg-green-400 rounded-t"
                />
              </div>
              <span className="text-gray-400 text-xs">{data.month}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Station Performance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gray-800 border border-gray-700 rounded-xl p-6"
      >
        <h2 className="text-lg font-semibold text-white mb-6">Station Performance</h2>

        <div className="space-y-4">
          {stationEarnings.map((station, index) => (
            <motion.div
              key={station.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 bg-gray-700 rounded-lg"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-400/10 rounded-lg flex items-center justify-center mr-4">
                  <Building2 className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-white font-medium">{station.name}</h3>
                  <p className="text-gray-400 text-sm">{station.location}</p>
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <div className="text-right">
                  <p className="text-white font-medium">${station.revenue.toFixed(2)}</p>
                  <p className="text-gray-400 text-sm">Revenue</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-medium">{station.bookings}</p>
                  <p className="text-gray-400 text-sm">Bookings</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-medium">
                    ${station.bookings > 0 ? (station.revenue / station.bookings).toFixed(2) : "0.00"}
                  </p>
                  <p className="text-gray-400 text-sm">Avg/Booking</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Payment Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gray-800 border border-gray-700 rounded-xl p-6"
      >
        <h2 className="text-lg font-semibold text-white mb-6">Payment Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-white font-medium mb-4">Next Payout</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Amount</span>
                <span className="text-white font-medium">${netEarnings.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Date</span>
                <span className="text-white font-medium">Jan 31, 2024</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Method</span>
                <span className="text-white font-medium">Bank Transfer</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-white font-medium mb-4">Payout History</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Dec 2023</span>
                <span className="text-green-400">+$2,150.00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Nov 2023</span>
                <span className="text-green-400">+$1,890.00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Oct 2023</span>
                <span className="text-green-400">+$2,340.00</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Earnings
