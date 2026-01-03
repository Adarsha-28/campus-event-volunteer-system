import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

/* Check whether user already exists in Firestore*/
export const checkUserExists = async (uid) => {
  if (!uid) return null;

  const userRef = doc(db, "users", uid);
  const snap = await getDoc(userRef);

  if (snap.exists()) {
    return snap.data(); // { uid, name, email, role, createdAt }
  }

  return null; // new user
};

/* Save NEW user with SELECTED role (Called ONLY after role selection) */
export const saveNewUserWithRole = async (user, role) => {
  if (!user || !role) return;

  const userRef = doc(db, "users", user.uid);

  await setDoc(userRef, {
    uid: user.uid,
    name: user.displayName || "Unknown",
    email: user.email,
    role, // user-selected role
    createdAt: serverTimestamp(),
  });

  console.log("✅ New user saved with role:", role);
};

/* Update role (optional – future use)*/
export const updateUserRole = async (uid, newRole) => {
  if (!uid || !newRole) return;

  const userRef = doc(db, "users", uid);

  await setDoc(
    userRef,
    { role: newRole },
    { merge: true }
  );

  console.log("🔁 User role updated:", newRole);
};
