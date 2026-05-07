import { useEffect, useRef, useState } from "react";
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

// Card height (78) + gap (8) = one slot
const SLOT = 86;

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
  // Stable id counter and notif index pointer — no stale closures
  const nextId    = useRef(3);
  const nextNotif = useRef(3); // initial cards use indices 0-2

  const [cards, setCards] = useState(() =>
    NOTIFICATIONS.slice(0, 3).map((notif, i) => ({ id: i, notif }))
  );
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const ANIM_MS = 800; // must match CSS transition duration
    const HOLD_MS = 4000;

    const timer = setInterval(() => {
      setAnimating(true);

      // Wait for transition to fully finish (+60ms buffer) before swapping DOM
      setTimeout(() => {
        setCards(prev => [
          ...prev.slice(1),
          {
            id: nextId.current++,
            notif: NOTIFICATIONS[nextNotif.current++ % NOTIFICATIONS.length],
          },
        ]);
        setAnimating(false);
      }, ANIM_MS + 60);
    }, HOLD_MS);

    return () => clearInterval(timer);
  }, []);

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

        {/* Ticker cards — overflow hidden clips exiting top card and incoming bottom card */}
        <div className="notif-cards" aria-live="polite" aria-atomic="true">
          {cards.map((item, i) => (
            <div
              key={item.id}
              className="notif-card-slot"
              style={{
                transform: `translateY(${(animating ? i - 1 : i) * SLOT}px)`,
                opacity: i === 0 && animating ? 0 : 1,
                transition: animating
                  ? "transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.6s ease-in"
                  : "none",
              }}
            >
              <NotifCard card={item.notif} secondary={i === 1} />
            </div>
          ))}
        </div>

        {/* Bottom fade */}
        <div className="notif-fade" aria-hidden="true" />
      </div>
    </div>
  );
}
