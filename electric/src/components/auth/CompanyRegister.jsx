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
  const [loading, setLoading] = useState(false);

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

    setLoading(true);
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
        setLoading(false);
    }
    }

  const closeModal = () => {
    setModal({ ...modal, show: false })
  }

  return (
    <>
      <div 
        className="min-h-screen flex items-center justify-center px-4 py-8"
        style={{
          backgroundColor: "#000000",
          backgroundImage: `
            radial-gradient(circle, rgba(255, 255, 255, 0.08) 1.5px, transparent 1.5px),
            radial-gradient(125% 90% at 30% 85%, #000000 30%, #111b46 100%)
          `,
          backgroundSize: "30px 30px, cover",
          backgroundPosition: "0 0, center",
          backgroundRepeat: "repeat, no-repeat",
        }}
      >
        <div className="max-w-3xl w-full">
          {/* Header */}
          <motion.div 
            className="text-center mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Link to="/register" className="inline-flex items-center text-gray-400 hover:text-white mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Selection
            </Link>
            <div className="flex items-center justify-center mb-3">
              <Zap className="w-6 h-6 text-blue-400 mr-2" />
              <motion.span
                style={{ fontFamily: "'Monoton', sans-serif", fontStyle: "normal" }}
                className="text-white text-3xl tracking-wide uppercase relative overflow-hidden"
                animate={{
                  x: [0, -2, 2, -1, 1, 0],
                  skewX: [0, 5, -5, 3, -3, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "easeInOut",
                }}
              >
                Zap<span className="text-blue-400">Zone</span>
              </motion.span>   
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
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-xl p-5 border border-gray-800"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Company Name</label>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 backdrop-blur-sm border border-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                      placeholder="Enter company name"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-400 z-1" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-9 pr-3 py-2.5 backdrop-blur-sm border border-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                        placeholder="you@example.com"
                        required
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-400 z-1" />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full pl-9 pr-10 py-2.5 backdrop-blur-sm border border-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
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
                  {/* Contact Person */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Contact Person</label>
                    <input
                      type="text"
                      name="contactPerson"
                      value={formData.contactPerson}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 backdrop-blur-sm border border-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                      placeholder="Full name"
                      required
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Phone</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-400 z-1" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full pl-9 pr-3 py-2.5 backdrop-blur-sm border border-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                        placeholder="Business phone"
                        required
                      />
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Confirm Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-400 z-1" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full pl-9 pr-10 py-2.5 backdrop-blur-sm border border-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
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

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  {/* <span className="px-2 bg-gray-800 text-gray-400">Or continue with</span> */}
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
                type="submit"
                className={`w-full ${
                  loading ? "opacity-50 cursor-not-allowed" : "hover:text-white"
                } bg-gradient-to-r via-blue-400 text-black py-2.5 rounded-lg font-semibold transition-all duration-300 text-lg`}
              >
                {loading ? "Registering..." : "Create Company Account"}
              </motion.button>
            </form>
          </motion.div>

          {/* Signin */}
          <motion.div 
            className="text-center mt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-gray-400 text-sm">
              Already have an account?{" "}
              <Link to="/login/company" className="text-blue-400 hover:text-blue-300 font-medium">
                Sign in here
              </Link>
            </p>
          </motion.div>
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
