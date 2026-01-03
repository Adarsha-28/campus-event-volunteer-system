import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  createEvent,
  freezeEvent,
  deleteEvent,
} from "../services/eventService";
import getOrganizerEvents from "../services/eventQueryService";
import { createChatPortal, deleteChatPortal } from "../services/chatService";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

// Import CSS
import "../styles/OrganizerDashboard.css";

const OrganizerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [maxVolunteers, setMaxVolunteers] = useState("");
  const [events, setEvents] = useState([]);
  const [chatStatus, setChatStatus] = useState({});

  /* SAFE CHAT STATUS LOADER (FIXES PERMISSION ERROR) */
  const loadChatStatus = async (eventId) => {
    try {
      const snap = await getDoc(doc(db, "eventChats", eventId));
      return snap.exists() && snap.data().active === true;
    } catch (err) {
      return false;
    }
  };

  /* LOAD ORGANIZER EVENTS */
  const loadEvents = async () => {
    if (!user?.uid) return;

    const data = await getOrganizerEvents(user.uid);
    setEvents(data || []);

    const statusMap = {};
    for (const ev of data || []) {
      statusMap[ev.id] = await loadChatStatus(ev.id);
    }
    setChatStatus(statusMap);
  };

  useEffect(() => {
    loadEvents();
  }, [user]);

  /* CREATE EVENT */
  const handleCreate = async () => {
    if (!title || !maxVolunteers) {
      alert("Fill all fields");
      return;
    }

    await createEvent(
      { title, maxVolunteers: Number(maxVolunteers) },
      user.uid
    );

    setTitle("");
    setMaxVolunteers("");
    loadEvents();
  };

  return (
    <div className="organizer-dashboard">
      <h2>Organizer Dashboard</h2>

      {/* CREATE EVENT */}
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

      {/* EVENTS LIST */}
      <h3>My Events</h3>

      {events.length === 0 && <p>No events created yet</p>}

      <div>
        {events.map((event) => (
          <div key={event.id}>
            <h4>{event.title}</h4>

            <p>
              Volunteers: {event.volunteers.length} / {event.maxVolunteers}
            </p>

            <p>Status: {event.status}</p>

            <br />

            {/* ORGANIZER-ONLY CONTROLS */}
            {event.organizerId === user.uid && (
              <>
                {/* FREEZE EVENT BUTTON */}
                {event.status === "open" && (
                  <button
                    className="btn-freeze"
                    onClick={async () => {
                      await freezeEvent(event.id); // update DB
                      await loadEvents(); // refresh UI to hide this button
                    }}
                  >
                    Freeze Event
                  </button>
                )}

                {/* CREATE CHAT */}
                {!chatStatus[event.id] && (
                  <button
                    onClick={async () => {
                      await createChatPortal(event.id, user.uid);
                      loadEvents();
                    }}
                    style={{ marginLeft: 10 }}
                  >
                    Create Chat Portal
                  </button>
                )}

                {/* OPEN + DELETE CHAT */}
                {chatStatus[event.id] && (
                  <>
                    <button
                      onClick={() => navigate(`/event/${event.id}/chat`)}
                      style={{ marginLeft: 10 }}
                    >
                      Open Chat
                    </button>

                    <button
                      onClick={async () => {
                        await deleteChatPortal(event.id);
                        loadEvents();
                      }}
                      style={{ marginLeft: 10, color: "red" }}
                    >
                      Delete Chat Portal
                    </button>
                  </>
                )}

                {/* DELETE EVENT */}
                <button
                  onClick={async () => {
                    const ok = window.confirm(
                      "Are you sure? This will delete the event and chat permanently."
                    );
                    if (!ok) return;

                    await deleteEvent(event.id);
                    loadEvents();
                  }}
                  style={{
                    marginLeft: 10,
                    backgroundColor: "#ff4d4d",
                    color: "white",
                  }}
                >
                  Delete Event
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrganizerDashboard;
