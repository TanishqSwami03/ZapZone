import { Routes, Route, Navigate } from "react-router-dom"
import UserLayout from "../layouts/UserLayout"
import BrowseStations from "../user/BrowseStations"
import BookingHistory from "../user/BookingHistory"
import Profile from "../user/Profile"

const UserDashboard = () => {
  return (
    <UserLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/user/browse" replace />} />
        <Route path="/browse" element={<BrowseStations />} />
        <Route path="/history" element={<BookingHistory />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </UserLayout>
  )
}

export default UserDashboard
