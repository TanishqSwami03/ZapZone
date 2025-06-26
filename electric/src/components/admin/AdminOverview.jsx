"use client"

import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import {
  Building2,
  Users,
  BarChart3,
  CheckCircle,
  DollarSign,
  MapPin,
  Shield,
  Building2Icon
} from "lucide-react"

import { collection, onSnapshot } from "firebase/firestore"
import { db } from "../../firebase/firebaseConfig"
import { useNavigate } from "react-router-dom"

const AdminOverview = () => {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [stations, setStations] = useState([])
  const [bookings, setBookings] = useState([])
  const [companies, setCompanies] = useState([])

  useEffect(() => {
    const unsubUsers = onSnapshot(collection(db, "users"), snapshot =>
      setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    )
    const unsubStations = onSnapshot(collection(db, "stations"), snapshot =>
      setStations(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    )
    const unsubBookings = onSnapshot(collection(db, "bookings"), snapshot =>
      setBookings(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    )
    const unsubCompanies = onSnapshot(collection(db, "companies"), snapshot =>
      setCompanies(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    )
    return () => {
      unsubUsers()
      unsubStations()
      unsubBookings()
      unsubCompanies()
    }
  }, [])

  const totalUsers = users.length
  const totalCompanies = companies.length
  const totalStations = stations.length
  const totalRevenue = bookings
  .filter(b => b.status === "completed")
  .reduce((sum, b) => sum + (b.cost || 0), 0)

  const timeAgo = seconds => {
    const diff = Math.floor(Date.now() / 1000) - seconds
    if (diff < 60) return `${diff}s ago`
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    return `${Math.floor(diff / 86400)}d ago`
  }

  const recentActivity = useMemo(() => {
    const combined = [
      ...users.map(u => ({
        createdAt: u.createdAt?.seconds || 0,
        message: u.type === "company" ? "New company registered" : "New user joined",
        icon: u.type === "company" ? Building2 : Users,
        color: "purple",
      })),
      ...stations.map(s => ({
        createdAt: s.createdAt?.seconds || 0,
        message: `Station "${s.name}" registered`,
        icon: MapPin,
        color: "blue",
      })),
      ...bookings.map(b => ({
        createdAt: b.createdAt?.seconds || 0,
        message: "Charging session completed",
        icon: CheckCircle,
        color: "yellow",
      })),
    ]
    return combined
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 5)
      .map(entry => ({
        ...entry,
        time: timeAgo(entry.createdAt),
      }))
  }, [users, stations, bookings])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-xl bg-purple-400/10 flex items-center justify-center">
          <Shield className="w-7 h-7 text-purple-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
          <p className="text-gray-400">System Administration & Oversight</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* Total Stations */}
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
              <p className="text-gray-400 text-sm">Total Stations</p>
              <p className="text-2xl font-bold text-white mt-1">{totalStations}</p>
            </div>
            <div className="w-12 h-12 bg-blue-400/10 rounded-lg flex items-center justify-center">
              <MapPin className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </motion.div>

        {/* Total Companies */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{
            scale: 1.05,
            y: -2,
            borderColor: "#FACC15",
            borderWidth: "3px",
          }}
          transition={{ type: "spring", stiffness: 300 }}
          className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-md border border-gray-700 rounded-2xl p-6 shadow-md"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Companies</p>
              <p className="text-2xl font-bold text-white mt-1">{totalCompanies}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-400/10 rounded-lg flex items-center justify-center">
              <Building2Icon className="w-6 h-6 text-yellow-400" />
            </div>
          </div>
        </motion.div>

        {/* Total Users */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{
            scale: 1.05,
            y: -2,
            borderColor: "#10B981",
            borderWidth: "3px",
          }}
          transition={{ type: "spring", stiffness: 300 }}
          className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-md border border-gray-700 rounded-2xl p-6 shadow-md"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Users</p>
              <p className="text-2xl font-bold text-white mt-1">{totalUsers}</p>
            </div>
            <div className="w-12 h-12 bg-green-400/10 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </motion.div>

        {/* Total Revenue */}
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
              <p className="text-gray-400 text-sm">Total Revenue</p>
              <p className="text-2xl font-bold text-white mt-1">₹ {totalRevenue.toFixed(0)}</p>
            </div>
            <div className="w-12 h-12 bg-purple-400/10 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-purple-400" />
            </div>
          </div>
        </motion.div>
        
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-10 py-4">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-md border border-gray-700 rounded-2xl p-6 shadow-md"
        >
          <h3 className="text-lg font-semibold text-white mb-6">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { title: "Review Stations", icon: Building2, color: "blue", path: "/admin/stations" },
              { title: "Manage Users", icon: Users, color: "green", path: "/admin/users" },
              { title: "View Companies", icon: Building2, color: "purple", path: "/admin/companies" },
              { title: "View Reports", icon: BarChart3, color: "yellow", path: "/admin/reports" }
            ].map((action, index) => (
              <motion.button
                key={action.title}
                whileHover={{ scale: 1.05 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => navigate(action.path)}
                className={`flex flex-col items-center justify-center p-6 rounded-xl border border-gray-700 bg-gray-900 hover:bg-gray-800 transition-all`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${
                  action.color === "blue" ? "bg-blue-400/10" :
                  action.color === "green" ? "bg-green-400/10" :
                  action.color === "purple" ? "bg-purple-400/10" :
                  action.color === "yellow" ? "bg-yellow-400/10" : ""
                }`}>
                  <action.icon
                    className={`w-6 h-6 ${
                      action.color === "blue" ? "text-blue-400" :
                      action.color === "green" ? "text-green-400" :
                      action.color === "purple" ? "text-purple-400" :
                      action.color === "yellow" ? "text-yellow-400" : ""
                    }`}
                  />
                </div>
                <span className="text-sm text-white text-center font-medium">{action.title}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-md border border-gray-700 rounded-2xl p-6 shadow-md"
        >
          <h3 className="text-lg font-semibold text-white mb-6">Recent Activity</h3>
          <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
            {recentActivity.length === 0 ? (
              <p className="text-gray-400 text-sm">No recent activity.</p>
            ) : (
              recentActivity.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700/50 transition-colors"
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    activity.color === "blue" ? "bg-blue-400/10" :
                    activity.color === "green" ? "bg-green-400/10" :
                    activity.color === "purple" ? "bg-purple-400/10" :
                    activity.color === "yellow" ? "bg-yellow-400/10" : ""
                  }`}>
                    <activity.icon
                      className={`w-5 h-5 ${
                        activity.color === "blue" ? "text-blue-400" :
                        activity.color === "green" ? "text-green-400" :
                        activity.color === "purple" ? "text-purple-400" :
                        activity.color === "yellow" ? "text-yellow-400" : ""
                      }`}
                    />
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

    </div>
  )
}

export default AdminOverview
