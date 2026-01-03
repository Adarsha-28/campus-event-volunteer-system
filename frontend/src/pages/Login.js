import { useState, useEffect } from "react";
import { googleLogin } from "../firebase/authService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/global.css";
import "../styles/Login.css";

const Login = () => {
  const navigate = useNavigate();
  const { role, needsRoleSelection, loading } = useAuth();
  const [signingIn, setSigningIn] = useState(false);

  useEffect(() => {
    if (loading) return;

    if (needsRoleSelection) {
      navigate("/select-role");
    } else if (role === "admin") {
      navigate("/admin");
    } else if (role === "organizer") {
      navigate("/organizer");
    } else if (role === "user") {
      navigate("/user");
    }
  }, [role, needsRoleSelection, loading, navigate]);

  const handleLogin = async () => {
    if (signingIn) return;
    setSigningIn(true);

    try {
      await googleLogin();
    } catch (err) {
      console.error("Login failed:", err);
      alert(err.message);
    } finally {
      setSigningIn(false);
    }
  };

  return (
    <div className="login-wrapper">
      {/* Top Brand Header */}
      <header className="brand-header">
        <div className="logo-container">
          <span className="logo-emoji">🤝</span>
          <span className="logo-text">VolunteerHub</span>
        </div>
      </header>

      <div className="main-content">
        {/* Left Panel */}
        <section className="login-panel">
          <div className="auth-box">
            <h1 className="hero-title">
              🎓 College Event <br /> Volunteer Management System
            </h1>

            <p className="hero-subtitle">
              A centralized platform for students, organizers, and admins to
              manage campus events and volunteer participation seamlessly.
            </p>

            <div className="action-container">
              <button
                className="google-signin-btn-blue-small"
                onClick={handleLogin}
                disabled={signingIn || loading}
              >
                {signingIn ? "Signing in..." : "Login with Google"}
              </button>
            </div>
          </div>
        </section>

        {/* Right Panel */}
        <section className="display-panel">
          <div className="visual-container">
            <img
              src="https://t4.ftcdn.net/jpg/00/32/06/91/360_F_32069160_96JpOLqNYK15MBN3UPlXBpZjuj3HyGqx.jpg"
              alt="College Volunteers"
              className="permanent-hero-img"
            />
          </div>

          <div className="about-content">
            <h2 className="about-heading">✨ About VolunteerHub</h2>
            <ul className="feature-list">
              <li>📅 Discover and join campus events</li>
              <li>🤝 Volunteer for cultural, technical & social programs</li>
              <li>🧑‍💼 Organizers manage events & volunteers</li>
              <li>🛡️ Admins control roles, access & approvals</li>
              <li>⚡ Secure Google login with role-based routing</li>
            </ul>
          </div>
        </section>
      </div>

      <footer className="login-footer">
        © 2026 Campus Event Volunteer System
      </footer>
    </div>
  );
};

export default Login;
