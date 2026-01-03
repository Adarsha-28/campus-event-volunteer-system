import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import "../styles/OrganizerDashboard.css"; 
import { createEvent, freezeEvent, deleteEvent } from "../services/eventService";
import getOrganizerEvents from "../services/eventQueryService";
import { createChatPortal, deleteChatPortal } from "../services/chatService";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

const OrganizerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [maxVolunteers, setMaxVolunteers] = useState("");
  const [events, setEvents] = useState([]);
  const [chatStatus, setChatStatus] = useState({});

  const loadChatStatus = async (eventId) => {
    try {
      const snap = await getDoc(doc(db, "eventChats", eventId));
      return snap.exists() && snap.data().active === true;
    } catch (err) { return false; }
  };

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

  useEffect(() => { loadEvents(); }, [user]);

  const handleCreate = async () => {
    if (!title || !maxVolunteers) {
      alert("Fill all fields");
      return;
    }
    await createEvent({ title, maxVolunteers: Number(maxVolunteers) }, user.uid);
    setTitle("");
    setMaxVolunteers("");
    loadEvents();
  };

  return (
    <div className="organizer-container">
      <header className="dashboard-header">
        <h1>Organizer Dashboard</h1>
        <p>Manage your events and volunteer connections</p>
      </header>

      {/* FIXED CREATE EVENT SECTION */}
      <section className="create-event-card permanent-section">
        <h3>Create New Event</h3>
        <div className="input-group">
          <input
            placeholder="Event Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="number"
            placeholder="Max Volunteers"
            value={maxVolunteers}
            onChange={(e) => setMaxVolunteers(e.target.value)}
          />
          <button className="btn-create" onClick={handleCreate}>Create Event</button>
        </div>
      </section>

      <hr className="divider" />

      {/* HORIZONTAL EVENTS SECTION */}
      <section className="events-section">
        <h3>My Active Events</h3>
        {events.length === 0 ? (
          <p className="empty-msg">No events created yet.</p>
        ) : (
          <div className="horizontal-scroll-container">
            {events.map((event) => (
              <div key={event.id} className="org-card">
                <div className="org-card-header">
                  <h4>{event.title}</h4>
                  <span className={`status-badge ${event.status}`}>{event.status}</span>
                </div>

                <div className="org-card-body">
                  <div className="progress-container">
                    <p>Volunteers: <strong>{event.volunteers.length} / {event.maxVolunteers}</strong></p>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${(event.volunteers.length / event.maxVolunteers) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="org-card-actions">
                  {event.status === "open" && (
                    <button className="btn-freeze" onClick={() => {
                        freezeEvent(event.id);
                        loadEvents();
                    }}>
                      Freeze Event
                    </button>
                  )}

                  {!chatStatus[event.id] ? (
                    <button className="btn-chat-create" onClick={async () => {
                      await createChatPortal(event.id, user.uid);
                      loadEvents();
                    }}>
                      Create Chat Portal
                    </button>
                  ) : (
                    <div className="chat-action-group">
                      <button className="btn-chat-open" onClick={() => navigate(`/event/${event.id}/chat`)}>
                        Open Chat
                      </button>
                      <button className="btn-chat-delete" onClick={async () => {
                        await deleteChatPortal(event.id);
                        loadEvents();
                      }}>
                        Delete
                      </button>
                    </div>
                  )}

                  <button className="btn-delete-event" onClick={async () => {
                    if (window.confirm("Delete this event permanently?")) {
                      await deleteEvent(event.id);
                      loadEvents();
                    }
                  }}>
                    Delete Event
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default OrganizerDashboard;