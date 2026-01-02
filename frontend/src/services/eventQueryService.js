import { db } from "../firebase/firebase";
import { collection, getDocs } from "firebase/firestore";

const getAllEvents = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "events"));
    const events = [];
    querySnapshot.forEach((doc) => {
      events.push({ id: doc.id, ...doc.data() });
    });
    return events;
  } catch (err) {
    console.error("Error fetching events:", err);
    return [];
  }
};

export default getAllEvents;
