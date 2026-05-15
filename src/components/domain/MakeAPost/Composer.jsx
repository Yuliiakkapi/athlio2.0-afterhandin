import { useEffect, useState, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../lib/supabase";
import GrowingTextArea from "../../inputs/GrowingTextArea";
import PostPillBar from "./PostPillBar";
import "./Composer.css";
import IconButton from "../../UI/IconButton";
import { X } from "@phosphor-icons/react";

export default function Composer({
  onSubmit /* UI-only: do not insert here */,
}) {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null); // can be a File or an upload object
  const postingRef = useRef(false);
  const navigate = useNavigate();
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (!image) {
      setPreview(null);
      return;
    }

    // if PostPillBar provided an uploaded object
    if (image && typeof image === "object" && image.publicUrl) {
      setPreview(image.publicUrl);
      return;
    }

    // fallback: raw File object case
    const url = URL.createObjectURL(image);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [image]);

  const isUploading = !!(
    image instanceof File ||
    (image && typeof image === "object" && image._temp === true)
  );
  const canPost = useMemo(
    () => text.trim().length > 0 && !isUploading,
    [text, isUploading],
  );

  // topbar submits the post
  useEffect(() => {
    const handler = async () => {
      if (!canPost) return;
      if (postingRef.current) return; // prevent duplicates
      postingRef.current = true;

      try {
        const { data: auth, error: authErr } = await supabase.auth.getUser();
        if (authErr || !auth?.user)
          throw authErr || new Error("Not authenticated");

        // Only persist a real hosted URL, never a temp blob
        const hasImage = !!image;
        const mediaUrl =
          image && typeof image === "object" && image._temp === false
            ? image.publicUrl
            : null;

        // If user attached an image but upload hasn't finished, do not insert yet
        if (hasImage && !mediaUrl) {
          console.warn("Blocked submit: image selected but not uploaded yet.");
          return;
        }

        const { error } = await supabase.from("posts").insert({
          author_id: auth.user.id,
          type: "basic",
          content: text.trim(),
          media: mediaUrl, // null only when there was no image
        });
        if (error) throw error;

        document.dispatchEvent(new CustomEvent("composer:posted"));

        navigate("/home");

        // reset UI
        setText("");
        setImage(null);
        setPreview(null);
      } catch (err) {
        console.error("Failed to create post:", err);
      } finally {
        postingRef.current = false;
      }
    };

    document.addEventListener("composer:submit", handler);
    return () => document.removeEventListener("composer:submit", handler);
  }, [canPost, text, image]);

  function handleRemoveImage() {
    setImage(null);
    setPreview(null);
  }

  return (
    <div className="composer-wrap" aria-busy={isUploading ? "true" : "false"}>
      <GrowingTextArea
        value={text}
        onChange={setText}
        placeholder="What is this post about?"
      />
      {preview && (
        <figure className="composer-preview">
          <img src={preview} alt="Selected" className="composer-preview-img" />
          <figcaption className="composer-preview-caption">
            <IconButton
              size="small"
              type="neutral"
              icon={X}
              onClick={handleRemoveImage}
            />
          </figcaption>
        </figure>
      )}
      <PostPillBar onImageSelected={setImage} />
    </div>
  );
}
