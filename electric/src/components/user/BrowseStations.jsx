"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Filter, MapPin, Star, Zap, DollarSign, Wifi, Coffee, Car } from "lucide-react"
import BookingModal from "../modals/BookingModal"
import { collection, onSnapshot } from "firebase/firestore"
import { db } from "../../firebase/firebaseConfig"

const BrowseStations = () => {
  const [stations, setStations] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStation, setSelectedStation] = useState(null)
  const [showBookingModal, setShowBookingModal] = useState(false)

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "stations"), (snapshot) => {
      const stationList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setStations(stationList)
    }, (error) => {
      console.error("Error fetching stations in real-time:", error)
    })

    return () => unsubscribe()
  }, [])

  const filteredStations = stations.filter((station) => {
    const matchesSearch =
      station.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      station.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      station.address?.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesSearch && station.status === "active"
  })

  const handleBookStation = (station) => {
    setSelectedStation(station)
    setShowBookingModal(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Browse Charging Stations</h1>
          <p className="text-gray-400">Find and book the perfect charging station for your EV</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative w-1/3">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search stations by name or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400"
        />
      </div>

      {/* Results Count */}
      <div className="text-gray-400">
        Found {filteredStations.length} charging station{filteredStations.length !== 1 ? "s" : ""}
      </div>

      {/* Stations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredStations.map((station, index) => (
          <motion.div
            key={station.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{scale: 1.05, y: -2, borderColor: "#05df72", borderWidth: "1px", boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)"}}
            transition={{ delay: index * 0.1, type: "ease-out", stiffness: 300 }}
            className="bg-gray-900 border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-all duration-300 group flex flex-col"
          >
            {/* Station Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-white group-hover:text-green-400 transition-colors">
                  {station.name}
                </h3>
                <div className="flex items-center text-gray-400 text-sm mt-1">
                  <MapPin className="w-4 h-4 mr-1" />
                  {station.address}, {station.city}
                </div>
              </div>
              <div className="flex items-center text-yellow-400">
                <Star className="w-4 h-4 mr-1 fill-current" />
                <span className="text-sm font-medium">{station.rating.toFixed(1)}</span>
                {/* <span className="text-gray-400 text-xs ml-1">({station.reviews})</span> */}
              </div>
            </div>

            {/* Availability & Pricing */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-xs text-gray-400 mb-1">Vacant Chargers</div>
                {station.vacantChargers}
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-1">Pricing</div>
                ₹ {station.pricePerMinute} / min. 
              </div>
            </div>

            {/* Amenities */}
            <div className="mb-6">
              <div className="text-xs text-gray-400 mb-2">Completed Bookings</div>
              <div className="flex flex-wrap gap-2">
                {station.completedBookings}
              </div>
            </div>

            {/* Book Button - fixed at bottom */}
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleBookStation(station)}
              className="mt-auto ml-auto w-1/2 py-3 bg-gradient-to-r from-green-400 to-blue-500 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-green-400/20 transition-all duration-300"
            >
              Book Now
            </motion.button>
          </motion.div>
        ))}
      </div>

      {/* No Results */}
      {filteredStations.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
          <Zap className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-400 mb-2">No stations found</h3>
          <p className="text-gray-500">Try adjusting your search criteria or filters</p>
        </motion.div>
      )}

      {/* Booking Modal */}
      <BookingModal isOpen={showBookingModal} onClose={() => setShowBookingModal(false)} station={selectedStation} />
    </div>
  )
}

export default BrowseStations
