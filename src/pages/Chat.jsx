import { useState } from "react";
import ConversationCard from "../components/domain/Messages/ConversationCard";
import "./Chat.css";

/* ── Mock data ─────────────────────────────────────────────────────
   Replace with real Supabase data when the messages table is ready.
────────────────────────────────────────────────────────────────── */
const MOCK_CONVERSATIONS = [
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
  const [activeTab, setActiveTab] = useState("recent");

  const conversations =
    activeTab === "unread"
      ? MOCK_CONVERSATIONS.filter((c) => c.unread)
      : MOCK_CONVERSATIONS;

  return (
    <div className="chat-page">

      {/* ── Tab bar — sticky below the fixed Topbar ──────────────── */}
      <div className="chat-tabs-wrap">
        <div className="chat-tabs">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`chat-tab${activeTab === tab.id ? " chat-tab--active" : ""}`}
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
        {conversations.length === 0 ? (
          <p className="chat-empty">No unread messages</p>
        ) : (
          conversations.map((conv) => (
            <ConversationCard
              key={conv.id}
              name={conv.name}
              role={conv.role}
              avatarUrl={conv.avatarUrl}
              preview={conv.preview}
              time={conv.time}
              unread={conv.unread}
              verified={conv.verified}
              onClick={() => {/* navigate to /chat/:id */}}
            />
          ))
        )}
      </div>
    </div>
  );
}
