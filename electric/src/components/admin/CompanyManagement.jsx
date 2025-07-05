"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Building2, Search, Ban, CheckCircle, Mail, Phone, Calendar
} from "lucide-react"
import ConfirmModal from "../modals/ConfirmModal"
import CompanyActionsModal from "../modals/CompanyActionsModal"
import { collection, onSnapshot, updateDoc, doc, query, where, getDocs } from "firebase/firestore"
import { db } from "../../firebase/firebaseConfig"

const CompanyManagement = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("")
  const [showSuspendModal, setShowSuspendModal] = useState(false)
  const [showActivateModal, setShowActivateModal] = useState(false)
  const [showActionsModal, setShowActionsModal] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState(null)

  const [companies, setCompanies] = useState([])

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "companies"), (snapshot) => {
      const companyData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      setCompanies(companyData)
    })
    return () => unsub()
  }, [])

  useEffect(() => {
    const fetchAdditionalStats = async () => {
      try {
        const stationsSnapshot = await getDocs(collection(db, "stations"))
        const allStations = stationsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))

        // Create a company stats map
        const statsMap = {}

        for (const company of companies) {
          const companyStations = allStations.filter(
            (station) => station.companyId === company.id
          )

          const stationCount = companyStations.length
          const totalRevenue = companyStations.reduce(
            (sum, station) => sum + (station.revenue || 0), 0
          )

          const ratings = companyStations.map(s => s.rating).filter(Boolean)
          const avgRating =
            ratings.length > 0
              ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(2)
              : "N/A"

          statsMap[company.id] = {
            avgRating,
            stationCount,
            totalRevenue,
          }
        }

        // Merge back into companies state
        const enrichedCompanies = companies.map(company => ({
          ...company,
          ...statsMap[company.id],
        }))

        setCompanies(enrichedCompanies)
      } catch (error) {
        console.error("Error fetching additional stats:", error)
      }
    }

    if (companies.length > 0) {
      fetchAdditionalStats()
    }
  }, [companies])

  const statusOptions = [
    { value: "", label: "All Statuses" },
    { value: "active", label: "Active" },
    { value: "suspended", label: "Suspended" },
  ]

  const filteredCompanies = companies.filter((company) => {
    const matchesSearch =
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = !selectedStatus || company.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "text-green-400 bg-green-400/10 border-green-400/20"
      case "pending":
        return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20"
      case "suspended":
        return "text-red-400 bg-red-400/10 border-red-400/20"
      default:
        return "text-gray-400 bg-gray-400/10 border-gray-400/20"
    }
  }

  const getBorderColor = (status) => {
    switch (status) {
      case "active":
        return "#05df72"
      case "suspended":
        return "#F87171"
      default:
        return "#9CA3AF"
    }
  }

  const handleSuspend = (company) => {
    setSelectedCompany(company)
    setShowSuspendModal(true)
  }

  const handleActivate = (company) => {
    setSelectedCompany(company)
    setShowActivateModal(true)
  }

  const confirmSuspend = async () => {
    try {
      await updateDoc(doc(db, "companies", selectedCompany.id), {
        status: "suspended",
      })
      const stationsQuery = query(
        collection(db, "stations"),
        where("companyId", "==", selectedCompany.id)
      )
      const querySnapshot = await getDocs(stationsQuery)
      const updates = querySnapshot.docs.map((docSnap) =>
        updateDoc(doc(db, "stations", docSnap.id), {
          status: "suspended",
        })
      )
      await Promise.all(updates)
      setShowSuspendModal(false)
      setSelectedCompany(null)
    } catch (error) {
      console.error("Error suspending company:", error)
    }
  }

  const confirmActivate = async () => {
    try {
      await updateDoc(doc(db, "companies", selectedCompany.id), {
        status: "active",
      })
      const stationsQuery = query(
        collection(db, "stations"),
        where("companyId", "==", selectedCompany.id)
      )
      const querySnapshot = await getDocs(stationsQuery)
      const updates = querySnapshot.docs.map((docSnap) =>
        updateDoc(doc(db, "stations", docSnap.id), {
          status: "active",
        })
      )
      await Promise.all(updates)
      setShowActivateModal(false)
      setSelectedCompany(null)
    } catch (error) {
      console.error("Error activating company:", error)
    }
  }

  const totalCompanies = companies.length
  const activeCompanies = companies.filter((c) => c.status === "active").length
  const suspendedCompanies = companies.filter((c) => c.status === "suspended").length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Company Management</h1>
          <p className="text-gray-400">Manage registered companies and their operations</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Total Companies */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{
            scale: 1.05,
            y: -2,
            borderColor: "#3B82F6",
            borderWidth: "3px",
          }}
          transition={{ type: "spring", stiffness: 300 }}
          className="bg-gradient-to-br backdrop-blur-md border border-gray-900 rounded-2xl p-6 shadow-md"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Companies</p>
              <p className="text-2xl font-bold text-white">{totalCompanies}</p>
            </div>
            <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-blue-400/10">
              <Building2 className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </motion.div>

        {/* Active */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{
            scale: 1.05,
            y: -2,
            borderColor: "#10B981",
            borderWidth: "3px",
          }}
          transition={{ type: "spring", stiffness: 300 }}
          className="bg-gradient-to-br backdrop-blur-md border border-gray-900 rounded-2xl p-6 shadow-md"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active</p>
              <p className="text-2xl font-bold text-white">{activeCompanies}</p>
            </div>
            <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-green-400/10">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </motion.div>

        {/* Suspended */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{
            scale: 1.05,
            y: -2,
            borderColor: "#EF4444",
            borderWidth: "3px",
          }}
          transition={{ type: "spring", stiffness: 100 }}
          className="bg-gradient-to-br backdrop-blur-md border border-gray-900 rounded-2xl p-6 shadow-md"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Suspended</p>
              <p className="text-2xl font-bold text-white">{suspendedCompanies}</p>
            </div>
            <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-red-400/10">
              <Ban className="w-6 h-6 text-red-400" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Search + Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="backdrop-blur-sm border border-gray-800 rounded-xl p-6 w-full md:w-1/2"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Search Input */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15, type: "spring", stiffness: 250 }}
            className="relative"
          >
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 backdrop-blur-sm border border-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
            />
          </motion.div>

          {/* Filter Dropdown */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 250 }}
          >
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 backdrop-blur-sm border border-gray-800 rounded-lg text-white focus:outline-none focus:border-purple-400"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value} className="bg-gray-900 text-white">
                  {option.label}
                </option>
              ))}
            </select>
          </motion.div>
        </div>
      </motion.div>

      {/* Company List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 py-3">
        {filteredCompanies.map((company, index) => (
          <motion.div
            key={company.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{
              scale: 1.05,
              y: -2,
              borderColor: getBorderColor(company.status),
              borderWidth: "2px",
            }}
            transition={{ type: "spring", stiffness: 300 }}
            className="backdrop-blur-md border border-gray-900 rounded-2xl p-6 shadow-md"
            style={{
              background: "radial-gradient(125% 125% at 75% 10%, #000000 40%, #c27aff40 100%)",
            }}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-400/10 rounded-lg flex items-center justify-center mr-4">
                  <Building2 className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">{company.name}</h3>
                  <div className="flex items-center text-gray-400 text-sm">
                    <Mail className="w-4 h-4 mr-1" />
                    {company.email}
                  </div>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm border ${getStatusColor(company.status)}`}>
                {company.status.charAt(0).toUpperCase() + company.status.slice(1)}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              <div className="text-center p-3 border border-gray-800 rounded-lg">
                <p className="text-xs text-gray-400 mb-1">Contact Person</p>
                <p className="text-sm font-bold text-white">{company.contactPerson}</p>
              </div>
              <div className="text-center p-3 border border-gray-800 rounded-lg">
                <p className="text-xs text-gray-400 mb-1">Phone</p>
                <p className="text-sm font-bold text-white">{company.phone}</p>
              </div>
              <div className="text-center p-3 border border-gray-800 rounded-lg">
                <p className="text-xs text-gray-400 mb-1">Join Date</p>
                <p className="text-sm font-bold text-white">
                  {new Date(company.joinDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                  })}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              <div className="text-center p-3 border border-gray-800 rounded-lg">
                <p className="text-xs text-gray-400 mb-1">Avg. Rating</p>
                <p className="text-sm font-bold text-white">{company.avgRating}</p>
              </div>
              <div className="text-center p-3 border border-gray-800 rounded-lg">
                <p className="text-xs text-gray-400 mb-1">Stations</p>
                <p className="text-sm font-bold text-white">{company.stationCount}</p>
              </div>
              <div className="text-center p-3 border border-gray-800 rounded-lg">
                <p className="text-xs text-gray-400 mb-1">Total Revenue</p>
                <p className="text-sm font-bold text-green-400">₹ {company.totalRevenue}</p>
              </div>
            </div>

            <div className="flex gap-2">
              {company.status === "active" && (
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSuspend(company)}
                  className="flex-1 flex items-center justify-center px-3 py-2 bg-gradient-to-r via-red-400/40 text-white rounded-lg "
                >
                  <Ban className="w-4 h-4 mr-1" />
                  Suspend
                </motion.button>
              )}
              {company.status === "suspended" && (
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleActivate(company)}
                  className="flex-1 flex items-center justify-center px-3 py-2 bg-gradient-to-r via-blue-400/40 text-white rounded-lg "
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Activate
                </motion.button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* No Companies */}
      {filteredCompanies.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
          <Building2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-400 mb-2">No companies found</h3>
          <p className="text-gray-500">Try adjusting your search criteria or filters</p>
        </motion.div>
      )}

      {/* Modals */}
      <CompanyActionsModal
        isOpen={showActionsModal}
        onClose={() => setShowActionsModal(false)}
        company={selectedCompany}
        onEdit={() => setShowActionsModal(false)}
        onViewStations={() => setShowActionsModal(false)}
        onSuspend={() => {
          setShowActionsModal(false)
          setShowSuspendModal(true)
        }}
        onActivate={() => {
          setShowActionsModal(false)
          setShowActivateModal(true)
        }}
        onDelete={() => setShowActionsModal(false)}
      />

      <ConfirmModal
        isOpen={showSuspendModal}
        onClose={() => setShowSuspendModal(false)}
        onConfirm={confirmSuspend}
        title="Suspend Company"
        message={`Are you sure you want to suspend "${selectedCompany?.name}"? This will disable their access to the platform.`}
        confirmText="Suspend"
        confirmColor="red"
      />

      <ConfirmModal
        isOpen={showActivateModal}
        onClose={() => setShowActivateModal(false)}
        onConfirm={confirmActivate}
        title="Activate Company"
        message={`Are you sure you want to activate "${selectedCompany?.name}"? This will restore their access to the platform.`}
        confirmText="Activate"
        confirmColor="green"
      />
    </div>
  )
}

export default CompanyManagement
