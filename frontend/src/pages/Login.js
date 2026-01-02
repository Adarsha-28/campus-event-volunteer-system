import { googleLogin } from "../firebase/authService";
import { saveUserIfNotExists } from "../firebase/userService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";

const Login = () => {
  const navigate = useNavigate();
  const { user, role } = useAuth();

  const handleLogin = async () => {
    try {
      const loggedUser = await googleLogin();
      await saveUserIfNotExists(loggedUser);
      // ❌ DO NOT redirect here
    } catch (err) {
      alert("Login failed");
    }
  };

  // ✅ Redirect AFTER auth + role is ready
  useEffect(() => {
    if (user && role) {
      if (role === "admin") navigate("/admin");
      else if (role === "organizer") navigate("/organizer");
      else navigate("/user");
    }
  }, [user, role, navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Campus Event Volunteer System</h2>
      <button onClick={handleLogin}>Sign in with Google</button>
    </div>
  );
};

export default Login;
