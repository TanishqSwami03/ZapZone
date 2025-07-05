"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, CheckCircle, XCircle, Ban, Trash2, MapPin } from "lucide-react"

const StationModerationModal = ({ isOpen, onClose, station, onApprove, onReject, onSuspend, company }) => {
  if (!station) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center p-4 z-50">
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
              <h2 className="text-xl font-semibold text-white">Station Actions</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Station Info */}
            <div className="flex items-center mb-6 p-4 backdrop-blur-md border border-gray-800 rounded-lg">
              <div className="w-12 h-12 bg-purple-400/10 rounded-lg flex items-center justify-center mr-4">
                <MapPin className="w-6 h-6 text-purple-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-medium">{station.name}</h3>
                <p className="text-gray-400 text-xs truncate">{station.address}</p>
                <p className="text-purple-400 text-sm">{company}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">

              {station.status === "active" && (
                <motion.div
                  whileHover={{scale:1.08}}
                >
                  <button
                    onClick={() => onSuspend(station)}
                    className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-black via-orange-800 to-black text-orange-200 rounded-lg "
                  >
                    <Ban className="w-5 h-5 mr-3" />
                    Suspend Station
                  </button>
                </motion.div>
              )}

              {(station.status === "suspended") && (
                <button
                  onClick={() => onApprove(station)}
                  className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-black via-blue-800 to-black rounded-lg "
                >
                  <CheckCircle className="w-5 h-5 mr-3" />
                  Reactivate Station
                </button>
              )}

              {/* <button
                onClick={() => onDelete(station)}
                className="w-full flex items-center px-4 py-3 bg-red-400/10 text-red-400 border border-red-400/20 rounded-lg hover:bg-red-400/20 transition-all duration-200"
              >
                <Trash2 className="w-5 h-5 mr-3" />
                Delete Station
              </button> */}
            </div>

            {/* Cancel Button */}
            <motion.div
              whileHover={{scale:1.08}}
            >
              <button
                onClick={onClose}
                className="w-full mt-4 px-4 py-3 text-lg bg-gradient-to-r from-black via-gray-700 to-black text-gray-300 rounded-lg"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default StationModerationModal
