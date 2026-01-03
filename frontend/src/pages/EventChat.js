import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
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

// Import CSS
import "../styles/EventChat.css";

const EventChat = () => {
  const { eventId } = useParams();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [chatActive, setChatActive] = useState(false);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const messagesEndRef = useRef(null);

  /* LOAD EVENT */
  useEffect(() => {
    const loadEvent = async () => {
      const snap = await getDoc(doc(db, "events", eventId));
      if (snap.exists()) setEvent({ id: snap.id, ...snap.data() });
    };
    loadEvent();
  }, [eventId]);

  /* CHAT STATUS LISTENER */
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "eventChats", eventId), (snap) => {
      setChatActive(snap.exists() ? snap.data().active : false);
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

  /* AUTO SCROLL TO LATEST MESSAGE */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatTime = (ts) =>
    ts?.toDate().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });

  if (!event) return <p className="chat-empty-msg">Loading event...</p>;
  if (!chatActive) return <p className="chat-empty-msg">❌ Chat portal closed by organizer</p>;
  if (!canAccessChat(user.uid, event))
    return <p className="chat-empty-msg">❌ You are not allowed to access this chat</p>;

  /* SEND MESSAGE */
  const handleSend = async () => {
    if (!text.trim()) return;

    const senderName = user.displayName || user.email || "Unknown User";
    await sendMessage(eventId, user.uid, text, senderName);
    setText("");
  };

  return (
    <div className="event-chat-container">
      <div className="event-chat-header">
        <h2>💬 Event Chat</h2>
      </div>

      <div className="messages-container">
        {messages.length === 0 && (
          <p className="chat-empty-msg">No messages yet. Start the conversation!</p>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`message ${msg.senderId === user.uid ? "message-right" : "message-left"}`}
          >
            <div className="message-meta">
              {msg.senderName} • {formatTime(msg.createdAt)}
            </div>
            <div className="message-text">{msg.text}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-container">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default EventChat;
