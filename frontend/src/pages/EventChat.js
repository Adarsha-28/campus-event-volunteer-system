import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import "../styles/EventChat.css"; 
import {
  doc,
  getDoc,
  onSnapshot,
  collection,
  query,
  orderBy
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useAuth } from "../context/AuthContext";
import { sendMessage } from "../services/chatService";
import { canAccessChat } from "../utils/chatUtils";

const EventChat = () => {
  const { eventId } = useParams();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [chatActive, setChatActive] = useState(false);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const scrollRef = useRef();

  /* AUTO SCROLL TO BOTTOM */
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  /* LOAD EVENT */
  useEffect(() => {
    const loadEvent = async () => {
      const snap = await getDoc(doc(db, "events", eventId));
      if (snap.exists()) {
        setEvent({ id: snap.id, ...snap.data() });
      }
    };
    loadEvent();
  }, [eventId]);

  /* CHAT STATUS LISTENER */
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "eventChats", eventId), (snap) => {
      if (snap.exists()) setChatActive(snap.data().active);
    });
    return () => unsub();
  }, [eventId]);

  /* MESSAGES LISTENER */
  useEffect(() => {
    const q = query(
      collection(db, "eventChats", eventId, "messages"),
      orderBy("createdAt")
    );

    const unsub = onSnapshot(q, (snap) => {
      setMessages(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    return () => unsub();
  }, [eventId]);

  const formatTime = (ts) =>
    ts?.toDate().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });

  if (!event) return <div className="chat-status">Loading event...</div>;
  if (!chatActive) return <div className="chat-status error">❌ Chat portal closed by organizer</div>;
  if (!canAccessChat(user.uid, event))
    return <div className="chat-status error">❌ Access Denied</div>;

  /* SEND MESSAGE */
  const handleSend = async () => {
    if (!text.trim()) return;
    await sendMessage(eventId, user.uid, text);
    setText("");
  };

  return (
    <div className="chat-page-container">
      <div className="chat-window">
        <div className="chat-header">
          <h3>💬 {event.title} Chat</h3>
        </div>

        <div className="messages-container" ref={scrollRef}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`message-row ${msg.senderId === user.uid ? "my-message" : "other-message"}`}
            >
              <div className="message-bubble">
                <small className="sender-info">
                  {msg.senderName} • {formatTime(msg.createdAt)}
                </small>
                <div className="message-text">{msg.text}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="chat-input-area">
          <input
            className="chat-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type message..."
          />
          <button className="chat-send-btn" onClick={handleSend}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventChat;
