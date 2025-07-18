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
      <div className="relative w-full sm:w-2/3 md:w-1/2 lg:w-1/3">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search stations by name or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-3 focus:ring-1 focus:ring-green-400 border border-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 w-full"
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
            whileHover={{scale: 1.05, y: -2, borderColor: "#05df72", borderWidth: "1px"}}
            transition={{type: "ease-out", stiffness: 300 }}
            className="group flex flex-col backdrop-blur-md border border-gray-900 rounded-2xl p-6 shadow-md"
            style={{
              background: "radial-gradient(125% 125% at 100% 10%, #000000 40%, #072607 100%)",
            }}
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
                <span className="text-gray-400 text-sm ml-1">( {station.ratingCount} )</span>
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
              whileHover={station.vacantChargers > 0 ? { scale: 1.04 } : {}}
              whileTap={station.vacantChargers > 0 ? { scale: 0.98 } : {}}
              onClick={() => {
                if (station.vacantChargers > 0) handleBookStation(station)
              }}
              disabled={station.vacantChargers <= 0}
              className={`mt-auto ml-auto w-1/2 py-3 rounded-lg font-medium transition-all duration-300 ${
                station.vacantChargers > 0
                  ? "bg-gradient-to-r from-green-600 to-gray-600 text-white hover:shadow-lg hover:shadow-green-400/20"
                  : "bg-gray-700 text-gray-400 cursor-not-allowed"
              }`}
            >
              {station.vacantChargers > 0 ? "Book Now" : "Station Full"}
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
