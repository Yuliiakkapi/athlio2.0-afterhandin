import { useRef, useState, useEffect } from "react";
import { UserCircle, Plus } from "@phosphor-icons/react";
import "./NameAndPhoto.css";

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

      {/* Body: avatar + input — centred in remaining space */}
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
              <UserCircle size={72} weight="thin" color="var(--neutral-400, #9899a8)" aria-hidden="true" />
            )}
          </button>
          <button
            type="button"
            className="name-avatar-add"
            onClick={() => fileRef.current?.click()}
            aria-label="Add photo"
          >
            <Plus size={20} weight="bold" color="#fff" aria-hidden="true" />
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
