"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Plus, Search, MapPin, Zap, Clock, Eye, AlertCircle, CheckCircle, MoreVertical } from "lucide-react"
import AddStationModal from "../modals/AddStationModal"
import EditStationModal from "../modals/EditStationModal"
import StationActionsModal from "../modals/StationActionsModal"
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore"
import { db, auth } from "../../firebase/firebaseConfig"

const ManageStations = () => {
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showActionsModal, setShowActionsModal] = useState(false)
  const [selectedStation, setSelectedStation] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [stations, setStations] = useState([])
  const [user, setUser] = useState(null)

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((authUser) => {
      setUser(authUser)
    })
    return () => unsubscribeAuth()
  }, [])

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "stations"), (snapshot) => {
      const stationList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      setStations(stationList)
    })
    return () => unsub()
  }, [])

  const companyStations = stations.filter(
    (station) => station.companyId === user?.uid
  )

  const filteredStations = companyStations.filter(
    (station) =>
      station.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      station.address.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const addStation = async (stationData) => {
    await addDoc(collection(db, "stations"), {
      ...stationData,
      companyId: user.uid,
      createdAt: serverTimestamp(),
    })
  }

  const updateStation = async (stationId, updateData) => {
    await updateDoc(doc(db, "stations", stationId), updateData)
  }

  const deleteStation = async (stationId) => {
    await deleteDoc(doc(db, "stations", stationId))
  }

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
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {[
          {
            title: "Total Stations",
            value: companyStations.length,
            icon: <MapPin className="w-6 h-6 text-blue-400" />,
            bg: "bg-blue-400/10",
          },
          {
            title: "Active Stations",
            value: companyStations.filter((s) => s.status === "active").length,
            icon: <CheckCircle className="w-6 h-6 text-green-400" />,
            bg: "bg-green-400/10",
            delay: 0.1,
          },
          {
            title: "Total Chargers",
            value: companyStations.reduce((sum, s) => sum + s.chargers, 0),
            icon: <Zap className="w-6 h-6 text-purple-400" />,
            bg: "bg-purple-400/10",
            delay: 0.2,
          },
          {
            title: "Avg. Rating",
            value:
              companyStations.length > 0
                ? (
                    companyStations.reduce((sum, s) => sum + s.rating, 0) / companyStations.length
                  ).toFixed(1)
                : "0.0",
            icon: <Eye className="w-6 h-6 text-yellow-400" />,
            bg: "bg-yellow-400/10",
            delay: 0.3,
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: stat.delay || 0 }}
            className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-md border border-gray-700 rounded-2xl p-6 shadow-md hover:shadow-lg hover:scale-[1.01] transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">{stat.title}</p>
                <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg}`}>
                {stat.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Stations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredStations.map((station, index) => {
          const StatusIcon = getStatusIcon(station.status);
          return (
            <motion.div
              key={station.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-md border border-gray-700 rounded-2xl p-6 shadow-md hover:shadow-lg hover:scale-[1.01] transition-all"
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-white">{station.name}</h3>
                  <div className="flex items-center text-sm text-gray-400 mt-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    {station.address}, {station.city}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(station.status)}`}>
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {station.status}
                  </div>
                  <button
                    onClick={() => handleStationActions(station)}
                    className="p-1 text-gray-400 hover:text-white transition-colors"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-4 text-center mt-2">
                <div className="bg-gray-700/40 p-3 rounded-xl">
                  <p className="text-xs text-gray-400 mb-1">Total Chargers</p>
                  <p className="text-xl text-white font-semibold">{station.chargers}</p>
                </div>
                <div className="bg-gray-700/40 p-3 rounded-xl">
                  <p className="text-xs text-gray-400 mb-1">Vacant Chargers</p>
                  <p className="text-xl text-white font-semibold">{station.vacantChargers}</p>
                </div>
                <div className="bg-gray-700/40 p-3 rounded-xl">
                  <p className="text-xs text-gray-400 mb-1">Bookings</p>
                  <p className="text-xl text-white font-semibold">{station.completedBookings}</p>
                </div>
                <div className="bg-gray-700/40 p-3 rounded-xl">
                  <p className="text-xs text-gray-400 mb-1">Revenue</p>
                  <p className="text-xl text-white font-semibold">₹ {station.revenue}</p>
                </div>
              </div>

              {/* Bottom */}
              <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-700">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Price / min</p>
                  <p className="text-sm text-white font-medium">₹ {station.pricePerMinute}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400 mb-1">Rating</p>
                  <p className="text-sm text-white font-medium">{station.rating} ⭐</p>
                </div>
              </div>
            </motion.div>
          );
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
