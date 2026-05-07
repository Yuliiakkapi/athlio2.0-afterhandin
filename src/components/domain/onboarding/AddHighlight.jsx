import { useRef, useState } from "react";
import { Play, Images, CaretDown, X } from "@phosphor-icons/react";
import "./AddHighlight.css";

export default function AddHighlight({ mediaUrl, mediaType, text, match, onMediaChange, onTextChange, onMatchChange }) {
  const fileRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  function handleFile(file) {
    if (!file) return;
    const url = URL.createObjectURL(file);
    const type = file.type.startsWith("video/") ? "video" : "image";
    onMediaChange({ url, type, file });
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    handleFile(file);
  }

  function removeMedia() {
    onMediaChange(null);
  }

  const hasMedia = Boolean(mediaUrl);

  return (
    <div className="highlight-step">
      {/* Header */}
      <div className="highlight-header">
        <h1 className="highlight-title">Add your first highlight</h1>
        <p className="highlight-subtitle">Share your last game</p>
      </div>

      {/* Media area */}
      {hasMedia ? (
        <div className="highlight-preview">
          {mediaType === "video" ? (
            <video src={mediaUrl} className="highlight-media" muted playsInline />
          ) : (
            <img src={mediaUrl} alt="Highlight" className="highlight-media" />
          )}
          <div className="highlight-play-overlay">
            <span className="highlight-play-btn" aria-hidden="true">
              <Play size={22} weight="fill" />
            </span>
          </div>
          <button
            type="button"
            className="highlight-remove-btn"
            onClick={removeMedia}
            aria-label="Remove media"
          >
            Remove
          </button>
        </div>
      ) : (
        <button
          type="button"
          className={`highlight-upload-area${dragging ? " highlight-upload-area--drag" : ""}`}
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          aria-label="Choose media from gallery"
        >
          <span className="highlight-upload-icon">
            <Images size={24} weight="bold" />
          </span>
          <span className="highlight-upload-label">Gallery</span>
          <span className="highlight-upload-sub">Choose from library</span>
        </button>
      )}

      {/* Hidden file input */}
      <input
        ref={fileRef}
        type="file"
        accept="image/*,video/*"
        className="visually-hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {/* Text field */}
      <div className="highlight-text-wrap">
        <span className="highlight-text-label">Add text</span>
        <textarea
          className={`highlight-textarea${hasMedia ? " highlight-textarea--filled" : ""}`}
          placeholder="Describe your moment..."
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          rows={4}
        />
      </div>

      {/* Match selector */}
      <button
        type="button"
        className="highlight-match-btn"
        aria-label="Select match"
      >
        <span className="highlight-match-label">
          {match || "Select match"}
        </span>
        <CaretDown size={18} weight="bold" className="highlight-match-caret" />
      </button>
    </div>
  );
}
