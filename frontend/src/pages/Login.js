import { useState } from "react";
import { googleLogin } from "../firebase/authService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";

const Login = () => {
  const navigate = useNavigate();
  const { role } = useAuth();
  const [loading, setLoading] = useState(false); // ✅ track login in progress

  useEffect(() => {
    if (role === "admin") navigate("/admin");
    else if (role === "organizer") navigate("/organizer");
    else if (role === "user") navigate("/user");
  }, [role, navigate]);

  const handleLogin = async () => {
    if (loading) return; // prevent multiple clicks
    setLoading(true);

    try {
      await googleLogin(); 
      // role will trigger navigation automatically
    } catch (err) {
      console.error("Login failed:", err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Campus Event Volunteer System</h2>
      <button
        onClick={handleLogin}
        disabled={loading}
        style={{ padding: "10px 20px", marginTop: "20px" }}
      >
        {loading ? "Logging in..." : "Login with Google"}
      </button>
    </div>
  );
};

export default Login;
