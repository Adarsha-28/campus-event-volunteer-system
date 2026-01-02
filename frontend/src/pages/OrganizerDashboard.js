import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { createEvent, freezeEvent } from "../services/eventService";
import getOrganizerEvents from "../services/eventQueryService";
import {
  createChatPortal,
  deleteChatPortal
} from "../services/chatService";
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

  /* LOAD CHAT STATUS*/
  const loadChatStatus = async (eventId) => {
    const snap = await getDoc(doc(db, "eventChats", eventId));
    return snap.exists() && snap.data().active;
  };

  /* LOAD ORGANIZER EVENTS*/
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

  /* CREATE EVENT*/
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
    <>
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

      {events.map((event) => (
        <div
          key={event.id}
          style={{
            border: "1px solid gray",
            margin: 10,
            padding: 10,
            borderRadius: 6
          }}
        >
          <h4>{event.title}</h4>

          <p>
            Volunteers: {event.volunteers.length} / {event.maxVolunteers}
          </p>

          <p>Status: {event.status}</p>

          {/* FREEZE EVENT */}
          {event.status === "open" && (
            <button onClick={() => freezeEvent(event.id)}>
              Freeze Event
            </button>
          )}

          <br />
          <br />

          {/* CHAT CONTROLS
             (ONLY FOR THIS ORGANIZER'S EVENT)*/}
          {event.organizerId === user.uid && (
            <>
              {/* CREATE CHAT */}
              {!chatStatus[event.id] && (
                <button
                  onClick={async () => {
                    await createChatPortal(event.id, user.uid);
                    loadEvents();
                  }}
                >
                  Create Chat Portal
                </button>
              )}

              {/* OPEN + DELETE CHAT */}
              {chatStatus[event.id] && (
                <>
                  <button
                    onClick={() =>
                      navigate(`/event/${event.id}/chat`)
                    }
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
            </>
          )}
        </div>
      ))}
    </>
  );
};

export default OrganizerDashboard;
