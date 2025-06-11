import { Navigate, useLocation } from "react-router-dom";
import Lottie from "react-lottie-player";
import spinnerJson from "../assets/spinner.json";
import { useUser } from "../../context/UserContext";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, currentUser, loading } = useUser();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen backdrop-blur-sm">
        <Lottie
          loop
          animationData={spinnerJson}
          play
          style={{ width: 120, height: 120 }}
        />
      </div>
    );
  }

  // Not logged in
  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/login" replace state={{ from: location, message: "You are not logged in." }} />;
  }

  // Logged in but not authorized
  if (allowedRoles.length > 0 && !allowedRoles.includes(currentUser.type)) {
    return <Navigate to={`/${currentUser.type}/dashboard`} replace />;
  }

  return children;
};

export default ProtectedRoute;
