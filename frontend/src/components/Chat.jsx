import { useEffect, useRef, useState, useMemo } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import apiClient from "../api/apiClient";
import { useUser } from "../context/UserContext";
import '../css/Chat.css';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Chat({ projectId }) {
  const { user } = useUser();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [error, setError] = useState("");
  
  const endRef = useRef(null);
  
  const scrollToBottom = () => {
    requestAnimationFrame(() => endRef.current?.scrollIntoView({ behavior: "smooth" }));
  };

  const token = localStorage.getItem("accessToken");

  const socketUrl = useMemo(() => {
    return `${BASE_URL}/ws/chat/${projectId}/?token=${encodeURIComponent(token)}`;
  }, [projectId, token]);

  useEffect(() => {
    if (!projectId) return;

    const fetchHistory = async () => {
      try {
        const res = await apiClient.get(`/projects/${projectId}/chat`);
        setMessages(res.data.results.reverse());
        scrollToBottom();
      } catch (e) {
        console.error(e);
        setError("Błąd historii czatu.");
      }
    };

    fetchHistory();
  }, [projectId]);

  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(socketUrl, {
    shouldReconnect: () => true
  });

  useEffect(() => {
    if (lastJsonMessage) {
      setMessages((prev) => [...prev, lastJsonMessage]);
      scrollToBottom();
    }
  }, [lastJsonMessage]);

  const handleSend = (e) => {
    e.preventDefault();
    const msg = newMessage.trim();
    
    if (!msg || readyState !== ReadyState.OPEN) return;

    sendJsonMessage({ message: msg });
    setNewMessage("");
  };

  return (
    <div className="chat">
      <div className="chat-header">
        <span className="chat-status">
            {readyState === ReadyState.OPEN ? "Połączono" : "Łączenie..."}
        </span>
      </div>

      {error && <div className="chat-error">{error}</div>}

      <div className="chat-messages">
        {messages.map((m) => {
          const isMine = m.username === user?.username;
          return (
            <div key={m.id} className={`chat-message ${isMine ? "chat-message-mine" : ""}`}>
              <div className="chat-message-user">{m.username}</div>
              <div className="chat-message-text">{m.message}</div>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>

      <form className="chat-form" onSubmit={handleSend}>
        <input
          className="chat-input"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Napisz wiadomość..."
          disabled={readyState !== ReadyState.OPEN}
        />
        <button
          className="chat-button"
          type="submit"
          disabled={readyState !== ReadyState.OPEN || !newMessage.trim()}
        >
          Wyślij
        </button>
      </form>
    </div>
  );
}

export default Chat;