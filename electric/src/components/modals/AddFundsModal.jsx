"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, CreditCard, Wallet, DollarSign, IndianRupee } from "lucide-react"
import { doc, updateDoc, increment, getDoc } from "firebase/firestore"
import { db, auth } from "../../firebase/firebaseConfig"

const AddFundsModal = ({ isOpen, onClose }) => {
  const [amount, setAmount] = useState("")
  // const [paymentMethod, setPaymentMethod] = useState("card")
  const [isLoading, setIsLoading] = useState(false)

  const quickAmounts = [200, 500, 800, 1000]

  const handleSubmit = async (e) => {
    e.preventDefault()
    const numAmount = Number.parseFloat(amount)
    if (!numAmount || numAmount <= 0) return

    setIsLoading(true)

    try {
      const user = auth.currentUser
      if (!user) throw new Error("User not logged in")

      // Get user doc
      const userRef = doc(db, "users", user.uid)
      const userSnap = await getDoc(userRef)

      if (!userSnap.exists()) throw new Error("User not found in Firestore")

      // Increment wallet balance
      await updateDoc(userRef, {
        wallet: increment(numAmount),
      })

      onClose()
      setAmount("")
    } catch (error) {
      console.error("Failed to add funds:", error)
      alert("Failed to add funds. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickAmount = (value) => {
    setAmount(value.toString())
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 backdrop-blur-sm border border-white border-opacity-20 rounded-lg shadow-lg flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="backdrop-blur-lg rounded-xl p-6 w-full max-w-md border border-gray-700"
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
                <div className="w-10 h-10 bg-green-400/10 rounded-lg flex items-center justify-center mr-3">
                  <Wallet className="w-5 h-5 text-green-400" />
                </div>
                <h2 className="text-lg font-bold text-white">Add Funds</h2>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Quick Amount Selection */}
              <div>
                <label className="block text-white font-medium mb-3">Quick Select</label>
                <div className="grid grid-cols-4 gap-2">
                  {quickAmounts.map((value) => (
                    <motion.button
                      key={value}
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleQuickAmount(value)}
                      className={`p-3 rounded-lg border transition-all duration-200 ${
                        amount === value.toString()
                          ? "border-green-400 bg-green-400/10 text-green-400"
                          : "border-gray-600 text-gray-300 hover:border-gray-500"
                      }`}
                    >
                      ₹ {value}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Custom Amount */}
              <div>
                <label className="block text-white font-medium mb-2">Custom Amount</label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    min="1"
                    step="0.01"
                    className="w-full pl-10 pr-4 py-3 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400"
                  />
                </div>
              </div>

              {/* Payment Method */}
              {/* <div>
                <label className="block text-white font-medium mb-3">Payment Method</label>
                <div className="space-y-2">
                  <label className="flex items-center p-3 border border-gray-600 rounded-lg cursor-pointer hover:border-gray-500 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={paymentMethod === "card"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4 text-green-400 bg-gray-700 border-gray-600 focus:ring-green-400"
                    />
                    <CreditCard className="w-5 h-5 text-gray-400 mx-3" />
                    <span className="text-white">Credit/Debit Card</span>
                  </label>
                </div>
              </div> */}

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isLoading || !amount || Number.parseFloat(amount) <= 0}
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                className="w-full py-3 bg-gradient-to-r from-black via-green-800 to-black text-white text-lg font-extralight rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mx-auto"
                  />
                ) : (
                  `Add ₹ ${amount || "0.00"} to Wallet`
                )}
              </motion.button>
            </form>

            {/* Security Note */}
            <div className="mt-4 p-3 rounded-lg">
              <p className="text-gray-300 text-sm text-center">🔒 Your payment information is secure and encrypted</p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default AddFundsModal
