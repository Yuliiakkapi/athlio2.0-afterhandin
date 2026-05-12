import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import ConversationCard from "../components/domain/Messages/ConversationCard";
import "./Chat.css";

/* ── Mock data ─────────────────────────────────────────────────────
   Replace with real Supabase data when the messages table is ready.
────────────────────────────────────────────────────────────────── */
const MOCK_CONVERSATIONS_INITIAL = [
  {
    id: "1",
    name: "Kylian Mbappe",
    role: "Player",
    avatarUrl: null,
    preview: "You: Can I ask you sth? I'd like to know how",
    time: "40 mins ago",
    unread: true,
    verified: false,
  },
  {
    id: "2",
    name: "Michael Wikkelsø Østegaard",
    role: "Scout",
    avatarUrl: null,
    preview: "Michael: So what did you decide?",
    time: "2h ago",
    unread: true,
    verified: false,
  },
  {
    id: "3",
    name: "Pep Guardiola",
    role: "Coach",
    avatarUrl: null,
    preview: "You: Will I be in squad for next match?",
    time: "6h ago",
    unread: false,
    verified: false,
  },
  {
    id: "4",
    name: "Jacob Ambæk",
    role: "Player",
    avatarUrl: null,
    preview: "Jacob: Will you come tommorow?",
    time: "6h ago",
    unread: false,
    verified: false,
  },
  {
    id: "5",
    name: "Jakub Markovic",
    role: "Scout",
    avatarUrl: null,
    preview: "You: Do you have any ideas where I can fo",
    time: "12h ago",
    unread: true,
    verified: false,
  },
];

const TABS = [
  { id: "recent", label: "Recent" },
  { id: "unread", label: "Unread" },
];

export default function Chat() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("recent");
  
  // Initialize conversations from localStorage or mock data
  const [conversations, setConversations] = useState(() => {
    try {
      const stored = localStorage.getItem("conversations");
      return stored ? JSON.parse(stored) : MOCK_CONVERSATIONS_INITIAL;
    } catch {
      return MOCK_CONVERSATIONS_INITIAL;
    }
  });

  // Save conversations to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("conversations", JSON.stringify(conversations));
  }, [conversations]);

  const handleConversationClick = (convId) => {
    // Mark as read
    setConversations((prevConvs) =>
      prevConvs.map((conv) =>
        conv.id === convId ? { ...conv, unread: false } : conv
      )
    );
    // Navigate to conversation
    navigate(`/chat/${convId}`);
  };

  const displayedConversations =
    activeTab === "unread"
      ? conversations.filter((c) => c.unread)
      : conversations;

  return (
    <div className="chat-page">

      {/* ── Tab bar — sticky below the fixed Topbar ──────────────── */}
      <div className="chat-tabs-wrap">
        <div className="chat-tabs">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`chat-tab text-base-medium${activeTab === tab.id ? " chat-tab--active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
              <span className="chat-tab-line" />
            </button>
          ))}
        </div>
      </div>

      {/* ── Conversation list ─────────────────────────────────────── */}
      <div className="chat-list">
        {displayedConversations.length === 0 ? (
          <p className="chat-empty text-sm-medium">No unread messages</p>
        ) : (
          displayedConversations.map((conv) => (
            <ConversationCard
              key={conv.id}
              name={conv.name}
              role={conv.role}
              avatarUrl={conv.avatarUrl}
              preview={conv.preview}
              time={conv.time}
              unread={conv.unread}
              verified={conv.verified}
              onClick={() => handleConversationClick(conv.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
