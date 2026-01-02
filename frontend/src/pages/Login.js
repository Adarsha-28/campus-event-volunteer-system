 import { googleLogin } from "../firebase/authService";
 import { useNavigate } from "react-router-dom";
 import { useAuth } from "../context/AuthContext";
 import { useEffect } from "react";

const Login = () => {
  const navigate = useNavigate();
  const { role } = useAuth();

  useEffect(() => {
    if (role === "admin") navigate("/admin");
    else if (role === "organizer") navigate("/organizer");
    else if (role === "user") navigate("/user");
  }, [role,navigate]);

  return (
    <div>
      <h2>Campus Event Volunteer System</h2>
      <button onClick={googleLogin}>Login with Google</button>
    </div>
  );
};

export default Login;