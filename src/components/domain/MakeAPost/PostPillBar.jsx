import Button from "../../UI/Button";
import MatchIcon from "../../../assets/icons/stats.svg?react";
import PictureIcon from "../../../assets/icons/image.svg?react";
import EventIcon from "../../../assets/icons/event.svg?react";
import "./PostPillBar.css";
import { useNavigate } from "react-router";
import { useRef } from "react";
import { supabase } from "../../../lib/supabase";

export default function PostPillBar({ onImageSelected }) {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  function handleMatchClick() {
    navigate("/add-post/match");
  }

  function handleEventClick() {
    navigate("/add-post/event");
  }

  function handlePictureClick() {
    fileInputRef.current?.click();
  }

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const BUCKET = "post-media";

    // 0) Show an optimistic preview immediately
    const tempUrl = URL.createObjectURL(file);
    onImageSelected?.({ file, publicUrl: tempUrl, _temp: true });

    try {
      // 1) Get user ID (for folder structure)
      const { data: auth, error: authErr } = await supabase.auth.getUser();
      if (authErr) throw authErr;
      const userId = auth?.user?.id || "anonymous";

      // 2) Create unique safe path
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const path = `posts/${userId}/${Date.now()}_${safeName}`;

      // 3) Upload to Supabase storage bucket `post-media`
      const { error: upErr } = await supabase.storage
        .from(BUCKET)
        .upload(path, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type || "application/octet-stream",
        });
      if (upErr) throw upErr;

      // 4) Retrieve the public URL (bucket must be public)
      const { data: pub, error: pubErr } = supabase.storage
        .from(BUCKET)
        .getPublicUrl(path);
      if (pubErr) throw pubErr;

      console.log("Upload complete →", pub.publicUrl);

      // 5) Send final upload info to parent (Composer)
      onImageSelected?.({
        file,
        storagePath: path,
        publicUrl: pub.publicUrl,
        mime: file.type,
        size: file.size,
        _temp: false,
      });
    } catch (err) {
      console.error("Image upload failed:", err);
      // Keep the temporary preview in Composer
    } finally {
      // Allow selecting same file again
      e.target.value = "";
    }
  }

  return (
    <div className="pill-bar">
      <Button
        size="small"
        type="gray"
        label="Match"
        Icon={MatchIcon}
        className="pill-button"
        onClick={handleMatchClick}
      />
      <Button
        size="small"
        type="gray"
        label="Picture"
        Icon={PictureIcon}
        className="pill-button"
        onClick={handlePictureClick}
      />
      <Button
        size="small"
        type="gray"
        label="Event"
        Icon={EventIcon}
        className="pill-button"
        onClick={handleEventClick}
      />
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </div>
  );
}
