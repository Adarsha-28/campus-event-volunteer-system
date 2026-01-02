import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import getAllEvents from "../services/eventQueryService";
import { joinEvent } from "../services/eventService";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

const UserDashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

  /* FETCH EVENTS*/
  const fetchEvents = async () => {
    try {
      setLoadingEvents(true);
      const data = await getAllEvents();
      setEvents(data || []);
    } catch (err) {
      console.error("Error fetching events:", err);
      setEvents([]);
    } finally {
      setLoadingEvents(false);
    }
  };

  useEffect(() => {
    if (user) fetchEvents();
  }, [user]);

  /* JOIN EVENT*/
  const handleJoin = async (eventId) => {
    if (!user?.uid) return alert("You must be logged in");

    try {
      await joinEvent(eventId, user.uid);
      fetchEvents();
    } catch (err) {
      alert(err.message);
    }
  };

  /* CHECK CHAT STATUS */
  const isChatActive = async (eventId) => {
    const snap = await getDoc(doc(db, "eventChats", eventId));
    return snap.exists() && snap.data().active;
  };

  if (loading) return <p>Loading user info...</p>;
  if (loadingEvents) return <p>Loading events...</p>;

  return (
    <>
      <h2>User Dashboard</h2>
      <p>Browse and join events</p>

      {events.length === 0 && <p>No events available.</p>}

      {events.map((event) => {
        const volunteersCount = event.volunteers?.length || 0;
        const userJoined = event.volunteers?.includes(user.uid);
        const canJoin =
          event.status !== "frozen" &&
          volunteersCount < event.maxVolunteers;

        return (
          <div
            key={event.id}
            style={{
              border: "1px solid gray",
              margin: 10,
              padding: 10,
              borderRadius: 6
            }}
          >
            <h3>{event.title}</h3>

            <p>
              Volunteers: {volunteersCount} / {event.maxVolunteers}
            </p>

            <p>Status: {event.status}</p>

            <button
              onClick={() => handleJoin(event.id)}
              disabled={!canJoin || userJoined}
            >
              {userJoined ? "Joined ✅" : canJoin ? "Join" : "Full / Frozen ❌"}
            </button>

            {/* CHAT BUTTON – ONLY FOR JOINED USERS */}
            {userJoined && (
              <button
                style={{ marginLeft: 10 }}
                onClick={async () => {
                  const active = await isChatActive(event.id);
                  if (!active) {
                    alert("Chat portal not available");
                    return;
                  }
                  navigate(`/event/${event.id}/chat`);
                }}
              >
                Open Chat
              </button>
            )}
          </div>
        );
      })}
    </>
  );
};

export default UserDashboard;