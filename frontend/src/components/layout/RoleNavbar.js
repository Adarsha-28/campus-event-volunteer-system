import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { auth } from "../../firebase/firebase";

const RoleNavbar = () => {
  const { role } = useAuth();
  const navigate = useNavigate();

  const logout = async () => {
    await auth.signOut();
    navigate("/");
  };

  return (
    <nav style={{ padding: 10, background: "#1e40af", color: "#fff" }}>
      <span style={{ marginRight: 20 }}>Role: {role}</span>

      <button onClick={() => navigate("/events")}>Events</button>

      {role === "admin" && (
        <button onClick={() => navigate("/admin")}>Admin</button>
      )}
      {role === "organizer" && (
        <button onClick={() => navigate("/organizer")}>Organizer</button>
      )}
      {role === "user" && (
        <button onClick={() => navigate("/user")}>Dashboard</button>
      )}

      <button onClick={logout} style={{ float: "right" }}>
        Logout
      </button>
    </nav>
  );
};

export default RoleNavbar;
