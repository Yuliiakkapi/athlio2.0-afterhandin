import { useRef, useState, useEffect } from "react";
import ProfilePicture from "../../UI/ProfilePicture";
import Button from "../../UI/Button";
import ProfileIcon from "../../../assets/icons/profile.svg?react";

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

  // Present the picture on the left and the upload control on the right.
  // This restores the prior layout where the photo and the "Select picture"
  // button sit side-by-side.
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      <div style={{ width: 80, height: 80, borderRadius: "50%", background: "var(--color-gray-50,#f5f6fa)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        {preview ? (
          <ProfilePicture imgUrl={preview} size="large" />
        ) : (
          <div style={{ padding: 20, lineHeight: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ProfileIcon style={{ width: 40, height: 40, color: "var(--color-gray-400)" }} />
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
