import { Routes, Route } from "react-router-dom"
import AdminLayout from "../layouts/AdminLayout"
import AdminOverview from "../admin/AdminOverview"
import StationModeration from "../admin/StationModeration"
import UserManagement from "../admin/UserManagement"
import CompanyManagement from "../admin/CompanyManagement"
import Reports from "../admin/Reports"

const AdminDashboard = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<AdminOverview />} />
        <Route path="/overview" element={<AdminOverview />} />
        <Route path="/stations" element={<StationModeration />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/companies" element={<CompanyManagement />} />
        <Route path="/reports" element={<Reports />} />
      </Routes>
    </AdminLayout>
  )
}

export default AdminDashboard
