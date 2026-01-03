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

  /* FETCH EVENTS */
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

  /* JOIN EVENT */
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

  if (loading || loadingEvents)
    return (
      <div className="dashboard-wrapper">
        <p>Loading...</p>
      </div>
    );

  return (
    <div className="user-dashboard-container">
      {/* HEADER */}
      <div className="dashboard-header">
        <h2>User Dashboard</h2>
        <p>Browse and join events</p>
      </div>

      {/* EVENTS GRID */}
      {events.length === 0 ? (
        <p className="empty-msg">No events available.</p>
      ) : (
        <div className="events-grid">
          {events.map((event) => {
            const volunteersCount = event.volunteers?.length || 0;
            const userJoined = event.volunteers?.includes(user.uid);
            const canJoin =
              event.status !== "frozen" &&
              volunteersCount < event.maxVolunteers;

            return (
              <div className="event-card" key={event.id}>
                {/* CARD HEADER */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <h3>{event.title}</h3>
                  <span
                    className={`status-badge ${
                      event.status === "open" ? "open" : "frozen"
                    }`}
                  >
                    {event.status}
                  </span>
                </div>

                {/* VOLUNTEER INFO */}
                <p>
                  Volunteers: {volunteersCount} / {event.maxVolunteers}
                </p>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${(volunteersCount / event.maxVolunteers) * 100}%`,
                    }}
                  ></div>
                </div>

                {/* ACTION BUTTONS */}
                <div
                  style={{
                    display: "flex",
                    marginTop: "10px",
                    flexWrap: "wrap",
                    gap: "10px",
                  }}
                >
                  {/* JOIN BUTTON */}
                  <button
                    className="btn btn-join"
                    onClick={() => handleJoin(event.id)}
                    disabled={!canJoin || userJoined}
                  >
                    {userJoined
                      ? "Joined ✅"
                      : canJoin
                      ? "Join"
                      : "Full / Frozen ❌"}
                  </button>

                  {/* OPEN CHAT – ONLY FOR JOINED USERS */}
                  {userJoined && (
                    <button
                      className="btn btn-chat"
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
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
