import { useEffect, useState } from "react";
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

const EventChat = () => {
  const { eventId } = useParams();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [chatActive, setChatActive] = useState(false);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  /* LOAD EVENT*/
  useEffect(() => {
    const loadEvent = async () => {
      const snap = await getDoc(doc(db, "events", eventId));
      if (snap.exists()) {
        setEvent({ id: snap.id, ...snap.data() });
      }
    };
    loadEvent();
  }, [eventId]);

  /* CHAT STATUS LISTENER*/
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "eventChats", eventId), (snap) => {
      if (snap.exists()) setChatActive(snap.data().active);
    });
    return () => unsub();
  }, [eventId]);

  /* MESSAGES LISTENER*/
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

  if (!event) return <p>Loading event...</p>;
  if (!chatActive) return <p>❌ Chat portal closed by organizer</p>;
  if (!canAccessChat(user.uid, event))
    return <p>❌ You are not allowed to access this chat</p>;

  /* SEND MESSAGE */
  const handleSend = async () => {
    if (!text.trim()) return;
    await sendMessage(eventId, user.uid, text);
    setText("");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>💬 Event Chat</h2>

      <div
        style={{
          border: "1px solid gray",
          height: 350,
          overflowY: "auto",
          padding: 10,
          marginBottom: 10
        }}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              textAlign: msg.senderId === user.uid ? "right" : "left",
              marginBottom: 8
            }}
          >
            <small>
              {msg.senderName} • {formatTime(msg.createdAt)}
            </small>
            <div
              style={{
                background: "#f1f1f1",
                display: "inline-block",
                padding: "6px 10px",
                borderRadius: 8
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type message..."
        style={{ width: "80%" }}
      />
      <button onClick={handleSend} style={{ marginLeft: 10 }}>
        Send
      </button>
    </div>
  );
};

export default EventChat;