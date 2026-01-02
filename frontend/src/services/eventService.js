import {
  collection,
  addDoc,
  doc,
  updateDoc,
  getDoc,
  arrayUnion,
  serverTimestamp
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
  await updateDoc(doc(db, "events", eventId), {
    status: "frozen"
  });
};