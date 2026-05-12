import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft } from "@phosphor-icons/react";
import ProfilePicture from "../components/UI/ProfilePicture";
import RoleBadge from "../components/UI/RoleBadge";
import IconButton from "../components/UI/IconButton";
import "./ChatDetail.css";

// Mock conversation data — replace with real Supabase when ready
const MOCK_CONVERSATIONS_MAP = {
  "1": {
    id: "1",
    name: "Kylian Mbappe",
    role: "Player",
    avatarUrl: null,
    verified: false,
    messages: [
      { id: "1", sender: "other", text: "Hey, how are you?", time: "10:30 AM" },
      { id: "2", sender: "self", text: "Good! How about you?", time: "10:32 AM" },
      { id: "3", sender: "other", text: "Can I ask you sth? I'd like to know how you managed to get into that club", time: "10:35 AM" },
    ],
  },
  "2": {
    id: "2",
    name: "Michael Wikkelsø Østegaard",
    role: "Scout",
    avatarUrl: null,
    verified: false,
    messages: [
      { id: "1", sender: "self", text: "Hi Michael, any updates?", time: "2:00 PM" },
      { id: "2", sender: "other", text: "So what did you decide?", time: "2:15 PM" },
    ],
  },
  "3": {
    id: "3",
    name: "Pep Guardiola",
    role: "Coach",
    avatarUrl: null,
    verified: false,
    messages: [
      { id: "1", sender: "self", text: "Will I be in squad for next match?", time: "9:00 AM" },
      { id: "2", sender: "other", text: "We'll see your performance in training", time: "9:05 AM" },
    ],
  },
  "4": {
    id: "4",
    name: "Jacob Ambæk",
    role: "Player",
    avatarUrl: null,
    verified: false,
    messages: [
      { id: "1", sender: "other", text: "Jacob: Will you come tommorow?", time: "6:00 PM" },
      { id: "2", sender: "self", text: "Yes, definitely!", time: "6:15 PM" },
    ],
  },
  "5": {
    id: "5",
    name: "Jakub Markovic",
    role: "Scout",
    avatarUrl: null,
    verified: false,
    messages: [
      { id: "1", sender: "self", text: "Do you have any ideas where I can go?", time: "1:00 PM" },
      { id: "2", sender: "other", text: "Let me check some clubs", time: "1:30 PM" },
    ],
  },
};

export default function ChatDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [messageText, setMessageText] = useState("");

  const conversation = MOCK_CONVERSATIONS_MAP[id] || null;

  if (!conversation) {
    return (
      <div className="chat-detail-error">
        <p>Conversation not found</p>
      </div>
    );
  }

  const handleSendMessage = () => {
    if (messageText.trim()) {
      // TODO: Send message to backend
      setMessageText("");
    }
  };

  return (
    <div className="chat-detail-page">
      {/* ── Header with back button and user info ──────────────────── */}
      <div className="chat-detail-header">
        <div className="chat-detail-header-top">
          <IconButton
            size="large"
            type="subtle"
            icon={ArrowLeft}
            onClick={() => navigate("/chat")}
          />
        </div>
        <div className="chat-detail-info">
          <ProfilePicture
            imgUrl={conversation.avatarUrl}
            size="medium"
            verified={conversation.verified}
          />
          <div className="chat-detail-name-section">
            <h2 className="chat-detail-name text-base-semibold">{conversation.name}</h2>
            <RoleBadge role={conversation.role} />
          </div>
        </div>
      </div>

      {/* ── Messages list ──────────────────────────────────────────── */}
      <div className="chat-detail-messages">
        {conversation.messages.map((msg) => (
          <div
            key={msg.id}
            className={`chat-message${msg.sender === "self" ? " chat-message--self" : " chat-message--other"}`}
          >
            <div className="chat-message-bubble">{msg.text}</div>
            <span className="chat-message-time text-xs-medium">{msg.time}</span>
          </div>
        ))}
      </div>

      {/* ── Input area ──────────────────────────────────────────────── */}
      <div className="chat-detail-input-wrap">
        <input
          type="text"
          className="chat-detail-input"
          placeholder="Type a message..."
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
        />
        <button
          type="button"
          className="chat-detail-send-btn text-sm-semibold"
          onClick={handleSendMessage}
          disabled={!messageText.trim()}
        >
          Send
        </button>
      </div>
    </div>
  );
}
