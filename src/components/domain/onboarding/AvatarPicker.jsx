import { useRef, useState, useEffect } from "react";
import ProfilePicture from "../../UI/ProfilePicture";
import Button from "../../UI/Button";

function DefaultProfileIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6.66675 29.9999C6.66675 28.2318 7.36913 26.5361 8.61937 25.2859C9.86961 24.0356 11.5653 23.3333 13.3334 23.3333H26.6667C28.4349 23.3333 30.1305 24.0356 31.3808 25.2859C32.631 26.5361 33.3334 28.2318 33.3334 29.9999C33.3334 30.884 32.9822 31.7318 32.3571 32.3569C31.732 32.9821 30.8841 33.3333 30.0001 33.3333H10.0001C9.11603 33.3333 8.26818 32.9821 7.64306 32.3569C7.01794 31.7318 6.66675 30.884 6.66675 29.9999Z" stroke="currentColor" strokeWidth="3.33333" strokeLinejoin="round"/>
      <path d="M20.0001 16.6667C22.7615 16.6667 25.0001 14.4282 25.0001 11.6667C25.0001 8.90532 22.7615 6.66675 20.0001 6.66675C17.2386 6.66675 15.0001 8.90532 15.0001 11.6667C15.0001 14.4282 17.2386 16.6667 20.0001 16.6667Z" stroke="currentColor" strokeWidth="3.33333"/>
    </svg>
  );
}

export default function AvatarPicker({ value, onChange }) {
  const fileRef = useRef();
  const [preview, setPreview] = useState(value || "");

  useEffect(() => {
    setPreview(value || "");
  }, [value]);

  function handleFile(e) {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      setPreview(dataUrl);
      if (typeof onChange === "function") onChange(dataUrl);
    };
    reader.readAsDataURL(f);
  }

  // Keep the picture and upload action side-by-side.
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      <div style={{ width: 80, height: 80, borderRadius: "50%", background: "var(--neutral-50-bg,#f5f6fa)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        {preview ? (
          <ProfilePicture imgUrl={preview} size="large" />
        ) : (
          <div style={{ padding: 20, lineHeight: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--neutral-400)" }}>
            <DefaultProfileIcon />
          </div>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ display: "flex", gap: 8 }}>
          <Button
            size="medium"
            type="outline"
            label="Select picture"
            onClick={() => fileRef.current?.click()}
          />
        </div>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFile}
      />
    </div>
  );
}