import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "./firebase";
import { saveUserIfNotExists } from "./userService";

export const googleLogin = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Save new user to Firestore
    await saveUserIfNotExists(user);

    return user; // return user to be used if needed
  } catch (error) {
    console.error("Google login error:", error);
    throw error;
  }
};
