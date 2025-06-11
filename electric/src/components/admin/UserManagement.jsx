"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Users, Search, MoreHorizontal, Ban, CheckCircle, Mail, Phone } from "lucide-react"
import ConfirmModal from "../modals/ConfirmModal"
import UserActionsModal from "../modals/UserActionsModal"

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("")
  const [showSuspendModal, setShowSuspendModal] = useState(false)
  const [showActivateModal, setShowActivateModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showActionsModal, setShowActionsModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  // Mock user data (only individual users, no companies)
  const users = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      phone: "+1 (555) 123-4567",
      status: "active",
      joinDate: "2024-01-15",
      lastActive: "2024-01-20",
      bookings: 12,
      totalSpent: 245.5,
    },
    {
      id: 3,
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "+1 (555) 456-7890",
      status: "suspended",
      joinDate: "2024-01-10",
      lastActive: "2024-01-18",
      bookings: 5,
      totalSpent: 89.25,
    },
    {
      id: 6,
      name: "Mike Johnson",
      email: "mike@example.com",
      phone: "+1 (555) 789-0123",
      status: "active",
      joinDate: "2024-01-12",
      lastActive: "2024-01-19",
      bookings: 8,
      totalSpent: 156.75,
    },
    {
      id: 7,
      name: "Sarah Wilson",
      email: "sarah@example.com",
      phone: "+1 (555) 234-5678",
      status: "active",
      joinDate: "2024-01-08",
      lastActive: "2024-01-20",
      bookings: 15,
      totalSpent: 320.0,
    },
  ]

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

  const confirmSuspend = () => {
    // Update user status logic here
    setShowSuspendModal(false)
    setSelectedUser(null)
  }

  const confirmActivate = () => {
    // Update user status logic here
    setShowActivateModal(false)
    setSelectedUser(null)
  }

  const confirmDelete = () => {
    // Delete user logic here
    setShowDeleteModal(false)
    setSelectedUser(null)
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 border border-gray-700 rounded-xl p-6"
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-800 border border-gray-700 rounded-xl p-6"
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800 border border-gray-700 rounded-xl p-6"
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
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
            />
          </div>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-400"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Users List */}
      <div className="space-y-4">
        {filteredUsers.map((user, index) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-all duration-300"
          >
            {/* Status badge - top-right */}
            <div
              className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm border ${getStatusColor(user.status)}`}
            >
              {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
            </div>

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              {/* Left: User info & stats */}
              <div className="flex-1">
                {/* Header: Avatar + name/email */}
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-400/10 rounded-lg flex items-center justify-center mr-4">
                    <Users className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">{user.name}</h3>
                    <div className="flex items-center text-gray-400 text-sm">
                      <Mail className="w-4 h-4 mr-1" />
                      {user.email}
                    </div>
                  </div>
                </div>

                {/* Grid Info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Phone</p>
                    <div className="flex items-center text-sm">
                      <Phone className="w-3 h-3 mr-1 text-gray-400" />
                      <span className="text-white">{user.phone}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Join Date</p>
                    <p className="text-white font-medium">{user.joinDate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Last Active</p>
                    <p className="text-white font-medium">{user.lastActive}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Bookings</p>
                    <p className="text-white font-medium">{user.bookings}</p>
                  </div>
                </div>

                {/* Total Spent */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Total Spent</p>
                    <p className="text-green-400 font-medium">${user.totalSpent.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              {/* Right: Actions */}
              <div className="mt-4 lg:mt-0 lg:ml-6 flex space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleUserActions(user)}
                  className="flex items-center px-3 py-2 bg-purple-400/10 text-purple-400 border border-purple-400/20 rounded-lg hover:bg-purple-400/20 transition-all duration-200"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </motion.button>

                {user.status === "active" && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSuspend(user)}
                    className="flex items-center px-3 py-2 bg-red-400/10 text-red-400 border border-red-400/20 rounded-lg hover:bg-red-400/20 transition-all duration-200"
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
                    className="flex items-center px-3 py-2 bg-green-400/10 text-green-400 border border-green-400/20 rounded-lg hover:bg-green-400/20 transition-all duration-200"
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Activate
                  </motion.button>
                )}
              </div>
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
