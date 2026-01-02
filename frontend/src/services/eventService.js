import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firebase";

export const createEvent = async (event, organizerId) => {
  return await addDoc(collection(db, "events"), {
    ...event,
    organizerId,
    volunteers: [],
    status: "open",
    createdAt: serverTimestamp()
  });
};
