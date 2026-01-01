import { googleLogin } from "../firebase/authService";
import { saveUserIfNotExists } from "../firebase/userService";

const Login = () => {
  const handleLogin = async () => {
    try {
      const user = await googleLogin();
      await saveUserIfNotExists(user);
      window.location.href = "/dashboard";
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Campus Event Volunteer System</h2>
      <button onClick={handleLogin}>
        Sign in with Google
      </button>
    </div>
  );
};

export default Login;
