import {
  collection,
  addDoc,
  doc,
  updateDoc,
  getDoc,
  arrayUnion,
  serverTimestamp,
  deleteDoc,
  getDocs
} from "firebase/firestore";
import { db } from "../firebase/firebase";

/* CREATE EVENT */
export const createEvent = async (event, organizerId) => {
  return await addDoc(collection(db, "events"), {
    ...event,
    organizerId,
    volunteers: [],
    status: "open",
    createdAt: serverTimestamp()
  });
};

/* JOIN EVENT */
export const joinEvent = async (eventId, userId) => {
  const ref = doc(db, "events", eventId);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    throw new Error("Event not found");
  }

  const event = snap.data();

  if (event.status === "frozen") {
    throw new Error("Event is frozen");
  }

  if (event.volunteers.length >= event.maxVolunteers) {
    throw new Error("Volunteer limit reached");
  }

  await updateDoc(ref, {
    volunteers: arrayUnion(userId)
  });
};

/* FREEZE EVENT */
export const freezeEvent = async (eventId) => {
  // Update status to "frozen" in Firestore
  await updateDoc(doc(db, "events", eventId), {
    status: "frozen"
  });
};

/* DELETE EVENT (SAFE CASCADE) */
export const deleteEvent = async (eventId) => {
  try {
    // 1️⃣ Delete chat messages (if any)
    const messagesRef = collection(db, "eventChats", eventId, "messages");
    const messagesSnap = await getDocs(messagesRef);
    for (const msg of messagesSnap.docs) {
      try {
        await deleteDoc(msg.ref);
      } catch (err) {
        console.warn("Message delete failed:", err.message);
      }
    }

    // 2️⃣ Delete chat portal (if exists)
    try {
      await deleteDoc(doc(db, "eventChats", eventId));
    } catch (err) {
      // chat may not exist — ignore safely
    }

    // 3️⃣ Delete event
    await deleteDoc(doc(db, "events", eventId));
    console.log("✅ Event deleted successfully");
  } catch (error) {
    console.error("❌ Failed to delete event:", error);
    throw error;
  }
};
