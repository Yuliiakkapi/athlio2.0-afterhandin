import { useRef, useState } from "react";
import { Images } from "@phosphor-icons/react";
import "./ImageSelect.css";

export default function ImageSelect({ value, onChange, accept = "image/*", label = "Gallery", sub = "Choose from library" }) {
  const fileRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  function handleFile(file) {
    if (!file) return;
    const url = URL.createObjectURL(file);
    const type = file.type.startsWith("video/") ? "video" : "image";
    onChange({ url, type, file });
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files?.[0]);
  }

  return (
    <>
      {value ? (
        <div className="image-select-preview">
          {value.type === "video" ? (
            <video src={value.url} className="image-select-media" muted playsInline />
          ) : (
            <img src={value.url} alt="Selected" className="image-select-media" />
          )}
          <button
            type="button"
            className="image-select-remove"
            onClick={() => onChange(null)}
            aria-label="Remove"
          >
            Remove
          </button>
        </div>
      ) : (
        <button
          type="button"
          className={`image-select-area${dragging ? " image-select-area--drag" : ""}`}
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          aria-label={label}
        >
          <span className="image-select-icon">
            <Images size={24} weight="bold" />
          </span>
          <span className="image-select-label">{label}</span>
          <span className="image-select-sub">{sub}</span>
        </button>
      )}
      <input
        ref={fileRef}
        type="file"
        accept={accept}
        className="visually-hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </>
  );
}
