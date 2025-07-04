"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MapPin, X } from "lucide-react"

const AddStationModal = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    chargers: 1,
    pricePerMinute: 1,
  })

  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async () => {
    setIsLoading(true)

    const { name, address, city, chargers, pricePerMinute } = formData

    if (!name || !address || !city || !chargers || !pricePerMinute) {
      setIsLoading(false)
      return
    }

    const newStation = {
      ...formData,
      companyId: 1,
      vacantChargers: Number(chargers),
      completedBookings: 0,
      revenue: 0,
      rating: 0,
      ratingCount: 0,
      totalRatings: 0,
      status: "active",
    }

    try {
      await onAdd(newStation)
      resetForm()
      onClose()
    } catch (err) {
      console.error("Failed to add station:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      address: "",
      city: "",
      chargers: 1,
      pricePerMinute: 1,
    })
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="rounded-xl p-6 w-full max-w-md border border-gray-700"
            style={{
              background: "#000000",
              backgroundImage: `
                radial-gradient(circle at 1px 1px, rgba(139, 92, 246, 0.2) 1px, transparent 0),
                radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.18) 1px, transparent 0),
                radial-gradient(circle at 1px 1px, rgba(236, 72, 153, 0.15) 1px, transparent 0)
              `,
              backgroundSize: "20px 20px, 30px 30px, 25px 25px",
              backgroundPosition: "0 0, 10px 10px, 15px 5px",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-400/20 rounded-lg flex items-center justify-center mr-3">
                  <MapPin className="w-5 h-5 text-blue-400" />
                </div>
                <h2 className="text-xl font-bold text-white">Add New Station</h2>
              </div>
              <button onClick={handleClose} className="text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Form Fields */}
            <div className="space-y-5">

              {/* Station Name */}
              <div>
                <label className="block text-sm text-gray-300 mb-1">Station Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-blue-400"
                  placeholder="e.g., EV Hub Jaipur"
                />
              </div>

              {/* Full Address */}
              <div>
                <label className="block text-sm text-gray-300 mb-1">Full Address *</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                  className="w-full px-4 py-2 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-blue-400"
                  placeholder="e.g., City Park, Tonk Road"
                />
              </div>

              {/* City */}
              <div>
                <label className="block text-sm text-gray-300 mb-1">City *</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData((prev) => ({ ...prev, city: e.target.value }))}
                  className="w-full px-4 py-2 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-blue-400"
                  placeholder="e.g., Jaipur"
                />
              </div>

              <div className="flex flex-col md:flex-row gap-5">

                {/* Number of Chargers */}
                <div className="w-full md:w-1/2">
                  <label className="block text-sm text-gray-300 mb-1">Number of Chargers *</label>
                  <input
                    type="number"
                    min={1}
                    value={formData.chargers}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, chargers: Number(e.target.value) }))
                    }
                    className="w-full px-4 py-2 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-blue-400"
                  />
                </div>

                {/* Price per Minute */}
                <div className="w-full md:w-1/2">
                  <label className="block text-sm text-gray-300 mb-1">Price per Minute (₹) *</label>
                  <input
                    type="number"
                    min={0}
                    step="0.1"
                    value={formData.pricePerMinute}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, pricePerMinute: Number(e.target.value) }))
                    }
                    className="w-full px-4 py-2 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-blue-400"
                  />
                </div>

              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
              {/* <button
                onClick={handleClose}
                className="flex-1 py-2 bg-gray-700 text-gray-300 rounded hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button> */}
              <motion.button
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                onClick={handleSubmit}
                disabled={
                  isLoading ||
                  !formData.name ||
                  !formData.address ||
                  !formData.city ||
                  formData.chargers <= 0 ||
                  formData.pricePerMinute <= 0
                }
                className="flex-1 py-2 bg-gradient-to-r from-black via-blue-400 to-black text-white rounded font-mono hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mx-auto"
                  />
                ) : (
                  "Add Station"
                )}
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default AddStationModal
