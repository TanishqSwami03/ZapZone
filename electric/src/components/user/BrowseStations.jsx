"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Filter, MapPin, Star, Zap, DollarSign, Wifi, Coffee, Car } from "lucide-react"
import { useUser } from "../../context/UserContext"
import BookingModal from "../modals/BookingModal"

const BrowseStations = () => {
  const { stations } = useUser()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedChargerType, setSelectedChargerType] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("")
  const [priceRange, setPriceRange] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [selectedStation, setSelectedStation] = useState(null)
  const [showBookingModal, setShowBookingModal] = useState(false)

  const filteredStations = stations.filter((station) => {
    const matchesSearch =
      station.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      station.location.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesChargerType = !selectedChargerType || station.chargerTypes.includes(selectedChargerType)

    const matchesLocation = !selectedLocation || station.location === selectedLocation

    const matchesPrice =
      !priceRange ||
      (() => {
        const minPrice = Math.min(...Object.values(station.pricePerMinute))
        switch (priceRange) {
          case "low":
            return minPrice < 0.3
          case "medium":
            return minPrice >= 0.3 && minPrice <= 0.5
          case "high":
            return minPrice > 0.5
          default:
            return true
        }
      })()

    return matchesSearch && matchesChargerType && matchesLocation && matchesPrice && station.status === "active"
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
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowFilters(!showFilters)}
          className="mt-4 sm:mt-0 flex items-center px-4 py-2 bg-green-400/10 text-green-400 border border-green-400/20 rounded-lg hover:bg-green-400/20 transition-all duration-200"
        >
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </motion.button>
      </div>

      {/* Search Bar */}
      <div className="relative w-1/3">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search stations by name or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400"
        />
      </div>

      {/* Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gray-800 border border-gray-700 rounded-lg p-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Charger Type</label>
                <select
                  value={selectedChargerType}
                  onChange={(e) => setSelectedChargerType(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-400"
                >
                  <option value="">All Types</option>
                  {chargerTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-400"
                >
                  <option value="">All Locations</option>
                  {locations.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Price Range</label>
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-400"
                >
                  <option value="">All Prices</option>
                  {priceRanges.map((range) => (
                    <option key={range.value} value={range.value}>
                      {range.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => {
                  setSelectedChargerType("")
                  setSelectedLocation("")
                  setPriceRange("")
                }}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
            transition={{ delay: index * 0.1 }}
            className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-all duration-300 group flex flex-col"
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
                <span className="text-sm font-medium">{station.rating}</span>
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
              className="mt-auto w-full py-3 bg-gradient-to-r from-green-400 to-blue-500 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-green-400/20 transition-all duration-300"
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
