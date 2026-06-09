import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { SoccerBall, Sneaker } from "@phosphor-icons/react";
import { supabase } from "../../../lib/supabase";
import TextArea from "../../inputs/TextArea";
import MediaPickerArea from "../../UI/MediaPickerArea";
import Button from "../../UI/Button";
import SuccessPopover from "../../UI/SuccessPopover";
import "./Composer.css";

export default function Composer() {
  const [text, setText] = useState("");
  const [images, setImages] = useState([]);
  const [posted, setPosted] = useState(false);
  const postingRef = useRef(false);
  const navigate = useNavigate();

  const isUploading = images.some((img) => img._temp);
  const hasMedia = images.some((img) => !img._temp && img.publicUrl);
  const canShare = (text.trim().length > 0 || hasMedia) && !isUploading;

  async function handleShare() {
    if (!canShare || postingRef.current) return;
    postingRef.current = true;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) throw new Error("Not authenticated");

      const readyUrls = images.filter((img) => !img._temp && img.publicUrl).map((img) => img.publicUrl);

      const { error } = await supabase.from("posts").insert({
        author_id: session.user.id,
        type: "basic",
        content: text.trim(),
        media: readyUrls[0] ?? null,
        media_urls: readyUrls,
      });

      if (error) throw error;

      document.dispatchEvent(new CustomEvent("composer:posted"));
      setPosted(true);
    } catch (err) {
      console.error("Failed to create post:", err);
    } finally {
      postingRef.current = false;
    }
  }

  if (posted) {
    return (
      <SuccessPopover
        title="Post is created"
        subtitle="Now your friends can see your results and get inspired"
        onClose={() => navigate("/home")}
      />
    );
  }

  return (
    <div className="composer-wrap">
      <div className="composer-body">
        <MediaPickerArea onImagesChange={setImages} />

        <TextArea
          label="Add text"
          value={text}
          onChange={setText}
          placeholder="Add a caption..."
          rows={5}
        />

        <div className="composer-attach">
          <p className="composer-attach-title">Attach</p>
          <div className="composer-attach-row">
            <Button
              label="Match"
              type="secondary"
              size="medium"
              fullWidth
              leadingIcon={SoccerBall}
              onClick={() => navigate("/post-match-select")}
            />
            <Button
              label="Training"
              type="secondary"
              size="medium"
              fullWidth
              leadingIcon={Sneaker}
              disabled
            />
          </div>
        </div>
      </div>

      <div className="composer-footer">
        <Button
          label="Share"
          type="primary"
          size="medium"
          fullWidth
          disabled={!canShare}
          onClick={handleShare}
        />
      </div>
    </div>
  );
}
