"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, Edit, Trash2, Ban, CheckCircle, User } from "lucide-react"

const UserActionsModal = ({ isOpen, onClose, user, onEdit, onDelete, onSuspend, onActivate }) => {
  if (!user) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-gray-800 rounded-xl p-6 w-full max-w-md border border-gray-700"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">User Actions</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* User Info */}
            <div className="flex items-center mb-6 p-4 bg-gray-700 rounded-lg">
              <div className="w-12 h-12 bg-blue-400/10 rounded-lg flex items-center justify-center mr-4">
                <User className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-white font-medium">{user.name}</h3>
                <p className="text-gray-400 text-sm">{user.email}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={onEdit}
                className="w-full flex items-center px-4 py-3 bg-blue-400/10 text-blue-400 border border-blue-400/20 rounded-lg hover:bg-blue-400/20 transition-all duration-200"
              >
                <Edit className="w-5 h-5 mr-3" />
                Edit User Details
              </button>

              {user.status === "active" ? (
                <button
                  onClick={onSuspend}
                  className="w-full flex items-center px-4 py-3 bg-red-400/10 text-red-400 border border-red-400/20 rounded-lg hover:bg-red-400/20 transition-all duration-200"
                >
                  <Ban className="w-5 h-5 mr-3" />
                  Suspend User
                </button>
              ) : (
                <button
                  onClick={onActivate}
                  className="w-full flex items-center px-4 py-3 bg-green-400/10 text-green-400 border border-green-400/20 rounded-lg hover:bg-green-400/20 transition-all duration-200"
                >
                  <CheckCircle className="w-5 h-5 mr-3" />
                  Activate User
                </button>
              )}

              <button
                onClick={onDelete}
                className="w-full flex items-center px-4 py-3 bg-red-400/10 text-red-400 border border-red-400/20 rounded-lg hover:bg-red-400/20 transition-all duration-200"
              >
                <Trash2 className="w-5 h-5 mr-3" />
                Delete User
              </button>
            </div>

            {/* Cancel Button */}
            <button
              onClick={onClose}
              className="w-full mt-4 px-4 py-3 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default UserActionsModal
