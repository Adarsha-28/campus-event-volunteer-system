import { useState, useEffect } from "react";
import { googleLogin } from "../firebase/authService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/global.css";
import volunteerImg from "../assets/volunteer.jpg";

const Login = () => {
  const navigate = useNavigate();
  const { role } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (role === "admin") navigate("/admin");
    else if (role === "organizer") navigate("/organizer");
    else if (role === "user") navigate("/user");
  }, [role, navigate]);

  const handleLogin = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await googleLogin();
    } catch (err) {
      console.error("Login failed:", err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* LEFT SIDE */}
      <div className="login-left">
        <h1 className="login-title">VolunteerHub</h1>
        <p className="login-subtitle">
          A centralized platform to manage campus events and volunteers efficiently.
        </p>

        <button
          className="login-button"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login with Google"}
        </button>
      </div>

      {/* RIGHT SIDE */}
      <div className="login-right">
        <img src={volunteerImg} alt="Volunteers" className="volunteer-img" />
        <div className="about-section">
          <h2>✨ About VolunteerHub</h2>
          <p>📅 Find & join campus events easily</p>
          <p>🤝 Volunteer for technical, cultural & social events</p>
          <p>🧑‍💼 Organizers manage events & volunteers</p>
          <p>🛡️ Admins control users & roles</p>
          <p>⚡ Secure Google login</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
