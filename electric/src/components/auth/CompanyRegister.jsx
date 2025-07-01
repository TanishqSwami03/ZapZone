"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Eye, EyeOff, ArrowLeft, Zap, Building2, Mail, Lock, Phone } from "lucide-react"

import { auth, db } from "../../firebase/firebaseConfig"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { doc, setDoc, collection, query, where, getDocs } from "firebase/firestore"
import ConfirmModal from "../modals/ConfirmModal"
const CompanyRegister = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })

  const navigate = useNavigate()

  const [modal, setModal] = useState({
    show: false,
    type: "success",
    title: "",
    message: "",
    onConfirm: () => {},
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate phone number
    const phoneRegex = /^\d{10}$/
    if (!phoneRegex.test(formData.phone)) {
        return setModal({
        show: true,
        type: "error",
        title: "Invalid Phone Number",
        message: "Phone number must be exactly 10 digits and contain only numbers.",
        onConfirm: () => setModal({ ...modal, show: false }),
        })
    }

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
        return setModal({
        show: true,
        type: "error",
        title: "Password Mismatch",
        message: "Passwords do not match. Please check and try again.",
        onConfirm: () => setModal({ ...modal, show: false }),
        })
    }

    try {
        // First, check if company name or phone already exists
        const companiesRef = collection(db, "companies")

        const nameQuery = query(companiesRef, where("name", "==", formData.companyName))
        const phoneQuery = query(companiesRef, where("phone", "==", formData.phone))

        const [nameSnap, phoneSnap] = await Promise.all([
        getDocs(nameQuery),
        getDocs(phoneQuery),
        ])

        if (!nameSnap.empty) {
        return setModal({
            show: true,
            type: "error",
            title: "Company Name Taken",
            message: "A company with this name already exists. Try a different name.",
            onConfirm: () => setModal({ ...modal, show: false }),
        })
        }

        if (!phoneSnap.empty) {
        return setModal({
            show: true,
            type: "error",
            title: "Phone Already Registered",
            message: "This phone number is already associated with another company.",
            onConfirm: () => setModal({ ...modal, show: false }),
        })
        }

        // Now try to create the Firebase Auth user
        const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
        )

        const user = userCredential.user
        const now = new Date().toString()

        const companyPayload = {
        name: formData.companyName,
        contactPerson: formData.contactPerson,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        joinDate: now,
        status: "active",
        uid: user.uid,
        }

        await setDoc(doc(db, "companies", user.uid), companyPayload)

        setModal({
        show: true,
        type: "success",
        title: "Registration Successful",
        message: "Your company account has been created successfully!",
        onConfirm: () => {
            setModal({ ...modal, show: false })
            navigate("/login/company")
        },
        })
    } catch (error) {
        console.error("Registration Error:", error)

        let errorTitle = "Registration Failed"
        let errorMessage = "Something went wrong. Please try again."

        // Log actual error for debugging
        console.log("🔥 Error Code:", error.code)
        console.log("🔥 Error Message:", error.message)

        // Check by error.code
        if (error.code === "auth/email-already-in-use") {
            errorTitle = "Email Already In Use"
            errorMessage = "This email is already registered. Try logging in or use another email."
        } else if (error.code === "auth/invalid-email") {
            errorTitle = "Invalid Email"
            errorMessage = "The email address is not valid. Please enter a correct one."
        } else if (error.code === "auth/weak-password") {
            errorTitle = "Weak Password"
            errorMessage = "Password should be at least 6 characters."
        }

        // 🧠 Fallback: check message if error.code is missing
        if (error.message?.includes("auth/email-already-in-use")) {
            errorTitle = "Email Already In Use"
            errorMessage = "This email is already registered. Try logging in or use another email."
        } else if (error.message?.includes("auth/invalid-email")) {
            errorTitle = "Invalid Email"
            errorMessage = "The email address is not valid. Please enter a correct one."
        } else if (error.message?.includes("auth/weak-password")) {
            errorTitle = "Weak Password"
            errorMessage = "Password should be at least 6 characters."
        }

        setModal({
            show: true,
            type: "error",
            title: errorTitle,
            message: errorMessage,
            onConfirm: () => setModal({ ...modal, show: false }),
        })
    }
    }

  const closeModal = () => {
    setModal({ ...modal, show: false })
  }

  return (
    <>
      {modal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-60">
          <div className="bg-gray-800 border border-gray-600 rounded-xl p-6 max-w-md w-full text-center">
            <h2 className={`text-lg font-semibold mb-2 ${modal.type === "success" ? "text-green-400" : "text-red-400"}`}>
              {modal.type === "success" ? "Success" : "Error"}
            </h2>
            <p className="text-gray-300 mb-4">{modal.message}</p>
            <button
              onClick={closeModal}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* 🔽 Your original UI starts here — nothing touched below this line */}
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 py-8">
        <div className="max-w-3xl w-full">
          <div className="text-center mb-6">
            <Link to="/register" className="inline-flex items-center text-gray-400 hover:text-white mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Selection
            </Link>
            <div className="flex items-center justify-center mb-3">
              <Zap className="w-6 h-6 text-blue-400 mr-2" />
              <span className="text-white font-bold text-lg">EV Recharge Platform</span>
            </div>
            <div className="flex items-center justify-center mb-3">
              <div className="w-10 h-10 bg-blue-400/10 rounded-lg flex items-center justify-center mr-3">
                <Building2 className="w-5 h-5 text-blue-400" />
              </div>
              <div className="text-left">
                <h1 className="text-xl font-bold text-white">Create Company Account</h1>
                <p className="text-gray-400 text-sm">Register your business</p>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-800 rounded-xl p-5 border border-gray-700"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Company Name</label>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                      placeholder="Enter company name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-9 pr-3 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                        placeholder="you@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full pl-9 pr-10 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                        placeholder="Create password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Contact Person</label>
                    <input
                      type="text"
                      name="contactPerson"
                      value={formData.contactPerson}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                      placeholder="Full name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Phone</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full pl-9 pr-3 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                        placeholder="Business phone"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Confirm Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full pl-9 pr-10 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                        placeholder="Confirm password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* <div className="flex items-start pt-2">
                <input
                  type="checkbox"
                  className="mt-1 mr-2 rounded border-gray-600 bg-gray-700 text-blue-400 focus:ring-blue-400"
                  required
                />
                <label className="text-sm text-gray-300">
                  I agree to the{" "}
                  <Link to="/terms" className="text-blue-400 hover:text-blue-300">Terms of Service</Link> and{" "}
                  <Link to="/privacy" className="text-blue-400 hover:text-blue-300">Privacy Policy</Link>
                </label>
              </div> */}

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  {/* <span className="px-2 bg-gray-800 text-gray-400">Or continue with</span> */}
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-gradient-to-r from-blue-400 to-blue-500 text-white py-2.5 rounded-lg font-semibold hover:from-blue-500 hover:to-blue-600 transition-all duration-300 text-sm"
              >
                Create Company Account
              </motion.button>

              {/* <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-800 text-gray-400">Or continue with</span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                className="w-full bg-white text-gray-900 py-2.5 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center text-sm"
              >
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
              </motion.button> */}
            </form>
          </motion.div>

          <div className="text-center mt-4">
            <p className="text-gray-400 text-sm">
              Already have an account?{" "}
              <Link to="/login/company" className="text-blue-400 hover:text-blue-300 font-medium">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>


      <ConfirmModal
        isOpen={modal.show}
        title={modal.title}
        message={modal.message}
        onClose={() => setModal({ ...modal, show: false })}
        onConfirm={modal.onConfirm}
        confirmText="OK"
        confirmColor={modal.type === "success" ? "green" : "red"}
      />
    </>
  )
}

export default CompanyRegister
