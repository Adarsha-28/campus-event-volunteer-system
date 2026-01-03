import { signInWithPopup, signOut } from "firebase/auth";
import { auth, provider } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

let loginPromise = null;

export const googleLogin = async () => {
  if (loginPromise) return loginPromise;

  loginPromise = (async () => {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    if (!user.email.endsWith("@sece.ac.in")) {
      await signOut(auth);
      throw new Error("Use @sece.ac.in email only");
    }

    const snap = await getDoc(doc(db, "users", user.uid));

    return {
      user,
      isNewUser: !snap.exists(),
      role: snap.exists() ? snap.data().role : null
    };
  })();

  try {
    return await loginPromise;
  } finally {
    loginPromise = null;
  }
};
