import { useEffect, useState } from "react";
import { googleLogin } from "../firebase/authService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// import css
import "../styles/Login.css";

const Login = () => {
  const navigate = useNavigate();
  const { user, role, needsRoleSelection } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    if (needsRoleSelection) {
      navigate("/select-role");
    } else if (role === "admin") {
      navigate("/admin");
    } else if (role === "organizer") {
      navigate("/organizer");
    } else if (role === "user") {
      navigate("/user");
    }
  }, [user, role, needsRoleSelection, navigate]);

  const handleLogin = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await googleLogin();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Campus Event Volunteer System</h2>
        <p className="login-description">
          Welcome! This platform helps campus organizers manage events, track
          volunteers, and facilitate real-time communication. Join events,
          collaborate, and make volunteering seamless!
        </p>

        <button
          className="google-login-btn"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login with Google"}
        </button>

        <div className="login-footer">
          © 2026 Campus Volunteer Management
        </div>
      </div>
    </div>
  );
};

export default Login;
