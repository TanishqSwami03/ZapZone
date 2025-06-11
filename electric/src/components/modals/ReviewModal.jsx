"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Star, MessageSquare } from "lucide-react"

const ReviewModal = ({ isOpen, onClose, booking, onSubmit }) => {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState("")

  const handleSubmit = () => {
    if (rating > 0) {
      onSubmit(booking.id, rating, comment)
      setRating(0)
      setHoveredRating(0)
      setComment("")
    }
  }

  const handleClose = () => {
    setRating(0)
    setHoveredRating(0)
    setComment("")
    onClose()
  }

  if (!booking) return null

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
              <div>
                <h2 className="text-xl font-bold text-white">Leave a Review</h2>
                <p className="text-gray-400 text-sm">{booking.stationName}</p>
              </div>
              <button onClick={handleClose} className="text-gray-400 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Booking Details */}
            <div className="bg-gray-700 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Date</p>
                  <p className="text-white font-medium">{booking.date}</p>
                </div>
                <div>
                  <p className="text-gray-400">Duration</p>
                  <p className="text-white font-medium">{booking.duration} min</p>
                </div>
                <div>
                  <p className="text-gray-400">Charger Type</p>
                  <p className="text-white font-medium">{booking.chargerType}</p>
                </div>
                <div>
                  <p className="text-gray-400">Cost</p>
                  <p className="text-white font-medium">${booking.cost.toFixed(2)}</p>
                </div>
              </div>
            </div>

            {/* Rating */}
            <div className="mb-6">
              <label className="block text-white font-medium mb-3">
                <Star className="w-4 h-4 inline mr-2" />
                Rate your experience
              </label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.button
                    key={star}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="p-1"
                  >
                    <Star
                      className={`w-8 h-8 transition-colors ${
                        star <= (hoveredRating || rating) ? "text-yellow-400 fill-current" : "text-gray-600"
                      }`}
                    />
                  </motion.button>
                ))}
              </div>
              {rating > 0 && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gray-400 text-sm mt-2">
                  {rating === 1 && "Poor experience"}
                  {rating === 2 && "Below average"}
                  {rating === 3 && "Average experience"}
                  {rating === 4 && "Good experience"}
                  {rating === 5 && "Excellent experience"}
                </motion.p>
              )}
            </div>

            {/* Comment */}
            <div className="mb-6">
              <label className="block text-white font-medium mb-3">
                <MessageSquare className="w-4 h-4 inline mr-2" />
                Add a comment (optional)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience with other users..."
                rows={4}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400 resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={handleClose}
                className="flex-1 px-4 py-3 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={rating === 0}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-green-400 to-blue-500 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-green-400/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Review
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default ReviewModal
