"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { CheckCircle, XCircle, Clock, MapPin, Building2, AlertTriangle, Search, Ban, MoreVertical } from "lucide-react"
import ConfirmModal from "../modals/ConfirmModal"
import StationModerationModal from "../modals/StationModerationModal"
import { collection, onSnapshot, updateDoc, doc } from "firebase/firestore"
import { db } from "../../firebase/firebaseConfig"

const StationModeration = () => {
  const [selectedStatus, setSelectedStatus] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [showApproveModal, setShowApproveModal] = useState(false)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [showSuspendModal, setShowSuspendModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showActionsModal, setShowActionsModal] = useState(false)
  const [selectedStation, setSelectedStation] = useState(null)

  const [stations, setStations] = useState([])
  const [companies, setCompanies] = useState([])

  // Stations
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "stations"), (snapshot) => {
      if (!snapshot.empty && Array.isArray(snapshot.docs)) {
        const stationsData = snapshot.docs.map((doc) => {
          const data = doc.data() || {} // ⬅️ Ensure `data` is never undefined
          return {
            id: doc.id,
            ...data,
          }
        })
        setStations(stationsData)
      } else {
        setStations([]) // handle empty snapshot
      }
    })

    return () => unsub()
  }, [])

  // Company
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "companies"), (snapshot) => {
      const companiesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      setCompanies(companiesData)
    })

    return () => unsub()
  }, [])

  // Getting Company Name
  const getCompanyName = (companyId) => {
    const company = companies.find((c) => String(c.id) === String(companyId))
    return company ? company.name : "Unknown Company"
  }

  // Filter by status and search term
  const filteredStations = stations.filter((station) => {
    const matchesStatus = !selectedStatus || station.status === selectedStatus
    const matchesSearch =
      !searchTerm ||
      station.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      station.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getCompanyName(station.companyId).toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const statusOptions = [
    { value: "", label: "All Stations" },
    { value: "pending", label: "Pending Review" },
    { value: "active", label: "Approved" },
    { value: "rejected", label: "Rejected" },
    { value: "suspended", label: "Suspended" },
  ]

  // Update station status
  const updateStation = async (stationId, updatedData) => {
    const stationRef = doc(db, "stations", stationId)
    await updateDoc(stationRef, updatedData)
  }

  // Delete a station
  const deleteStation = async (stationId) => {
    const stationRef = doc(db, "stations", stationId)
    await deleteDoc(stationRef)
  } 

  const handleStationActions = (station) => {
    setSelectedStation(station)
    setShowActionsModal(true)
  }

  const handleApprove = (station) => {
    setSelectedStation(station)
    setShowApproveModal(true)
  }

  const handleReject = (station) => {
    setSelectedStation(station)
    setShowRejectModal(true)
  }

  const handleSuspend = (station) => {
    setSelectedStation(station)
    setShowSuspendModal(true)
  }

  const handleDelete = (station) => {
    setSelectedStation(station)
    setShowDeleteModal(true)
  }

  const confirmApprove = async () => {
    if (selectedStation) {
      await updateStation(selectedStation.id, { status: "active" })
      setShowApproveModal(false)
      setSelectedStation(null)
    }
  }

  const confirmReject = () => {
    if (selectedStation) {
      updateStation(selectedStation.id, { status: "rejected" })
      setShowRejectModal(false)
      setSelectedStation(null)
    }
  }

  const confirmSuspend = async () => {
    if (selectedStation) {
      await updateStation(selectedStation.id, { status: "suspended" })
      setShowSuspendModal(false)
      setSelectedStation(null)
    }
  }

  const confirmDelete = () => {
    if (selectedStation) {
      deleteStation(selectedStation.id)
      setShowDeleteModal(false)
      setSelectedStation(null)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return CheckCircle
      case "pending":
        return Clock
      case "rejected":
        return XCircle
      case "suspended":
        return Ban
      default:
        return AlertTriangle
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "text-green-400 bg-green-400/10 border-green-400/20"
      case "pending":
        return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20"
      case "rejected":
        return "text-red-400 bg-red-400/10 border-red-400/20"
      case "suspended":
        return "text-orange-400 bg-orange-400/10 border-orange-400/20"
      default:
        return "text-gray-400 bg-gray-400/10 border-gray-400/20"
    }
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

  const pendingCount = stations.filter((s) => s.status === "pending").length
  const activeCount = stations.filter((s) => s.status === "active").length
  const rejectedCount = stations.filter((s) => s.status === "rejected").length
  const suspendedCount = stations.filter((s) => s.status === "suspended").length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Station Moderation</h1>
          <p className="text-gray-400">Review and manage charging station submissions</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 250 }}
            className="relative w-full sm:w-64"
          >
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search stations or companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 w-full"
            />
          </motion.div>

          {/* Status Filter */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 250 }}
          >
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-400"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </motion.div>
        </motion.div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        {/* Total Stations */}
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
              <p className="text-gray-400 text-sm">Total Stations</p>
              <p className="text-2xl font-bold text-white">{stations.length}</p>
            </div>
            <div className="w-12 h-12 bg-purple-400/10 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-purple-400" />
            </div>
          </div>
        </motion.div>

        {/* Pending */}
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-800 border border-gray-700 rounded-xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Pending</p>
              <p className="text-2xl font-bold text-white">{pendingCount}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-400/10 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-400" />
            </div>
          </div>
        </motion.div> */}

        {/* Active */}
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
              <p className="text-gray-400 text-sm">Approved</p>
              <p className="text-2xl font-bold text-white">{activeCount}</p>
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
            borderColor: "#FACC15",
            borderWidth: "3px",
          }}
          transition={{ type: "spring", stiffness: 300 }}
          className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-md border border-gray-700 rounded-2xl p-6 shadow-md"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Suspended</p>
              <p className="text-2xl font-bold text-white">{suspendedCount}</p>
            </div>
            <div className="w-12 h-12 bg-orange-400/10 rounded-lg flex items-center justify-center">
              <Ban className="w-6 h-6 text-orange-400" />
            </div>
          </div>
        </motion.div>

        {/* Rejected */}
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-800 border border-gray-700 rounded-xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Rejected</p>
              <p className="text-2xl font-bold text-white">{rejectedCount}</p>
            </div>
            <div className="w-12 h-12 bg-red-400/10 rounded-lg flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-400" />
            </div>
          </div>
        </motion.div> */}
      </div>

      {/* Stations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 py-3">
        {filteredStations.map((station, index) => {
          const StatusIcon = getStatusIcon(station.status)
          return (
            <motion.div
              key={station.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{
                scale: 1.05,
                y: -2,
                borderColor: `${getBorderColor(station.status)}`,
                borderWidth: "3px",
              }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-md border border-gray-700 rounded-2xl p-6 shadow-md"
            >
              {/* Name, address, companyName, status */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-1">{station.name}</h3>
                  <div className="flex items-center text-gray-400 text-sm mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="truncate">{station.address}</span>
                  </div>
                  <p className="text-sm text-purple-400 font-medium">{getCompanyName(station.companyId)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`flex items-center px-2 py-1 rounded-full text-xs border ${getStatusColor(station.status)}`}
                  >
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {station.status.charAt(0).toUpperCase() + station.status.slice(1)}
                  </div>
                  <button
                    onClick={() => handleStationActions(station)}
                    className="p-1 text-gray-400 hover:text-white transition-colors"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Chargers, Vacant Chargers, Completed Bookings */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center p-3 bg-gray-800 rounded-lg">
                  <p className="text-xs text-gray-400 mb-1">Chargers</p>
                  <p className="text-sm font-bold text-white">
                    {station.chargers} 
                  </p>
                </div>
                <div className="text-center p-3 bg-gray-800 rounded-lg">
                  <p className="text-xs text-gray-400 mb-1">Vacant Chargers</p>
                  <p className="text-sm font-bold text-white">{station.vacantChargers}</p>
                </div>
                <div className="text-center p-3 bg-gray-800 rounded-lg">
                  <p className="text-xs text-gray-400 mb-1">Completed Bookings</p>
                  <p className="text-sm font-bold text-white">{station.completedBookings}</p>
                </div>
              </div>

              {/* Revenue, Rating */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center p-3 bg-gray-800 rounded-lg">
                  <p className="text-xs text-gray-400 mb-1">Revenue</p>
                  <p className="text-sm font-bold text-green-400">
                    ₹ {station.revenue} 
                  </p>
                </div>
                <div className="text-center p-3 bg-gray-800 rounded-lg">
                  <p className="text-xs text-gray-400 mb-1">Rating</p>
                  <p className="text-sm font-bold text-white">{station.rating.toFixed(1)} ⭐</p>
                </div>
              </div>  

              {/* Created At */}
              <div className="mb-4">
                <p className="text-xs text-gray-400 mb-2">Created At</p>
                <div className="flex flex-wrap gap-1">
                    <span className="px-2 py-1 bg-purple-400/10 text-purple-400 text-xs rounded border border-purple-400/20">
                      {station.createdAt.toDate().toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                </div>
              </div>

              {/* Quick Actions for Pending */}
              {station.status === "pending" && (
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleApprove(station)}
                    className="flex-1 flex items-center justify-center px-3 py-2 bg-green-400/10 text-green-400 border border-green-400/20 rounded-lg hover:bg-green-400/20 transition-all duration-200"
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Approve
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleReject(station)}
                    className="flex-1 flex items-center justify-center px-3 py-2 bg-red-400/10 text-red-400 border border-red-400/20 rounded-lg hover:bg-red-400/20 transition-all duration-200"
                  >
                    <XCircle className="w-4 h-4 mr-1" />
                    Reject
                  </motion.button>
                </div>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* No Stations */}
      {filteredStations.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
          <Building2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-400 mb-2">No stations found</h3>
          <p className="text-gray-500">
            {searchTerm || selectedStatus ? "Try adjusting your search or filter criteria" : "No stations to review"}
          </p>
        </motion.div>
      )}

      {/* Modals */}
      <StationModerationModal
        isOpen={showActionsModal}
        onClose={() => setShowActionsModal(false)}
        station={selectedStation}
        company={getCompanyName(selectedStation?.companyId)}
        onApprove={handleApprove}
        onReject={handleReject}
        onSuspend={handleSuspend}
        // onDelete={handleDelete}
      />

      <ConfirmModal
        isOpen={showApproveModal}
        onClose={() => setShowApproveModal(false)}
        onConfirm={confirmApprove}
        title="Approve Station"
        message={`Are you sure you want to approve "${selectedStation?.name}"? This will make it available for public use.`}
        confirmText="Approve"
        confirmColor="green"
      />

      <ConfirmModal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        onConfirm={confirmReject}
        title="Reject Station"
        message={`Are you sure you want to reject "${selectedStation?.name}"? The company will be notified of this decision.`}
        confirmText="Reject"
        confirmColor="red"
      />

      <ConfirmModal
        isOpen={showSuspendModal}
        onClose={() => setShowSuspendModal(false)}
        onConfirm={confirmSuspend}
        title="Suspend Station"
        message={`Are you sure you want to suspend "${selectedStation?.name}"? This will temporarily disable the station.`}
        confirmText="Suspend"
        confirmColor="orange"
      />

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Station"
        message={`Are you sure you want to permanently delete "${selectedStation?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        confirmColor="red"
      />
    </div>
  )
}

export default StationModeration
