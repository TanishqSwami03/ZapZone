"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, MapPin, Zap, Plus, Trash2 } from "lucide-react"

const EditStationModal = ({ isOpen, onClose, station, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    address: "",
    chargerTypes: [],
    pricePerMinute: {},
    availability: {},
    amenities: [],
  })

  const [newAmenity, setNewAmenity] = useState("")

  const chargerTypeOptions = ["DC Fast", "Level 2", "Level 1"]
  const commonAmenities = ["WiFi", "Restroom", "Cafe", "Shopping", "Food Court", "Parking", "Convenience Store"]

  useEffect(() => {
    if (station) {
      setFormData({
        name: station.name || "",
        location: station.location || "",
        address: station.address || "",
        chargerTypes: station.chargerTypes || [],
        pricePerMinute: station.pricePerMinute || {},
        availability: station.availability || {},
        amenities: station.amenities || [],
      })
    }
  }, [station])

  const handleChargerTypeChange = (type, checked) => {
    if (checked) {
      setFormData((prev) => ({
        ...prev,
        chargerTypes: [...prev.chargerTypes, type],
        pricePerMinute: { ...prev.pricePerMinute, [type]: prev.pricePerMinute[type] || 0.5 },
        availability: { ...prev.availability, [type]: prev.availability[type] || 1 },
      }))
    } else {
      const newChargerTypes = formData.chargerTypes.filter((t) => t !== type)
      const newPricePerMinute = { ...formData.pricePerMinute }
      const newAvailability = { ...formData.availability }
      delete newPricePerMinute[type]
      delete newAvailability[type]

      setFormData((prev) => ({
        ...prev,
        chargerTypes: newChargerTypes,
        pricePerMinute: newPricePerMinute,
        availability: newAvailability,
      }))
    }
  }

  const handlePriceChange = (type, price) => {
    setFormData((prev) => ({
      ...prev,
      pricePerMinute: { ...prev.pricePerMinute, [type]: Number.parseFloat(price) || 0 },
    }))
  }

  const handleAvailabilityChange = (type, count) => {
    setFormData((prev) => ({
      ...prev,
      availability: { ...prev.availability, [type]: Number.parseInt(count) || 0 },
    }))
  }

  const addAmenity = (amenity) => {
    if (amenity && !formData.amenities.includes(amenity)) {
      setFormData((prev) => ({
        ...prev,
        amenities: [...prev.amenities, amenity],
      }))
    }
    setNewAmenity("")
  }

  const removeAmenity = (amenity) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.filter((a) => a !== amenity),
    }))
  }

  const handleSubmit = () => {
    if (formData.name && formData.location && formData.address && formData.chargerTypes.length > 0) {
      onUpdate(station.id, formData)
      onClose()
    }
  }

  if (!station) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-gray-800 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-700"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Edit Charging Station</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Basic Information */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Basic Information
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Station Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-400"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Location/District *</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-400"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Full Address *</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-400"
                  />
                </div>
              </div>
            </div>

            {/* Charger Configuration */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Zap className="w-5 h-5 mr-2" />
                Charger Configuration
              </h3>

              <div className="space-y-4">
                {chargerTypeOptions.map((type) => (
                  <div key={type} className="border border-gray-600 rounded-lg p-4">
                    <div className="flex items-center mb-3">
                      <input
                        type="checkbox"
                        id={`edit-${type}`}
                        checked={formData.chargerTypes.includes(type)}
                        onChange={(e) => handleChargerTypeChange(type, e.target.checked)}
                        className="w-4 h-4 text-blue-400 bg-gray-700 border-gray-600 rounded focus:ring-blue-400"
                      />
                      <label htmlFor={`edit-${type}`} className="ml-2 text-white font-medium">
                        {type}
                      </label>
                    </div>

                    {formData.chargerTypes.includes(type) && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="grid grid-cols-2 gap-4"
                      >
                        <div>
                          <label className="block text-gray-400 text-sm mb-1">Price per minute ($)</label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={formData.pricePerMinute[type] || ""}
                            onChange={(e) => handlePriceChange(type, e.target.value)}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-400"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-400 text-sm mb-1">Number of chargers</label>
                          <input
                            type="number"
                            min="1"
                            value={formData.availability[type] || ""}
                            onChange={(e) => handleAvailabilityChange(type, e.target.value)}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-400"
                          />
                        </div>
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-4">Amenities</h3>

              {/* Common Amenities */}
              <div className="mb-4">
                <p className="text-gray-400 text-sm mb-2">Select from common amenities:</p>
                <div className="flex flex-wrap gap-2">
                  {commonAmenities.map((amenity) => (
                    <motion.button
                      key={amenity}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => addAmenity(amenity)}
                      disabled={formData.amenities.includes(amenity)}
                      className={`px-3 py-1 rounded-full text-sm transition-all ${
                        formData.amenities.includes(amenity)
                          ? "bg-blue-400/20 text-blue-400 cursor-not-allowed"
                          : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      }`}
                    >
                      {amenity}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Custom Amenity */}
              <div className="mb-4">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newAmenity}
                    onChange={(e) => setNewAmenity(e.target.value)}
                    placeholder="Add custom amenity..."
                    className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                    onKeyPress={(e) => e.key === "Enter" && addAmenity(newAmenity)}
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => addAmenity(newAmenity)}
                    className="px-4 py-2 bg-blue-400/10 text-blue-400 border border-blue-400/20 rounded hover:bg-blue-400/20 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>

              {/* Selected Amenities */}
              {formData.amenities.length > 0 && (
                <div>
                  <p className="text-gray-400 text-sm mb-2">Selected amenities:</p>
                  <div className="flex flex-wrap gap-2">
                    {formData.amenities.map((amenity) => (
                      <motion.div
                        key={amenity}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center px-3 py-1 bg-blue-400/10 text-blue-400 rounded-full text-sm border border-blue-400/20"
                      >
                        <span>{amenity}</span>
                        <button
                          onClick={() => removeAmenity(amenity)}
                          className="ml-2 text-blue-400 hover:text-blue-300"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={
                  !formData.name || !formData.location || !formData.address || formData.chargerTypes.length === 0
                }
                className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-400 to-purple-500 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-blue-400/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Update Station
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default EditStationModal
