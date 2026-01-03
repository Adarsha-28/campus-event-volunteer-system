import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [needsRoleSelection, setNeedsRoleSelection] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);

      try {
        if (!currentUser) {
          // Fully reset state on logout
          setUser(null);
          setRole(null);
          setNeedsRoleSelection(false);
          setLoading(false);
          return;
        }

        setUser(currentUser);

        const ref = doc(db, "users", currentUser.uid);
        const snap = await getDoc(ref);

        if (snap.exists() && snap.data()?.role) {
          setRole(snap.data().role);
          setNeedsRoleSelection(false);
        } else {
          setRole(null);
          setNeedsRoleSelection(true);
        }
      } catch (error) {
        console.error("AuthContext error:", error);
        setRole(null);
        setNeedsRoleSelection(true);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        needsRoleSelection,
        loading,
        setRole,
        setNeedsRoleSelection
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
