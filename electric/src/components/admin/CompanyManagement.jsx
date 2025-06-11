"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Building2, Search, MoreHorizontal, Ban, CheckCircle, Mail, Phone, MapPin, Calendar } from "lucide-react"
import ConfirmModal from "../modals/ConfirmModal"
import CompanyActionsModal from "../modals/CompanyActionsModal"
import { collection, onSnapshot, updateDoc, doc } from "firebase/firestore"
import { db } from "../../firebase/firebaseConfig"

const CompanyManagement = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("")
  const [showSuspendModal, setShowSuspendModal] = useState(false)
  const [showActivateModal, setShowActivateModal] = useState(false)
  const [showActionsModal, setShowActionsModal] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState(null)

  const [companies, setCompanies] = useState([])

  // Mock company data
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

  const statusOptions = [
    { value: "", label: "All Statuses" },
    { value: "active", label: "Active" },
    { value: "pending", label: "Pending" },
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

  const handleActionsClick = (company) => {
    setSelectedCompany(company)
    setShowActionsModal(true)
  }

  const handleSuspend = (company) => {
    setSelectedCompany(company)
    setShowSuspendModal(true)
  }

  const handleActivate = (company) => {
    setSelectedCompany(company)
    setShowActivateModal(true)
  }

  const handleEdit = () => {
    setShowActionsModal(false)
    // Add edit logic here
    console.log("Edit company:", selectedCompany)
  }

  const handleViewStations = () => {
    setShowActionsModal(false)
    // Add view stations logic here
    console.log("View stations for:", selectedCompany)
  }

  const handleSuspendFromModal = () => {
    setShowActionsModal(false)
    setShowSuspendModal(true)
  }

  const handleActivateFromModal = () => {
    setShowActionsModal(false)
    setShowActivateModal(true)
  }

  const handleDelete = () => {
    setShowActionsModal(false)
    // Add delete logic here
    console.log("Delete company:", selectedCompany)
  }

  const confirmSuspend = async () => {
    await updateDoc(doc(db, "companies", selectedCompany.id), {
      status: "suspended",
    })
    setShowSuspendModal(false)
    setSelectedCompany(null)
  }

  const confirmActivate = async () => {
    await updateDoc(doc(db, "companies", selectedCompany.id), {
      status: "active",
    })
    setShowActivateModal(false)
    setSelectedCompany(null)
  }

  const totalCompanies = companies.length
  const activeCompanies = companies.filter((c) => c.status === "active").length
  const pendingCompanies = companies.filter((c) => c.status === "pending").length
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 border border-gray-700 rounded-xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Companies</p>
              <p className="text-2xl font-bold text-white">{totalCompanies}</p>
            </div>
            <div className="w-12 h-12 bg-blue-400/10 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-800 border border-gray-700 rounded-xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active</p>
              <p className="text-2xl font-bold text-white">{activeCompanies}</p>
            </div>
            <div className="w-12 h-12 bg-green-400/10 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800 border border-gray-700 rounded-xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Pending</p>
              <p className="text-2xl font-bold text-white">{pendingCompanies}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-400/10 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-yellow-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-800 border border-gray-700 rounded-xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Suspended</p>
              <p className="text-2xl font-bold text-white">{suspendedCompanies}</p>
            </div>
            <div className="w-12 h-12 bg-red-400/10 rounded-lg flex items-center justify-center">
              <Ban className="w-6 h-6 text-red-400" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Search and Filters */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
            />
          </div>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-400"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Companies List */}
      <div className="space-y-4">
        {filteredCompanies.map((company, index) => (
          <motion.div
            key={company.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-all duration-300"
          >
            {/* Status badge - top-right */}
            <div
              className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm border ${getStatusColor(company.status)}`}
            >
              {company.status.charAt(0).toUpperCase() + company.status.slice(1)}
            </div>

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="flex-1">
                {/* Header: Icon + name + email */}
                <div className="flex items-center mb-4">
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

                {/* Info grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Contact Person</p>
                    <p className="text-white font-medium">{company.contactPerson}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Phone</p>
                    <div className="flex items-center text-sm">
                      <Phone className="w-3 h-3 mr-1 text-gray-400" />
                      <span className="text-white ml-1">{company.phone}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Join Date</p>
                    <p className="text-white font-medium">{company.joinDate.toDate().toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Last Active</p>
                    <p className="text-white font-medium">{company.lastActive.toDate().toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true,
                    })}</p>
                  </div>
                </div>

                {/* Address, Stations, Earnings */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Stations</p>
                    <p className="text-white font-medium">{company.stationCount}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Total Earnings</p>
                    <p className="text-green-400 font-medium">₹ {company.totalRevenue}</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 lg:mt-0 lg:ml-6 flex space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleActionsClick(company)}
                  className="flex items-center px-3 py-2 bg-purple-400/10 text-purple-400 border border-purple-400/20 rounded-lg hover:bg-purple-400/20 transition-all duration-200"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </motion.button>

                {company.status === "active" && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSuspend(company)}
                    className="flex items-center px-3 py-2 bg-red-400/10 text-red-400 border border-red-400/20 rounded-lg hover:bg-red-400/20 transition-all duration-200"
                  >
                    <Ban className="w-4 h-4 mr-1" />
                    Suspend
                  </motion.button>
                )}

                {company.status === "suspended" && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleActivate(company)}
                    className="flex items-center px-3 py-2 bg-green-400/10 text-green-400 border border-green-400/20 rounded-lg hover:bg-green-400/20 transition-all duration-200"
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Activate
                  </motion.button>
                )}
              </div>
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
        onEdit={handleEdit}
        onViewStations={handleViewStations}
        onSuspend={handleSuspendFromModal}
        onActivate={handleActivateFromModal}
        onDelete={handleDelete}
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
