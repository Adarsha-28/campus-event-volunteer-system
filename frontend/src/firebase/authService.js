import { signInWithPopup, signOut } from "firebase/auth";
import { auth, provider } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

export const googleLogin = async () => {
  const result = await signInWithPopup(auth, provider);
  const user = result.user;
  // domain check
  if (!user.email.endsWith("@sece.ac.in")) {
    await signOut(auth);
    alert("Use @sece.ac.in email only");
    throw new Error("Invalid domain");
  }

  const snap = await getDoc(doc(db, "users", user.uid));

  return {
    user,
    isNewUser: !snap.exists(),
    role: snap.exists() ? snap.data().role : null
  };
};
