import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import UserDashboard from "./components/dashboards/UserDashboard"
import CompanyDashboard from "./components/dashboards/CompanyDashboard"
import AdminDashboard from "./components/dashboards/AdminDashboard"
import LandingPage from "./components/LandingPage"
import LoginPage from "./components/auth/LoginPage"
import RegisterPage from "./components/auth/RegisterPage"
import ProtectedRoute from "./components/auth/ProtectedRoute"
import { UserProvider } from "./context/UserContext"

function App() {
  return (
    <UserProvider>
      <Router>
        <div className="min-h-screen bg-gray-900">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/user/*"
              element={
                // <ProtectedRoute allowedRoles={["user"]}>
                  <UserDashboard />
                // </ProtectedRoute>
              }
            />
            <Route
              path="/company/*"
              element={
                // <ProtectedRoute allowedRoles={["company"]}>
                  <CompanyDashboard />
                // </ProtectedRoute>
              }
            />
            <Route
              path="/admin/*"
              element={
                // <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                // </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </UserProvider>
  )
}

export default App
