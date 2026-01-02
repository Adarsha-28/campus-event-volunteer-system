import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyB2bZfOHFouikg5w0msOza0HSLxkH9mVQI",
  authDomain: "campus-event-volunteer-system.firebaseapp.com",
  projectId: "campus-event-volunteer-system",
  storageBucket: "campus-event-volunteer-system.firebasestorage.app",
  messagingSenderId: "186140325570",
  appId: "1:186140325570:web:5dbc159a81543be12eed5b"
};

export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);

