import "../../styles/RoleNavbar.css";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { auth } from "../../firebase/firebase";


const RoleNavbar = () => {
  const { role } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <nav className="navbar-container">
      {/* Left side: Role info and Primary Navigation */}
      <div className="navbar-left">
        <div className="role-info">
          <span className="role-label">Current Role</span>
          <span className="role-name">{role || "Guest"}</span>
        </div>

        {role === "admin" && (
          <button className="nav-btn" onClick={() => navigate("/admin")}>
            Admin Panel
          </button>
        )}
        {role === "organizer" && (
          <button className="nav-btn" onClick={() => navigate("/organizer")}>
            Organizer Panel
          </button>
        )}
        {role === "user" && (
          <button className="nav-btn" onClick={() => navigate("/user")}>
            User Dashboard
          </button>
        )}
      </div>

      {/* Right side: System actions */}
      <div className="navbar-right">
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default RoleNavbar;