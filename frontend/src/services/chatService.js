import {
  doc,
  setDoc,
  updateDoc,
  getDoc,
  collection,
  addDoc,
  serverTimestamp
} from "firebase/firestore";
import { db } from "../firebase/firebase";

/* CREATE CHAT PORTAL */
export const createChatPortal = async (eventId, organizerId) => {
  const ref = doc(db, "eventChats", eventId);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    await setDoc(ref, {
      active: true,
      createdBy: organizerId,
      createdAt: serverTimestamp()
    });
  } else {
    await updateDoc(ref, { active: true });
  }
};

/* DELETE CHAT PORTAL */
export const deleteChatPortal = async (eventId) => {
  await updateDoc(doc(db, "eventChats", eventId), {
    active: false
  });
};

/* SEND MESSAGE */
export const sendMessage = async (eventId, userId, text, senderName) => {
  const messagesRef = collection(db, "eventChats", eventId, "messages");

  await addDoc(messagesRef, {
    senderId: userId,
    senderName: senderName || "Unknown User", // NEVER undefined
    text,
    createdAt: serverTimestamp()
  });
};
