import { useRef, useState, useEffect } from "react";
import "./NameAndPhoto.css";

function UserIcon() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path
        d="M10.667 48C10.667 45.172 11.791 42.458 13.791 40.457C15.792 38.457 18.506 37.333 21.334 37.333H42.667C45.495 37.333 48.209 38.457 50.21 40.457C52.21 42.458 53.334 45.172 53.334 48C53.334 49.414 52.773 50.771 51.772 51.771C50.772 52.772 49.415 53.333 48 53.333H16C14.586 53.333 13.229 52.772 12.229 51.771C11.228 50.771 10.667 49.414 10.667 48Z"
        fill="#A0A0AD"
      />
      <path
        d="M32 26.667C36.419 26.667 40 23.085 40 18.667C40 14.248 36.419 10.667 32 10.667C27.582 10.667 24 14.248 24 18.667C24 23.085 27.582 26.667 32 26.667Z"
        fill="#A0A0AD"
      />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 5V19M5 12H19" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function NameAndPhoto({ name, avatarUrl, onNameChange, onAvatarChange }) {
  const fileRef = useRef();
  const [preview, setPreview] = useState(avatarUrl || "");

  useEffect(() => {
    setPreview(avatarUrl || "");
  }, [avatarUrl]);

  function handleFile(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result);
      if (typeof onAvatarChange === "function") onAvatarChange(reader.result);
    };
    reader.readAsDataURL(f);
  }

  return (
    <div className="name-step">
      {/* Heading */}
      <div className="name-step-header">
        <h1 className="name-step-title">What is your name?</h1>
        <p className="name-step-subtitle">Use your real name and a clear photo.</p>
      </div>

      {/* Body: avatar + input */}
      <div className="name-step-body">
        {/* Avatar circle with + badge */}
        <div className="name-avatar-wrap">
          <button
            type="button"
            className="name-avatar-circle"
            onClick={() => fileRef.current?.click()}
            aria-label="Upload profile photo"
          >
            {preview ? (
              <img src={preview} alt="Profile" className="name-avatar-img" />
            ) : (
              <UserIcon />
            )}
          </button>
          <button
            type="button"
            className="name-avatar-add"
            onClick={() => fileRef.current?.click()}
            aria-label="Add photo"
          >
            <PlusIcon />
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFile}
          />
        </div>

        {/* Name input */}
        <input
          className="name-input"
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="e.g. N'Golo Kanté"
          autoComplete="name"
          spellCheck={false}
          autoFocus
        />
      </div>
    </div>
  );
}
