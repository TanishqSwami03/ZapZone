"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { User, Edit2, Save, X } from "lucide-react"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { onAuthStateChanged } from "firebase/auth"
import { auth, db } from "../../firebase/firebaseConfig"

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(null)
  const [initialData, setInitialData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState(null)

  // Fetch user data
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return

      setUserId(user.uid)

      try {
        const userRef = doc(db, "users", user.uid)
        const userSnap = await getDoc(userRef)

        if (userSnap.exists()) {
          const userData = userSnap.data()
          setFormData(userData)
          setInitialData(userData)
        }
      } catch (err) {
        console.error("Error loading user profile:", err)
      } finally {
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [])

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    if (!userId || !formData) return

    try {
      const userRef = doc(db, "users", userId)
      await updateDoc(userRef, formData)

      setInitialData(formData)
      setIsEditing(false)
    } catch (err) {
      console.error("Error saving profile:", err)
    }
  }

  const handleCancel = () => {
    setFormData(initialData)
    setIsEditing(false)
  }

  if (loading || !formData) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
        Loading Profile...
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex justify-center items-start pt-24 px-6 h-full bg-gray-900"
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
          <ProfileField
            id="fullName"
            label="Full Name"
            value={formData.name}
            isEditing={isEditing}
            onChange={(val) => handleChange("name", val)}
          />

          <ProfileField
            id="email"
            label="Email"
            type="email"
            value={formData.email}
            isEditing={isEditing}
            onChange={(val) => handleChange("email", val)}
          />

          <ProfileField
            id="phone"
            label="Phone"
            type="tel"
            value={formData.phone}
            isEditing={isEditing}
            onChange={(val) => handleChange("phone", val)}
          />

          {/* <ProfileField
            id="address"
            label="Address"
            value={formData.address}
            isEditing={isEditing}
            onChange={(val) => handleChange("address", val)}
          /> */}
        </form>
      </div>
    </motion.div>
  )
}

const ProfileField = ({ id, label, type = "text", value, isEditing, onChange }) => (
  <div>
    <label htmlFor={id} className="block mb-2 text-sm font-medium text-gray-300">
      {label}
    </label>
    <input
      id={id}
      type={type}
      value={value}
      disabled={!isEditing}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-400 disabled:opacity-50 disabled:cursor-not-allowed"
    />
  </div>
)

export default Profile
