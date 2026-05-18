import { Sparkle } from "@phosphor-icons/react";
import "./AISuggestion.css";

export default function AISuggestion({ title, desc }) {
  return (
    <div className="ai-suggestion">
      <div className="ai-suggestion-icon">
        <Sparkle size={24} color="var(--black)" />
      </div>
      <div className="ai-suggestion-body">
        <p className="ai-suggestion-title">{title}</p>
        <p className="ai-suggestion-desc">{desc}</p>
      </div>
    </div>
  );
}
