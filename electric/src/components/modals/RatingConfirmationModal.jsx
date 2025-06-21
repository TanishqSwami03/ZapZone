"use client"

import { motion, AnimatePresence } from "framer-motion"

const RatingConfirmationModal = ({ isVisible }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="rating-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="bg-gray-800 rounded-xl p-6 w-full max-w-md border border-gray-700 shadow-xl"
          >
            {/* Header */}
            <div className="mb-6 text-center">
              <h2 className="text-xl font-semibold text-white">Thank You!</h2>
            </div>

            {/* Animated Checkmark with Glow */}
            <div className="relative w-20 h-20 mx-auto mb-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: [0.9, 1.1, 1] }}
                transition={{
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1],
                  delay: 0.1,
                }}
                className="absolute inset-0 rounded-full bg-green-500/10 blur-md"
              />
              <div className="relative z-10 w-20 h-20 bg-green-400/10 rounded-full flex items-center justify-center border border-green-500/20">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-10 h-10 text-green-400"
                >
                  <motion.path
                    d="M5 13l4 4L19 7"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{
                      duration: 0.5,
                      ease: "easeInOut",
                    }}
                  />
                </svg>
              </div>
            </div>

            {/* Text Content */}
            <div className="text-center mb-6">
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-lg font-semibold text-white mb-2"
              >
                Rating Submitted
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-gray-300 text-sm leading-relaxed"
              >
                We appreciate your review — it helps us improve and serve you better.
              </motion.p>
            </div>

            {/* Confirmation Box */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-green-400/10 border border-green-400/20 rounded-lg p-4"
            >
              <div className="flex items-start">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5 text-green-400 mt-0.5 mr-3 flex-shrink-0"
                >
                  <motion.path
                    d="M5 13l4 4L19 7"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, ease: "easeInOut", delay: 0.2 }}
                  />
                </svg>
                <p className="text-green-400 font-medium">
                  Your response has been recorded successfully.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default RatingConfirmationModal
