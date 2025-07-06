import { useState, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { X } from "lucide-react"

const EditStationModal = ({ isOpen, onClose, station, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    chargers: 0,
    vacantChargers: 0,
    pricePerMinute: 0,
    status: "active",
  })

  useEffect(() => {
    if (station) {
      setFormData({
        name: station.name || "",
        address: station.address || "",
        city: station.city || "",
        chargers: station.chargers || 0,
        pricePerMinute: station.pricePerMinute || 0,
      })
    }
  }, [station])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: ["chargers", "vacantChargers", "pricePerMinute"].includes(name)
        ? Number(value)
        : value,
    }))
  }

  const handleSubmit = () => {
    if (!station) return

    onUpdate(station.id, {
      ...formData,
      companyId: station.companyId,
      createdAt: station.createdAt,
      rating: station.rating || 0,
      revenue: station.revenue || 0,
      completedBookings: station.completedBookings || 0,
    })

    onClose()
  }

  if (!isOpen || !station) return null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-opacity-60"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="text-white rounded-xl shadow-lg p-6 w-full max-w-xl border border-gray-700"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
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
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Edit Station</h2>
            <button onClick={onClose}>
              <X className="w-5 h-5 text-gray-400 hover:text-white" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Name" name="name" value={formData.name} onChange={handleChange} />
            <Input label="City" name="city" value={formData.city} onChange={handleChange} />
            <Input label="Address" name="address" value={formData.address} onChange={handleChange} />
            <Input label="Chargers" name="chargers" type="number" value={formData.chargers} onChange={handleChange} />
            <Input label="Price / Minute (₹)" name="pricePerMinute" type="number" value={formData.pricePerMinute} onChange={handleChange} />
          </div>

          <div className="flex justify-end mt-6 gap-3">
            <button
              onClick={onClose}
              className="w-1/3 px-4 py-2 bg-gradient-to-r from-black via-gray-400 to-black text-sm rounded-md "
            >
              Cancel
            </button>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleSubmit}
              className="w-1/3 px-4 py-2 bg-gradient-to-r from-black via-blue-400 to-black text-sm text-white rounded-md "
            >
              Update Station
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

const Input = ({ label, name, type = "text", value, onChange }) => (
  <div>
    <label className="block text-sm mb-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 rounded-md backdrop-blur-sm border border-gray-800 text-white focus:outline-none"
    />
  </div>
)

export default EditStationModal
