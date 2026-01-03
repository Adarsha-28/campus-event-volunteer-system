import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import getAllEvents from "../services/eventQueryService";
import { joinEvent } from "../services/eventService";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import "../styles/UserDashboard.css";

const UserDashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

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

  const handleJoin = async (eventId) => {
    if (!user?.uid) return alert("You must be logged in");
    try {
      await joinEvent(eventId, user.uid);
      fetchEvents();
    } catch (err) {
      alert(err.message);
    }
  };

  const isChatActive = async (eventId) => {
    const snap = await getDoc(doc(db, "eventChats", eventId));
    return snap.exists() && snap.data().active;
  };

  if (loading || loadingEvents) return <div className="dashboard-wrapper"><p>Loading...</p></div>;

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-header">
        <h1>User Dashboard</h1>
        <p>Browse and join events</p>
      </div>

      {events.length === 0 && <p>No events available.</p>}

      {/* This container enables the horizontal layout */}
      <div className="event-grid">
        {events.map((event) => {
          const volunteersCount = event.volunteers?.length || 0;
          const userJoined = event.volunteers?.includes(user?.uid);
          const canJoin = event.status !== "frozen" && volunteersCount < event.maxVolunteers;

          return (
            <div key={event.id} className="event-card">
              <h3 className="event-title">{event.title}</h3>

              <div className="card-body">
                <p><strong>Volunteers:</strong> {volunteersCount} / {event.maxVolunteers}</p>
                <p><strong>Status:</strong> {event.status}</p>
              </div>

              <button
  /* DYNAMIC CLASS LOGIC: This picks the right color from your CSS */
  className={`join-action-btn ${
    userJoined ? "joined" : canJoin ? "join-ready" : "finished"
  }`}
  onClick={() => handleJoin(event.id)}
  disabled={!canJoin || userJoined}
>
  {userJoined ? "Joined ✅" : canJoin ? "Join" : "Full / Frozen ❌"}
</button>

                {userJoined && (
                  <button
                    className="chat-action-btn"
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
      </div>
    </div>
  );
};

export default UserDashboard;