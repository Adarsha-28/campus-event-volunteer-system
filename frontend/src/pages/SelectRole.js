import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const SelectRole = () => {
  const { user, setRole, setNeedsRoleSelection } = useAuth();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  if (!user) return null;

  // Restrict college email
  if (!user.email?.endsWith("@sece.ac.in")) {
    return (
      <div style={{ textAlign: "center", marginTop: 100 }}>
        <h3>Access Restricted</h3>
        <p>Please login using your @sece.ac.in email</p>
      </div>
    );
  }

  const selectRole = async (role) => {
    if (saving) return;
    setSaving(true);

    try {
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        role,
        createdAt: serverTimestamp()
      });

      // ✅ UPDATE AUTH CONTEXT
      setRole(role);
      setNeedsRoleSelection(false);

      // ✅ NAVIGATE TO DASHBOARD
      navigate(
        role === "admin"
          ? "/admin"
          : role === "organizer"
          ? "/organizer"
          : "/user",
        { replace: true }
      );
    } catch (err) {
      console.error("Role selection failed:", err);
      alert("Unable to save role. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: 100 }}>
      <h2>Select Your Role</h2>
      <p>This is required only once</p>

      <button onClick={() => selectRole("user")} disabled={saving}>
        {saving ? "Saving..." : "User"}
      </button>

      <br /><br />

      <button onClick={() => selectRole("organizer")} disabled={saving}>
        {saving ? "Saving..." : "Organizer"}
      </button>
    </div>
  );
};

export default SelectRole;