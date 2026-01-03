import { useEffect, useState } from "react";
import { googleLogin } from "../firebase/authService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

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
    <div style={{ textAlign: "center", marginTop: 100 }}>
      <h2>Campus Event Volunteer System</h2>
      <button onClick={handleLogin} disabled={loading}>
        {loading ? "Logging in..." : "Login with Google"}
      </button>
    </div>
  );
};

export default Login;

