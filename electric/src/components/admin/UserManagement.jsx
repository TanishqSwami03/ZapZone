"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Users, Search, MoreHorizontal, Ban, CheckCircle, Mail, Phone, User } from "lucide-react"
import ConfirmModal from "../modals/ConfirmModal"
import UserActionsModal from "../modals/UserActionsModal"
import { collection, onSnapshot, updateDoc, doc } from "firebase/firestore"
import { db } from "../../firebase/firebaseConfig"

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("")
  const [showSuspendModal, setShowSuspendModal] = useState(false)
  const [showActivateModal, setShowActivateModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showActionsModal, setShowActionsModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  const [users, setUsers] = useState([])
  
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "users"), (snapshot) => {
      const userData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      setUsers(userData)
    })

    return () => unsub()
  }, [])

  const statusOptions = [
    { value: "", label: "All Statuses" },
    { value: "active", label: "Active" },
    { value: "suspended", label: "Suspended" },
  ]

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = !selectedStatus || user.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "text-green-400 bg-green-400/10 border-green-400/20"
      case "suspended":
        return "text-red-400 bg-red-400/10 border-red-400/20"
      default:
        return "text-gray-400 bg-gray-400/10 border-gray-400/20"
    }
  }

  const handleUserActions = (user) => {
    setSelectedUser(user)
    setShowActionsModal(true)
  }

  const handleSuspend = (user) => {
    setSelectedUser(user)
    setShowSuspendModal(true)
  }

  const handleActivate = (user) => {
    setSelectedUser(user)
    setShowActivateModal(true)
  }

  const handleDelete = (user) => {
    setSelectedUser(user)
    setShowDeleteModal(true)
  }

  const confirmSuspend = async () => {
    await updateDoc(doc(db, "users", selectedUser.id), {
      status: "suspended",
    })
    setShowSuspendModal(false)
    setSelectedUser(null)
  }

  const confirmActivate = async () => {
    await updateDoc(doc(db, "users", selectedUser.id), {
      status: "active",
    })
    setShowActivateModal(false)
    setSelectedUser(null)
  }

  const confirmDelete = () => {
    setShowDeleteModal(false)
    setSelectedUser(null)
  }

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

  const totalUsers = users.length
  const activeUsers = users.filter((u) => u.status === "active").length
  const suspendedUsers = users.filter((u) => u.status === "suspended").length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Individual Users</h1>
          <p className="text-gray-400">Manage individual user accounts and their activities</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        {/* Total Users */}
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
              <p className="text-gray-400 text-sm">Total Users</p>
              <p className="text-2xl font-bold text-white">{totalUsers}</p>
            </div>
            <div className="w-12 h-12 bg-blue-400/10 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </motion.div>

        {/* Active Users */}
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
              <p className="text-gray-400 text-sm">Active Users</p>
              <p className="text-2xl font-bold text-white">{activeUsers}</p>
            </div>
            <div className="w-12 h-12 bg-green-400/10 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </motion.div>

        {/* Suspended */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{
            scale: 1.05,
            y: -2,
            borderColor: "#ff6467",
            borderWidth: "3px",
          }}
          transition={{ type: "spring", stiffness: 300 }}
          className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-md border border-gray-700 rounded-2xl p-6 shadow-md"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Suspended</p>
              <p className="text-2xl font-bold text-white">{suspendedUsers}</p>
            </div>
            <div className="w-12 h-12 bg-red-400/10 rounded-lg flex items-center justify-center">
              <Ban className="w-6 h-6 text-red-400" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
        className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-full md:w-1/2"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="relative"
          >
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
            />
          </motion.div>

          {/* Filter */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25, type: "spring", stiffness: 200 }}
          >
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 w-full bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-400"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </motion.div>
        </div>
      </motion.div>

      {/* Users List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 py-3">
        {filteredUsers.map((user, index) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{
              scale: 1.05,
              y: -2,
              borderColor: getBorderColor(user.status), // Assuming you have a similar helper
              borderWidth: "3px",
            }}
            transition={{ type: "spring", stiffness: 300 }}
            className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-md border border-gray-700 rounded-2xl p-6 shadow-md"
          >
            {/* Header: Name + Status */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-400/10 rounded-lg flex items-center justify-center mr-4">
                  <User className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">{user.name}</h3>
                  <div className="flex items-center text-gray-400 text-sm">
                    <Mail className="w-4 h-4 mr-1" />
                    {user.email}
                  </div>
                </div>
              </div>
              <div
                className={`px-3 py-1 rounded-full text-sm border ${getStatusColor(user.status)}`}
              >
                {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
              </div>
            </div>

            {/* Info Grid 1: Phone, Join Date, Bookings */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center p-3 bg-gray-800 rounded-lg">
                <p className="text-xs text-gray-400 mb-1">Phone</p>
                <p className="text-sm font-bold text-white">{user.phone}</p>
              </div>
              <div className="text-center p-3 bg-gray-800 rounded-lg">
                <p className="text-xs text-gray-400 mb-1">Join Date</p>
                <p className="text-sm font-bold text-white">
                  {new Date(user.joinDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <div className="text-center p-3 bg-gray-800 rounded-lg">
                <p className="text-xs text-gray-400 mb-1">Bookings</p>
                <p className="text-sm font-bold text-white">{user.bookings}</p>
              </div>
            </div>

            {/* Info Grid 2: Charging Hours, Total Spent */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center p-3 bg-gray-800 rounded-lg">
                <p className="text-xs text-gray-400 mb-1">Charging Hours</p>
                <p className="text-sm font-bold text-white">
                  {(() => {
                    const totalMin = user?.chargingHours ?? 0;
                    const hours = Math.floor(totalMin / 60);
                    const minutes = totalMin % 60;
                    return `${hours > 0 ? `${hours} h ` : ""}${minutes} min`;
                  })()}
                </p>
              </div>
              <div className="text-center p-3 bg-gray-800 rounded-lg">
                <p className="text-xs text-gray-400 mb-1">Total Spent</p>
                <p className="text-sm font-bold text-green-400">₹ {user.expenditure}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              {user.status === "active" && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSuspend(user)}
                  className="flex-1 flex items-center justify-center px-3 py-2 bg-red-400/10 text-red-400 border border-red-400/20 rounded-lg hover:bg-red-400/20 transition-all duration-200"
                >
                  <Ban className="w-4 h-4 mr-1" />
                  Suspend
                </motion.button>
              )}
              {user.status === "suspended" && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleActivate(user)}
                  className="flex-1 flex items-center justify-center px-3 py-2 bg-green-400/10 text-green-400 border border-green-400/20 rounded-lg hover:bg-green-400/20 transition-all duration-200"
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Activate
                </motion.button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* No Users */}
      {filteredUsers.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
          <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-400 mb-2">No users found</h3>
          <p className="text-gray-500">Try adjusting your search criteria or filters</p>
        </motion.div>
      )}

      {/* Modals */}
      <UserActionsModal
        isOpen={showActionsModal}
        onClose={() => setShowActionsModal(false)}
        user={selectedUser}
        onEdit={() => {
          setShowActionsModal(false)
          // Handle edit action
        }}
        onDelete={() => {
          setShowActionsModal(false)
          handleDelete(selectedUser)
        }}
        onSuspend={() => {
          setShowActionsModal(false)
          handleSuspend(selectedUser)
        }}
        onActivate={() => {
          setShowActionsModal(false)
          handleActivate(selectedUser)
        }}
      />

      <ConfirmModal
        isOpen={showSuspendModal}
        onClose={() => setShowSuspendModal(false)}
        onConfirm={confirmSuspend}
        title="Suspend User"
        message={`Are you sure you want to suspend "${selectedUser?.name}"? This will disable their access to the platform.`}
        confirmText="Suspend"
        confirmColor="red"
      />

      <ConfirmModal
        isOpen={showActivateModal}
        onClose={() => setShowActivateModal(false)}
        onConfirm={confirmActivate}
        title="Activate User"
        message={`Are you sure you want to activate "${selectedUser?.name}"? This will restore their access to the platform.`}
        confirmText="Activate"
        confirmColor="green"
      />

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete User"
        message={`Are you sure you want to permanently delete "${selectedUser?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        confirmColor="red"
      />
    </div>
  )
}

export default UserManagement
