import { useEffect, useState } from "react";
import stadiumImg from "../../../assets/images/stadium-notif.jpg";
import avatar1 from "../../../assets/images/notif-avatar-1.jpg";
import avatar2 from "../../../assets/images/notif-avatar-2.jpg";
import "./Notifications.css";

const NOTIFICATIONS = [
  {
    name: "Magui Sainz",
    role: "Scout",
    msg: "Hi! We invite you to go for a trial in FC Barcelona?",
    avatar: avatar1,
  },
  {
    name: "Jośe Mourinho",
    role: "Coach",
    msg: "Are you ready to invest in your future?",
    avatar: avatar2,
  },
  {
    name: "Pep Guardiola",
    role: "Coach",
    msg: "I'd love to have you train with us next season.",
    initials: "PG",
    color: "#2563eb",
  },
  {
    name: "Real Madrid CF",
    role: "Club",
    msg: "Your profile has been added to our watchlist.",
    initials: "RM",
    color: "#d4af37",
  },
  {
    name: "Marco Ferrari",
    role: "Scout",
    msg: "Watched your highlights — let's talk opportunities.",
    initials: "MF",
    color: "#16a34a",
  },
  {
    name: "Ajax Academy",
    role: "Club",
    msg: "Applications for our trial camp are now open.",
    initials: "AJ",
    color: "#dc2626",
  },
];

// Group into pairs [[0,1],[2,3],[4,5]]
const PAIRS = Array.from({ length: NOTIFICATIONS.length / 2 }, (_, i) => [
  NOTIFICATIONS[i * 2],
  NOTIFICATIONS[i * 2 + 1],
]);

function NotifAvatar({ card }) {
  if (card.avatar) {
    return <img src={card.avatar} alt={card.name} className="notif-card-avatar" />;
  }
  return (
    <div className="notif-card-avatar notif-card-avatar--initials" style={{ background: card.color }}>
      {card.initials}
    </div>
  );
}

function NotifCard({ card, secondary }) {
  return (
    <div className={`notif-card${secondary ? " notif-card--secondary" : ""}`}>
      <NotifAvatar card={card} />
      <div className="notif-card-body">
        <div className="notif-card-name-row">
          <span className="notif-card-name">{card.name}</span>
          <span className="notif-card-badge">{card.role}</span>
        </div>
        <p className="notif-card-text">{card.msg}</p>
      </div>
    </div>
  );
}

export default function Notifications() {
  const [pairIdx, setPairIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      // Fade out
      setVisible(false);
      setTimeout(() => {
        // Swap cards then fade in
        setPairIdx((i) => (i + 1) % PAIRS.length);
        setVisible(true);
      }, 500);
    }, 3200);

    return () => clearInterval(interval);
  }, []);

  const [top, bottom] = PAIRS[pairIdx];

  return (
    <div className="notif-step">
      {/* Header */}
      <div className="notif-header">
        <h1 className="notif-title">Keep track on the best prospects</h1>
        <p className="notif-subtitle">Turn on notifications to get the most out of the app</p>
      </div>

      {/* Phone mockup + notification cards */}
      <div className="notif-visual">
        {/* Phone frame */}
        <div className="notif-phone">
          <img src={stadiumImg} alt="" className="notif-phone-bg" aria-hidden="true" />
          <div className="notif-phone-dim" aria-hidden="true" />
          <div className="notif-timer" aria-hidden="true">6:07</div>
        </div>

        {/* Animated notification cards */}
        <div
          className="notif-cards"
          style={{ opacity: visible ? 1 : 0, transition: "opacity 0.5s ease" }}
          aria-live="polite"
          aria-atomic="true"
        >
          <NotifCard card={top} secondary={false} />
          <NotifCard card={bottom} secondary={true} />
        </div>

        {/* Bottom fade */}
        <div className="notif-fade" aria-hidden="true" />
      </div>
    </div>
  );
}
