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

/* SEND MESSAGE — NEVER FAILS */
export const sendMessage = async (eventId, userId, text) => {
  const chatRef = doc(db, "eventChats", eventId);
  const chatSnap = await getDoc(chatRef);

  if (!chatSnap.exists() || chatSnap.data().active !== true) {
    throw new Error("Chat portal is not active");
  }

  // 🔐 FETCH USER SAFELY
  const userSnap = await getDoc(doc(db, "users", userId));

  const senderName =
    userSnap.exists() && userSnap.data().email
      ? userSnap.data().email
      : "Unknown User";

  const messagesRef = collection(chatRef, "messages");

  await addDoc(messagesRef, {
    senderId: userId,
    senderName, // ✅ GUARANTEED STRING
    text,
    createdAt: serverTimestamp()
  });
};
