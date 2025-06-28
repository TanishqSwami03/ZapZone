import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "../../context/UserContext";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, currentUser } = useUser();
  const location = useLocation();

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
