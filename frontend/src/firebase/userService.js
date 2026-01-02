import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

export const saveUserIfNotExists = async (user) => {
  if (!user) return;

  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      name: user.displayName || "Unknown",
      email: user.email,
      role: "user", // default role
      createdAt: serverTimestamp(),
    });
    console.log("✅ New user saved:", user.email);
  } else {
    console.log("ℹ️ User already exists:", user.email);
  }
};
