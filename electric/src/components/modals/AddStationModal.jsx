"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"

const AddStationModal = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    chargers: 1,
    pricePerMinute: 1,
  })

  const handleSubmit = () => {
    const { name, address, city, chargers, pricePerMinute } = formData

    if (!name || !address || !city || !chargers || !pricePerMinute) return

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

    onAdd(newStation)
    resetForm()
    onClose()
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
            className="bg-gray-800 rounded-xl p-6 w-full max-w-md border border-gray-700"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Add New Station</h2>
              <button onClick={handleClose} className="text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Form Fields */}
            <div className="space-y-5">
              <div>
                <label className="block text-sm text-gray-300 mb-1">Station Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:border-blue-400"
                  placeholder="e.g., EV Hub Jaipur"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-1">Full Address *</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                  className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:border-blue-400"
                  placeholder="e.g., City Park, Tonk Road"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-1">City *</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData((prev) => ({ ...prev, city: e.target.value }))}
                  className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:border-blue-400"
                  placeholder="e.g., Jaipur"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-1">Number of Chargers *</label>
                <input
                  type="number"
                  min={1}
                  value={formData.chargers}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, chargers: Number(e.target.value) }))
                  }
                  className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:border-blue-400"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-1">Price per Minute (₹) *</label>
                <input
                  type="number"
                  min={0}
                  step="0.1"
                  value={formData.pricePerMinute}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, pricePerMinute: Number(e.target.value) }))
                  }
                  className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:border-blue-400"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleClose}
                className="flex-1 py-2 bg-gray-700 text-gray-300 rounded hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={
                  !formData.name ||
                  !formData.address ||
                  !formData.city ||
                  formData.chargers <= 0 ||
                  formData.pricePerMinute <= 0
                }
                className="flex-1 py-2 bg-gradient-to-r from-blue-400 to-purple-500 text-white rounded font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Station
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default AddStationModal
