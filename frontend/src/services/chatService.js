import {
  doc,
  updateDoc,
  arrayUnion,
  serverTimestamp,
  setDoc,
  getDoc
} from "firebase/firestore";
import { db } from "../firebase/firebase";

/* INIT CHAT */
export const initChat = async (eventId) => {
  const ref = doc(db, "eventChats", eventId);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, { messages: [] });
  }
};

/* SEND MESSAGE */
export const sendMessage = async (eventId, userId, text) => {
  await updateDoc(doc(db, "eventChats", eventId), {
    messages: arrayUnion({
      senderId: userId,
      text,
      createdAt: serverTimestamp()
    })
  });
};