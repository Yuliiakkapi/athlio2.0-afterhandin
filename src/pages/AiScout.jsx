import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MagnifyingGlass, Sparkle } from "@phosphor-icons/react";
import "./AiScout.css";

const CHIPS = [
  "Who compares to young Modric at 17?",
  "How many goals did Division 2's top scorer score?",
  "How many goals has the best shooter of Division 2",
];

export default function AiScout() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  return (
    <div className="ai-scout-page">
      <div className="ai-scout-topbar">
        <button
          className="ai-scout-back-btn"
          onClick={() => navigate(-1)}
          aria-label="Go back"
        >
          <ArrowLeft size={24} weight="regular" />
        </button>
      </div>

      <div className="ai-scout-hero">
        <p className="ai-scout-title">AI Scout</p>
        <div className="ai-scout-icon-wrap">
          <Sparkle size={52} weight="fill" color="white" />
        </div>
      </div>

      <div className="ai-scout-chips-row">
        {CHIPS.map((chip) => (
          <button
            key={chip}
            className="ai-scout-chip"
            onClick={() => setQuery(chip)}
          >
            {chip}
          </button>
        ))}
      </div>

      <div className="ai-scout-input-wrap">
        <button className="ai-scout-input-btn" aria-label="Open AI Scout input">
          <MagnifyingGlass size={18} color="var(--neutral-700, #7d7c86)" />
          <span className="ai-scout-input-placeholder">
            {query || "Write AI Scout"}
          </span>
        </button>
      </div>
    </div>
  );
}
