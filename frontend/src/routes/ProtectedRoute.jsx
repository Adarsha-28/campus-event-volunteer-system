import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, role, needsRoleSelection, loading } = useAuth();

  if (loading) return null;

  // Not logged in
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Logged in but role not selected
  if (needsRoleSelection) {
    return <Navigate to="/select-role" replace />;
  }

  // Role exists but not allowed
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to={`/${role}`} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
