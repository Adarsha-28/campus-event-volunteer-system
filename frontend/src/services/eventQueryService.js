import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/firebase";

/* Organizer events */
export const getOrganizerEvents = async (uid) => {
  const q = query(
    collection(db, "events"),
    where("organizerId", "==", uid)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

/* All events */
export const getAllEvents = async () => {
  const snap = await getDocs(collection(db, "events"));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};