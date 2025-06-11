"use client"

import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import {
  Building2,
  Users,
  BarChart3,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  MapPin,
  Shield,
  Building2Icon,
  Zap,
} from "lucide-react"
import { useUser } from "../../context/UserContext"
import { useMemo } from "react"

const AdminOverview = () => {
  const navigate = useNavigate()
  const { stations, users, bookings } = useUser()

  const totalUsers = users.filter((u) => u.type === "user").length
  const totalCompanies = users.filter((u) => u.type === "company").length
  const totalStations = stations.length
  const totalRevenue = bookings.reduce((sum, b) => sum + (b.cost || 0), 0)

  const quickStats = [
    { title: "Total Stations", value: totalStations, icon: MapPin, color: "blue" },
    { title: "Total Companies", value: totalCompanies, icon: Building2Icon, color: "yellow" },
    { title: "Total Users", value: totalUsers, icon: Users, color: "green" },
    { title: "Total Revenue", value: `₹ ${totalRevenue.toFixed(0)}`, icon: DollarSign, color: "purple" },
  ]

  // 🔥 Real Recent Activity (Top 5 recent entities)
  const recentActivity = useMemo(() => {
    const combined = [
      ...users.map((u) => ({
        createdAt: u.createdAt?.seconds || 0,
        message: u.type === "company" ? "New company registered" : "New user joined",
        icon: u.type === "company" ? Building2 : Users,
        color: u.type === "company" ? "purple" : "green",
      })),
      ...stations.map((s) => ({
        createdAt: s.createdAt?.seconds || 0,
        message: `Station "${s.name}" registered`,
        icon: MapPin,
        color: "blue",
      })),
      ...bookings.map((b) => ({
        createdAt: b.createdAt?.seconds || 0,
        message: "Charging session completed",
        icon: CheckCircle,
        color: "yellow",
      })),
    ]

    return combined
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 5)
      .map((entry) => ({
        ...entry,
        time: timeAgo(entry.createdAt),
      }))
  }, [users, stations, bookings])

  const quickActions = [
    { title: "Review Stations", icon: Building2, color: "blue", path: "/admin/stations" },
    { title: "Manage Users", icon: Users, color: "green", path: "/admin/users" },
    { title: "View Companies", icon: Building2, color: "purple", path: "/admin/companies" },
    { title: "View Reports", icon: BarChart3, color: "yellow", path: "/admin/reports" },
  ]

  const getColorClasses = (color) => {
    const colors = {
      blue: "bg-blue-400/10 text-blue-400 border-blue-400/20 hover:bg-blue-400/20",
      green: "bg-green-400/10 text-green-400 border-green-400/20 hover:bg-green-400/20",
      purple: "bg-purple-400/10 text-purple-400 border-purple-400/20 hover:bg-purple-400/20",
      yellow: "bg-yellow-400/10 text-yellow-400 border-yellow-400/20 hover:bg-yellow-400/20",
      red: "bg-red-400/10 text-red-400 border-red-400/20 hover:bg-red-400/20",
    }
    return colors[color] || colors.blue
  }

  const getIconBgColor = (color) => {
    const colors = {
      blue: "bg-blue-400/10",
      green: "bg-green-400/10",
      purple: "bg-purple-400/10",
      yellow: "bg-yellow-400/10",
      red: "bg-red-400/10",
    }
    return colors[color] || colors.blue
  }

  const getIconColor = (color) => {
    const colors = {
      blue: "text-blue-400",
      green: "text-green-400",
      purple: "text-purple-400",
      yellow: "text-yellow-400",
      red: "text-red-400",
    }
    return colors[color] || colors.blue
  }

  const timeAgo = (seconds) => {
    const diff = Math.floor(Date.now() / 1000) - seconds
    if (diff < 60) return `${diff} sec ago`
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`
    return `${Math.floor(diff / 86400)} day ago`
  }

  return (
    <div className="space-y-6 h-full overflow-hidden">
      {/* Welcome Header */}
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center mb-4"
        >
          <div className="w-16 h-16 bg-purple-400/10 rounded-2xl flex items-center justify-center mr-4">
            <Shield className="w-8 h-8 text-purple-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-gray-400">System Administration & Management</p>
          </div>
        </motion.div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileTap={{ scale: 0.97 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-900 border border-gray-700 rounded-2xl px-8 py-6 transform transition-all duration-300 hover:scale-[1.03] hover:shadow-lg hover:shadow-purple-500/10"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 ${getIconBgColor(stat.color)} rounded-lg flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${getIconColor(stat.color)}`} />
                </div>
                <div>
                  <p className={`text-lg font-semibold ${getIconColor(stat.color)}`}>{stat.title}</p>
                </div>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">{stat.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Two Column Layout for Quick Actions and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 pb-20">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 border border-gray-700 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-6">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            {quickActions.map((action, index) => (
              <motion.button
                key={action.title}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => navigate(action.path)}
                className={`flex flex-col items-center justify-center p-6 rounded-xl border transition-all duration-200 hover:scale-105 ${getColorClasses(action.color)}`}
              >
                <action.icon className={`w-8 h-8 mb-3 ${getIconColor(action.color)}`} />
                <span className="text-sm font-medium text-center">{action.title}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Real Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 border border-gray-700 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-6">Recent Activity</h3>
          <div className="space-y-4 max-h-80 overflow-y-auto">
            {recentActivity.length === 0 ? (
              <p className="text-gray-400 text-sm">No recent activity.</p>
            ) : (
              recentActivity.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700/50 transition-colors"
                >
                  <div className={`w-10 h-10 ${getIconBgColor(activity.color)} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <activity.icon className={`w-5 h-5 ${getIconColor(activity.color)}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{activity.message}</p>
                    <p className="text-gray-400 text-xs">{activity.time}</p>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>

      <footer className="text-center py-4 text-gray-500 text-sm border-t mt-8">
        © {new Date().getFullYear()} Your Company Name. All rights reserved.
      </footer>
    </div>
  )
}

export default AdminOverview
