// EventsPage.js
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import getAllEvents from "../services/eventQueryService";
import { joinEvent } from "../services/eventService";

const Events = () => {
  const { user, loading } = useAuth(); // Get logged-in user + loading
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

  // Fetch all events from backend
  const fetchEvents = async () => {
    try {
      setLoadingEvents(true);
      const data = await getAllEvents(); // returns array of events
      setEvents(data || []);
    } catch (err) {
      console.error("Error fetching events:", err);
      setEvents([]);
    } finally {
      setLoadingEvents(false);
    }
  };

  // Fetch events once user info is loaded
  useEffect(() => {
    if (user) fetchEvents();
  }, [user]);

  // Join event handler
  const handleJoin = async (eventId) => {
    if (!user?.uid) {
      alert("You must be logged in to join events!");
      return;
    }

    try {
      await joinEvent(eventId, user.uid);
      fetchEvents(); // refresh events to show updated volunteer list
    } catch (err) {
      alert(err.message);
    }
  };

  // Show loading messages
  if (loading) return <p>Loading user info...</p>;
  if (loadingEvents) return <p>Loading events...</p>;

  return (
    <>
      <h2>Events</h2>
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
              padding: 10,
              margin: 10,
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
              {userJoined
                ? "Joined ✅"
                : canJoin
                ? "Join"
                : "Full / Frozen ❌"}
            </button>
          </div>
        );
      })}
    </>
  );
};

export default Events;
