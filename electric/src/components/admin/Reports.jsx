"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { BarChart3, TrendingUp, DollarSign, Users, Building2, Zap, Download, Calendar } from "lucide-react"

const Reports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const [selectedMetric, setSelectedMetric] = useState("revenue")

  const periodOptions = [
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
    { value: "quarter", label: "This Quarter" },
    { value: "year", label: "This Year" },
  ]

  const metricOptions = [
    { value: "revenue", label: "Revenue" },
    { value: "bookings", label: "Bookings" },
    { value: "users", label: "User Growth" },
    { value: "stations", label: "Station Growth" },
  ]

  // Mock analytics data
  const platformStats = {
    totalRevenue: 45680.5,
    platformCommission: 6852.08,
    totalBookings: 1247,
    activeUsers: 892,
    activeStations: 156,
    averageBookingValue: 36.64,
  }

  const monthlyData = [
    { month: "Jan", revenue: 3200, bookings: 89, users: 45, stations: 12 },
    { month: "Feb", revenue: 4100, bookings: 112, users: 67, stations: 18 },
    { month: "Mar", revenue: 3800, bookings: 98, users: 52, stations: 15 },
    { month: "Apr", revenue: 4500, bookings: 125, users: 78, stations: 22 },
    { month: "May", revenue: 5200, bookings: 142, users: 89, stations: 28 },
    { month: "Jun", revenue: 6100, bookings: 168, users: 94, stations: 35 },
  ]

  const topStations = [
    { name: "Tesla Supercharger Downtown", revenue: 2340, bookings: 89, rating: 4.8 },
    { name: "EV Hub Mall Plaza", revenue: 1890, bookings: 67, rating: 4.5 },
    { name: "GreenCharge Highway Stop", revenue: 1650, bookings: 54, rating: 4.2 },
    { name: "PowerPoint City Center", revenue: 1420, bookings: 48, rating: 4.6 },
    { name: "ElectroStation Park", revenue: 1280, bookings: 42, rating: 4.4 },
  ]

  const userGrowth = {
    newUsers: 94,
    newCompanies: 8,
    churnRate: 2.3,
    retentionRate: 87.5,
  }

  const getChartData = () => {
    return monthlyData.map((data) => ({
      ...data,
      value: data[selectedMetric],
    }))
  }

  const getMaxValue = () => {
    const data = getChartData()
    return Math.max(...data.map((d) => d.value))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Analytics & Reports</h1>
          <p className="text-gray-400">Platform performance and business insights</p>
        </div>

        <div className="mt-4 sm:mt-0 flex space-x-2">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-400"
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
            className="flex items-center px-4 py-2 bg-purple-400/10 text-purple-400 border border-purple-400/20 rounded-lg hover:bg-purple-400/20 transition-all duration-200"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </motion.button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 border border-gray-700 rounded-xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Revenue</p>
              <p className="text-xl font-bold text-white">${platformStats.totalRevenue.toLocaleString()}</p>
              <p className="text-green-400 text-sm mt-1">+15.3%</p>
            </div>
            <div className="w-10 h-10 bg-green-400/10 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-400" />
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
              <p className="text-gray-400 text-sm">Commission</p>
              <p className="text-xl font-bold text-white">${platformStats.platformCommission.toLocaleString()}</p>
              <p className="text-blue-400 text-sm mt-1">15% of revenue</p>
            </div>
            <div className="w-10 h-10 bg-blue-400/10 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-400" />
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
              <p className="text-gray-400 text-sm">Total Bookings</p>
              <p className="text-xl font-bold text-white">{platformStats.totalBookings.toLocaleString()}</p>
              <p className="text-purple-400 text-sm mt-1">+8.7%</p>
            </div>
            <div className="w-10 h-10 bg-purple-400/10 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-purple-400" />
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
              <p className="text-gray-400 text-sm">Active Users</p>
              <p className="text-xl font-bold text-white">{platformStats.activeUsers}</p>
              <p className="text-green-400 text-sm mt-1">+12.1%</p>
            </div>
            <div className="w-10 h-10 bg-yellow-400/10 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-yellow-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-800 border border-gray-700 rounded-xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active Stations</p>
              <p className="text-xl font-bold text-white">{platformStats.activeStations}</p>
              <p className="text-blue-400 text-sm mt-1">+18.9%</p>
            </div>
            <div className="w-10 h-10 bg-orange-400/10 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-orange-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gray-800 border border-gray-700 rounded-xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Avg. Booking</p>
              <p className="text-xl font-bold text-white">${platformStats.averageBookingValue}</p>
              <p className="text-green-400 text-sm mt-1">+5.2%</p>
            </div>
            <div className="w-10 h-10 bg-pink-400/10 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-pink-400" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gray-800 border border-gray-700 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Performance Trends</h2>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="px-3 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:border-purple-400"
            >
              {metricOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="h-64 flex items-end justify-between space-x-2">
            {getChartData().map((data, index) => (
              <div key={data.month} className="flex-1 flex flex-col items-center">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(data.value / getMaxValue()) * 100}%` }}
                  transition={{ delay: index * 0.1 }}
                  className="w-full bg-gradient-to-t from-purple-400 to-blue-400 rounded-t mb-2"
                />
                <span className="text-gray-400 text-xs">{data.month}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top Stations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-gray-800 border border-gray-700 rounded-xl p-6"
        >
          <h2 className="text-lg font-semibold text-white mb-6">Top Performing Stations</h2>

          <div className="space-y-4">
            {topStations.map((station, index) => (
              <motion.div
                key={station.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 bg-gray-700 rounded-lg"
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-purple-400/10 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-purple-400 font-bold text-sm">{index + 1}</span>
                  </div>
                  <div>
                    <h3 className="text-white font-medium text-sm">{station.name}</h3>
                    <p className="text-gray-400 text-xs">
                      {station.bookings} bookings • ⭐ {station.rating}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-medium">${station.revenue}</p>
                  <p className="text-gray-400 text-xs">Revenue</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* User Growth & Retention */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-gray-800 border border-gray-700 rounded-xl p-6"
      >
        <h2 className="text-lg font-semibold text-white mb-6">User Growth & Retention</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-400/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Users className="w-8 h-8 text-green-400" />
            </div>
            <p className="text-2xl font-bold text-white">{userGrowth.newUsers}</p>
            <p className="text-gray-400 text-sm">New Users</p>
            <p className="text-green-400 text-xs mt-1">This month</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-blue-400/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Building2 className="w-8 h-8 text-blue-400" />
            </div>
            <p className="text-2xl font-bold text-white">{userGrowth.newCompanies}</p>
            <p className="text-gray-400 text-sm">New Companies</p>
            <p className="text-blue-400 text-xs mt-1">This month</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-red-400/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-8 h-8 text-red-400" />
            </div>
            <p className="text-2xl font-bold text-white">{userGrowth.churnRate}%</p>
            <p className="text-gray-400 text-sm">Churn Rate</p>
            <p className="text-red-400 text-xs mt-1">Monthly</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-purple-400/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <BarChart3 className="w-8 h-8 text-purple-400" />
            </div>
            <p className="text-2xl font-bold text-white">{userGrowth.retentionRate}%</p>
            <p className="text-gray-400 text-sm">Retention Rate</p>
            <p className="text-purple-400 text-xs mt-1">90-day</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Reports
