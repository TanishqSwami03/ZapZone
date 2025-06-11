"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { User, Edit2, Save, X } from "lucide-react"

const Profile = () => {
  const initialData = {
    fullName: "John Smith",
    email: "john.smith@example.com",
    phone: "+1 234 567 8900",
    address: "456 Elm Street",
  }

  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(initialData)

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    setIsEditing(false)
  }

  const handleCancel = () => {
    setFormData(initialData)
    setIsEditing(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex justify-center items-start pt-27 px-6 h-full bg-gray-900"
    >
      <div className="max-w-md w-full p-6 bg-gray-900 rounded-xl text-white border border-gray-700 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold flex items-center">
            <User className="w-6 h-6 mr-2 text-green-400" />
            Personal Information
          </h1>

          {!isEditing ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsEditing(true)}
              className="flex items-center px-4 py-2 bg-green-400/20 text-green-400 border border-green-400 rounded-lg hover:bg-green-400/30 transition"
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Edit
            </motion.button>
          ) : (
            <div className="flex space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSave}
                className="flex items-center px-4 py-2 bg-green-400/20 text-green-400 border border-green-400 rounded-lg hover:bg-green-400/30 transition"
              >
                <Save className="w-4 h-4 mr-2" />
                Save
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCancel}
                className="flex items-center px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg hover:bg-gray-600 transition"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </motion.button>
            </div>
          )}
        </div>

        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label htmlFor="fullName" className="block mb-2 text-sm font-medium text-gray-300">
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              value={formData.fullName}
              disabled={!isEditing}
              onChange={(e) => handleChange("fullName", e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-400 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-300">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              disabled={!isEditing}
              onChange={(e) => handleChange("email", e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-400 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-300">
              Phone
            </label>
            <input
              id="phone"
              type="tel"
              value={formData.phone}
              disabled={!isEditing}
              onChange={(e) => handleChange("phone", e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-400 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label htmlFor="address" className="block mb-2 text-sm font-medium text-gray-300">
              Address
            </label>
            <input
              id="address"
              type="text"
              value={formData.address}
              disabled={!isEditing}
              onChange={(e) => handleChange("address", e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-400 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
        </form>
      </div>
    </motion.div>
  )
}

export default Profile
