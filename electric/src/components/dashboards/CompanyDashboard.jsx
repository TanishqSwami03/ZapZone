import { Routes, Route, Navigate } from "react-router-dom"
import CompanyLayout from "../layouts/CompanyLayout"
import ManageStations from "../company/ManageStations"
import BookingManagement from "../company/BookingManagement"
import Earnings from "../company/Earnings"

const CompanyDashboard = () => {
  return (
    <CompanyLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/company/stations" replace />} />
        <Route path="/stations" element={<ManageStations />} />
        <Route path="/bookings" element={<BookingManagement />} />
        <Route path="/earnings" element={<Earnings />} />
      </Routes>
    </CompanyLayout>
  )
}

export default CompanyDashboard
