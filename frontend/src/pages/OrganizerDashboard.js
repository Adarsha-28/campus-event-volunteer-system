import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { createEvent, freezeEvent } from "../services/eventService";
import  getOrganizerEvents  from "../services/eventQueryService";

const OrganizerDashboard = () => {
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [maxVolunteers, setMaxVolunteers] = useState("");
  const [events, setEvents] = useState([]);

  // Fetch organizer events
  const loadEvents = async () => {
    const data = await getOrganizerEvents(user.uid);
    setEvents(data);
  };

  useEffect(() => {
    if (user) loadEvents();
  }, [user]);

  // Create event
  const handleCreate = async () => {
    if (!title || !maxVolunteers) return alert("Fill all fields");

    await createEvent(
      { title, maxVolunteers: Number(maxVolunteers) },
      user.uid
    );

    setTitle("");
    setMaxVolunteers("");
    loadEvents();
  };

  return (
    <>
      <h2>Organizer Dashboard</h2>

      {/* Create Event */}
      <h3>Create Event</h3>
      <input
        placeholder="Event title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="number"
        placeholder="Max volunteers"
        value={maxVolunteers}
        onChange={(e) => setMaxVolunteers(e.target.value)}
      />
      <button onClick={handleCreate}>Create Event</button>

      <hr />

      {/* Events List */}
      <h3>My Events</h3>

      {events.length === 0 && <p>No events created yet</p>}

      {events.map((event) => (
        <div key={event.id} style={{ border: "1px solid gray", margin: 10 }}>
          <h4>{event.title}</h4>
          <p>
            Volunteers: {event.volunteers.length} / {event.maxVolunteers}
          </p>
          <p>Status: {event.status}</p>

          {event.status === "open" && (
            <button onClick={() => freezeEvent(event.id)}>
              Freeze Event
            </button>
          )}
        </div>
      ))}
    </>
  );
};

export default OrganizerDashboard;
