import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import UserDashboard from "./components/dashboards/UserDashboard"
import CompanyDashboard from "./components/dashboards/CompanyDashboard"
import AdminDashboard from "./components/dashboards/AdminDashboard"
import LandingPage from "./components/LandingPage"
import LoginTypeSelection from "./components/auth/LoginTypeSelection"
import RegisterTypeSelection from "./components/auth/RegisterTypeSelection"
import UserLogin from "./components/auth/UserLogin"
import CompanyLogin from "./components/auth/CompanyLogin"
import UserRegister from "./components/auth/UserRegister"
import CompanyRegister from "./components/auth/CompanyRegister"
import { UserProvider } from "./context/UserContext"
import Logo from "./components/Logo"

function App() {
  return (
    <UserProvider>
      <Router>
        <div className="min-h-screen bg-gray-900">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginTypeSelection />} />
            <Route path="/login/user" element={<UserLogin />} />
            <Route path="/login/company" element={<CompanyLogin />} />
            <Route path="/register" element={<RegisterTypeSelection />} />
            <Route path="/register/user" element={<UserRegister />} />
            <Route path="/register/company" element={<CompanyRegister />} />
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
            <Route path="/logo" element={<Logo />} />
          </Routes>
        </div>
      </Router>
    </UserProvider>
  )
}

export default App
