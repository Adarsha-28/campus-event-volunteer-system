import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import getAllEvents from "../services/eventQueryService";
import { joinEvent } from "../services/eventService";

const UserDashboard = () => {
  const { user, loading } = useAuth(); // get user info and loading state
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

  // Fetch all events
  const fetchEvents = async () => {
    try {
      setLoadingEvents(true);
      const data = await getAllEvents(); // array of events
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

  // Join an event
  const handleJoin = async (eventId) => {
    if (!user?.uid) return alert("You must be logged in to join events!");

    try {
      await joinEvent(eventId, user.uid);
      fetchEvents(); // refresh events after joining
    } catch (err) {
      alert(err.message);
    }
  };

  // Loading states
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
        const canJoin = event.status !== "frozen" && volunteersCount < event.maxVolunteers;

        return (
          <div
            key={event.id}
            style={{
              border: "1px solid gray",
              margin: 10,
              padding: 10,
              borderRadius: 6,
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
              style={{
                padding: "6px 12px",
                cursor: canJoin && !userJoined ? "pointer" : "not-allowed",
              }}
            >
              {userJoined ? "Joined ✅" : canJoin ? "Join" : "Full / Frozen ❌"}
            </button>
          </div>
        );
      })}
    </>
  );
};

export default UserDashboard;
