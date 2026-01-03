import { useState, useEffect } from "react";
import { googleLogin } from "../firebase/authService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/global.css";

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
    <div className="login-wrapper">
      {/* Corner Logo */}
      <header className="brand-header">
        <div className="logo-container">
          <span className="logo-emoji">🤝</span>
          <span className="logo-text">VolunteerHub</span>
        </div>
      </header>

      <div className="main-content">
        {/* Left Side */}
        <section className="login-panel">
          <div className="auth-box">
            <h1 className="hero-title">
              🎓 College Event <br/>Volunteer Management System
            </h1>
            <p className="hero-subtitle">
              A centralized platform designed for students and faculty to manage 
              campus events and volunteer coordination with ease.
            </p>
            
            <div className="action-container">
              <button
                className="google-signin-btn-blue-small"
                onClick={handleLogin}
                disabled={loading}
              >
                {loading ? "Signing in..." : "Login with Google"}
              </button>
            </div>
          </div>
        </section>

        {/* Right Side */}
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
              <li>
                <span className="bullet">📅</span> 
                <p>Find & join campus events easily</p>
              </li>
              <li>
                <span className="bullet">🤝</span> 
                <p>Volunteer for technical, cultural & social events</p>
              </li>
              <li>
                <span className="bullet">🧑‍💼</span> 
                <p>Organizers manage events & volunteers</p>
              </li>
              <li>
                <span className="bullet">🛡️</span> 
                <p>Admins control users, roles & approvals</p>
              </li>
              <li>
                <span className="bullet">⚡</span> 
                <p>Secure Google login with role-based access</p>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Login;