import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { DollarSign, TrendingUp, Calendar, PieChart, Building2 } from "lucide-react"
import {
  collection,
  doc,
  onSnapshot,
  query,
  where
} from "firebase/firestore"
import { db, auth } from "../../firebase/firebaseConfig"

const Earnings = () => {
  const [currentUser, setCurrentUser] = useState(null)
  const [company, setCompany] = useState(null)
  const [stations, setStations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      setCurrentUser(user)
    })
    return () => unsubscribeAuth()
  }, [])

  useEffect(() => {
    if (!currentUser) return

    const companyRef = doc(db, "companies", currentUser.uid)
    const unsubscribeCompany = onSnapshot(companyRef, (docSnap) => {
      if (docSnap.exists()) {
        setCompany(docSnap.data())
      }
    })

    const stationsRef = collection(db, "stations")
    const q = query(stationsRef, where("companyId", "==", currentUser.uid))
    const unsubscribeStations = onSnapshot(q, (querySnapshot) => {
      const stationList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      setStations(stationList)
      setLoading(false)
    })

    return () => {
      unsubscribeCompany()
      unsubscribeStations()
    }
  }, [currentUser])

  if (loading) return <p className="text-white">Loading...</p>
  if (!company) return <p className="text-red-500">Company data not found.</p>

  const totalRevenue = company.totalRevenue || 0
  const platformCommission = totalRevenue * 0.1
  const netEarnings = totalRevenue - platformCommission
  const totalBookings = stations.reduce((sum, s) => sum + (s.completedBookings || 0), 0)

  return (
    <div className="space-y-6">
      {/* Stats: Company Level */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Earnings Dashboard</h1>
          <p className="text-gray-400">Overview of your company earnings</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Total Revenue" icon={DollarSign} value={totalRevenue} color="green" />
        <StatCard title="Platform Commission (10%)" icon={PieChart} value={platformCommission} color="red" />
        <StatCard title="Net Earnings" icon={TrendingUp} value={netEarnings} color="blue" />
        <StatCard
          title="Avg. per Booking"
          icon={Calendar}
          value={totalBookings > 0 ? totalRevenue / totalBookings : 0}
          color="purple"
        />
      </div>

      {/* Station Performance: For All Stations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gray-800 border border-gray-700 rounded-xl p-6"
      >
        <h2 className="text-lg font-semibold text-white mb-6">Station Performance</h2>

        {stations.length === 0 ? (
          <p className="text-gray-400">No stations registered yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {stations
              .sort((a, b) => b.revenue - a.revenue)
              .map((station, i) => (
                <motion.div
                  key={station.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-gray-700 hover:bg-gray-600 transition-colors duration-200 rounded-xl p-5"
                >
                  {/* Top Section: Icon + Name + Address */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 bg-blue-400/10 rounded-lg flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-base">{station.name}</h3>
                      <p className="text-sm text-gray-400">{station.address}</p>
                    </div>
                  </div>

                  {/* Bottom Section: Revenue | Bookings | Avg/Booking */}
                  <div className="flex items-center justify-between gap-4">
                    <StatMini title="Revenue" value={station.revenue || 0} isCurrency />
                    <StatMini title="Bookings" value={station.completedBookings || 0} />
                    <StatMini
                      title="Avg/Booking"
                      value={
                        station.completedBookings > 0
                          ? station.revenue / station.completedBookings
                          : 0
                      }
                      isCurrency
                    />
                  </div>
                </motion.div>
              ))}
          </div>
        )}
      </motion.div>

    </div>
  )
}

const StatCard = ({ title, icon: Icon, value, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-gray-800 border border-gray-700 rounded-xl p-6"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-400 text-sm">{title}</p>
        <p className={`text-2xl font-bold text-${color}-400`}>₹ {value.toFixed(2)}</p>
      </div>
      <div className={`w-12 h-12 bg-${color}-400/10 rounded-lg flex items-center justify-center`}>
        <Icon className={`w-6 h-6 text-${color}-400`} />
      </div>
    </div>
  </motion.div>
)

const StatMini = ({ title, value, isCurrency = false }) => (
  <div className="text-center">
    <p className="text-white font-medium">
      {isCurrency ? `₹ ${value.toFixed(2)}` : value}
    </p>
    <p className="text-gray-400 text-sm">{title}</p>
  </div>
)

export default Earnings
