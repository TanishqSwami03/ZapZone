"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Plus, Search, MapPin, Zap, Clock, Eye, AlertCircle, CheckCircle, MoreVertical } from "lucide-react"
import { useUser } from "../../context/UserContext"
import AddStationModal from "../modals/AddStationModal"
import EditStationModal from "../modals/EditStationModal"
import StationActionsModal from "../modals/StationActionsModal"

const ManageStations = () => {
  const { stations, addStation, updateStation, deleteStation } = useUser()
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showActionsModal, setShowActionsModal] = useState(false)
  const [selectedStation, setSelectedStation] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")

  // Filter stations for current company (mock company ID = 1)
  const companyStations = stations.filter((station) => station.companyId === 1)

  // Filter by search term
  const filteredStations = companyStations.filter(
    (station) =>
      station.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      station.address.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleStationActions = (station) => {
    setSelectedStation(station)
    setShowActionsModal(true)
  }

  const handleEditStation = (station) => {
    setSelectedStation(station)
    setShowActionsModal(false)
    setShowEditModal(true)
  }

  const handleDeleteStation = (station) => {
    deleteStation(station.id)
    setShowActionsModal(false)
    setSelectedStation(null)
  }

  const handleSuspendStation = (station) => {
    updateStation(station.id, { status: "inactive" })
    setShowActionsModal(false)
    setSelectedStation(null)
  }

  const handleActivateStation = (station) => {
    updateStation(station.id, { status: "active" })
    setShowActionsModal(false)
    setSelectedStation(null)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "text-green-400 bg-green-400/10 border-green-400/20"
      case "pending":
        return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20"
      case "inactive":
        return "text-red-400 bg-red-400/10 border-red-400/20"
      default:
        return "text-gray-400 bg-gray-400/10 border-gray-400/20"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return CheckCircle
      case "pending":
        return Clock
      case "inactive":
        return AlertCircle
      default:
        return AlertCircle
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Manage Charging Stations</h1>
          <p className="text-gray-400">Add, edit, and monitor your charging stations</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search stations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 w-full sm:w-64"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddModal(true)}
            className="flex items-center px-4 py-2 bg-blue-400/10 text-blue-400 border border-blue-400/20 rounded-lg hover:bg-blue-400/20 transition-all duration-200"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Station
          </motion.button>
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
              <p className="text-gray-400 text-sm">Total Stations</p>
              <p className="text-2xl font-bold text-white">{companyStations.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-400/10 rounded-lg flex items-center justify-center">
              <MapPin className="w-6 h-6 text-blue-400" />
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
              <p className="text-gray-400 text-sm">Active Stations</p>
              <p className="text-2xl font-bold text-white">
                {companyStations.filter((s) => s.status === "active").length}
              </p>
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
              <p className="text-gray-400 text-sm">Total Chargers</p>
              <p className="text-2xl font-bold text-white">
                {companyStations.reduce(
                  (sum, station) => sum + Object.values(station.availability).reduce((a, b) => a + b, 0),
                  0,
                )}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-400/10 rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-purple-400" />
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
              <p className="text-gray-400 text-sm">Avg. Rating</p>
              <p className="text-2xl font-bold text-white">
                {companyStations.length > 0
                  ? (
                      companyStations.reduce((sum, station) => sum + station.rating, 0) / companyStations.length
                    ).toFixed(1)
                  : "0.0"}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-400/10 rounded-lg flex items-center justify-center">
              <Eye className="w-6 h-6 text-yellow-400" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Stations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredStations.map((station, index) => {
          const StatusIcon = getStatusIcon(station.status)
          return (
            <motion.div
              key={station.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-all duration-300"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-1">{station.name}</h3>
                  <div className="flex items-center text-gray-400 text-sm">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="truncate">{station.address}</span>
                  </div>
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

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-3 bg-gray-700/50 rounded-lg">
                  <p className="text-xs text-gray-400 mb-1">Total Chargers</p>
                  <p className="text-lg font-bold text-white">
                    {Object.values(station.availability).reduce((a, b) => a + b, 0)}
                  </p>
                </div>
                <div className="text-center p-3 bg-gray-700/50 rounded-lg">
                  <p className="text-xs text-gray-400 mb-1">Rating</p>
                  <p className="text-lg font-bold text-white">{station.rating} ⭐</p>
                </div>
              </div>

              {/* Charger Types */}
              <div className="mb-4">
                <p className="text-xs text-gray-400 mb-2">Charger Types</p>
                <div className="flex flex-wrap gap-1">
                  {station.chargerTypes.map((type) => (
                    <span
                      key={type}
                      className="px-2 py-1 bg-blue-400/10 text-blue-400 text-xs rounded border border-blue-400/20"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>

              {/* Pricing */}
              <div>
                <p className="text-xs text-gray-400 mb-2">Pricing Range</p>
                <p className="text-sm text-white font-medium">
                  ${Math.min(...Object.values(station.pricePerMinute)).toFixed(2)} - $
                  {Math.max(...Object.values(station.pricePerMinute)).toFixed(2)}/min
                </p>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* No Stations */}
      {filteredStations.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
          <MapPin className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-400 mb-2">
            {searchTerm ? "No stations found" : "No stations yet"}
          </h3>
          <p className="text-gray-500 mb-6">
            {searchTerm ? "Try adjusting your search terms" : "Start by adding your first charging station"}
          </p>
          {!searchTerm && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddModal(true)}
              className="flex items-center px-6 py-3 bg-blue-400/10 text-blue-400 border border-blue-400/20 rounded-lg hover:bg-blue-400/20 transition-all duration-200 mx-auto"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Station
            </motion.button>
          )}
        </motion.div>
      )}

      {/* Modals */}
      <AddStationModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} onAdd={addStation} />

      <EditStationModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        station={selectedStation}
        onUpdate={updateStation}
      />

      <StationActionsModal
        isOpen={showActionsModal}
        onClose={() => setShowActionsModal(false)}
        station={selectedStation}
        onEdit={handleEditStation}
        onDelete={handleDeleteStation}
        onSuspend={handleSuspendStation}
        onActivate={handleActivateStation}
      />
    </div>
  )
}

export default ManageStations
