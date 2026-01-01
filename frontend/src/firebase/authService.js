import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "./firebase";

export const googleLogin = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error("Google login error", error);
    throw error;
  }
};
