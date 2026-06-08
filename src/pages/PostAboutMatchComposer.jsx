import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Link, Images, Plus, X } from "@phosphor-icons/react";
import { supabase } from "../lib/supabase";
import MatchCard from "../components/domain/Post/MatchCard";
import SuccessPopover from "../components/UI/SuccessPopover";
import { formatMatchDate } from "../lib/format";
import "./post-about-match-composer.css";

async function uploadFile(file) {
  const { data: { session } } = await supabase.auth.getSession();
  const userId = session?.user?.id;
  const path = `posts/${userId}/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
  await supabase.storage.from("post-media").upload(path, file, {
    cacheControl: "3600", upsert: false, contentType: file.type || "application/octet-stream",
  });
  const { data: { publicUrl } } = supabase.storage.from("post-media").getPublicUrl(path);
  return publicUrl;
}

export default function PostAboutMatchComposer() {
  const { matchId } = useParams();
  const navigate = useNavigate();

  const [match, setMatch] = useState(null);
  const [images, setImages] = useState([]);   // { id, preview, publicUrl, _temp }
  const [caption, setCaption] = useState("");
  const [link, setLink] = useState("");
  const [posted, setPosted] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => {
    if (!matchId) return;
    supabase
      .from("matches")
      .select(`
        id, your_team, opponent, your_score, opponent_score,
        league, date_of_game, goals, assists, minutes_played,
        yellow_cards, red_cards,
        opponent_club:opponent_club_id ( logo_url ),
        profiles:player_id ( club:club_id ( logo_url ) )
      `)
      .eq("id", matchId)
      .single()
      .then(({ data }) => setMatch(data));
  }, [matchId]);

  async function handleFiles(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const newItems = files.map((f) => ({
      id: `${Date.now()}_${Math.random()}`,
      preview: URL.createObjectURL(f),
      publicUrl: null,
      _temp: true,
      _file: f,
    }));
    setImages((prev) => [...prev, ...newItems]);
    await Promise.all(newItems.map(async (item) => {
      const url = await uploadFile(item._file).catch(() => null);
      setImages((prev) =>
        prev.map((img) => img.id === item.id ? { ...img, publicUrl: url, _temp: false } : img)
      );
    }));
  }

  function removeImage(id) {
    setImages((prev) => prev.filter((img) => img.id !== id));
  }

  async function handleShare() {
    if (saving) return;
    setSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      const readyUrls = images.filter((img) => !img._temp && img.publicUrl).map((img) => img.publicUrl);

      await supabase.from("posts").insert({
        author_id: session.user.id,
        type: "match",
        content: caption.trim() || null,
        media: readyUrls[0] ?? null,
        media_urls: readyUrls,
        match_id: matchId,
      });

      document.dispatchEvent(new CustomEvent("composer:posted"));
      setPosted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
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

  const imageUrl = images.length === 1 ? (images[0].publicUrl || images[0].preview) : null;
  const isUploading = images.some((img) => img._temp);
  const canShare = !saving && !isUploading;

  return (
    <div className="pamc-page">
      <div className="pamc-body">
        {/* 1-photo: "Change photo" link above card */}
        {images.length === 1 && (
          <button className="pamc-change-photo" onClick={() => { fileRef.current.value = ""; fileRef.current.click(); }}>
            Change photo
          </button>
        )}

        {/* Match card */}
        {match && (
          <MatchCard
            imageUrl={imageUrl}
            yourTeam={match.your_team}
            yourTeamLogoUrl={match.profiles?.club?.logo_url}
            yourScore={match.your_score}
            opponent={match.opponent}
            opponentLogoUrl={match.opponent_club?.logo_url}
            opponentScore={match.opponent_score}
            league={match.league}
            date={formatMatchDate(match.date_of_game)}
            goalsCount={match.goals}
            assistsCount={match.assists}
            minCount={match.minutes_played}
            yellowCards={match.yellow_cards ?? 0}
            redCards={match.red_cards ?? 0}
          />
        )}

        {/* Photo section */}
        {images.length === 0 && (
          <button className="pamc-photo-empty" type="button" onClick={() => { fileRef.current.value = ""; fileRef.current.click(); }}>
            <span className="pamc-photo-icon-wrap"><Images size={22} /></span>
            <span className="pamc-photo-label">Add video or photo</span>
            <span className="pamc-photo-sub">Choose from library</span>
          </button>
        )}

        {images.length >= 2 && (
          <div className="pamc-carousel">
            {images.map((img) => (
              <div key={img.id} className="pamc-thumb">
                <img src={img.preview} alt="" className="pamc-thumb-img" />
                {img._temp && <div className="pamc-thumb-uploading" />}
                <button className="pamc-thumb-remove" onClick={() => removeImage(img.id)} aria-label="Remove">
                  <X size={12} weight="bold" />
                </button>
              </div>
            ))}
            <button className="pamc-thumb-add" onClick={() => { fileRef.current.value = ""; fileRef.current.click(); }}>
              <Plus size={20} />
            </button>
          </div>
        )}

        <input ref={fileRef} type="file" accept="image/*,video/*" multiple style={{ display: "none" }} onChange={handleFiles} />

        {/* Caption */}
        <div className="pamc-field">
          <span className="pamc-field-label">Add text</span>
          <textarea
            className="pamc-textarea"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Add a caption..."
            rows={4}
          />
        </div>

        {/* Link */}
        <div className="pamc-link-row">
          <Link size={18} className="pamc-link-icon" />
          <input
            className="pamc-link-input"
            type="url"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="Add link to the match"
          />
        </div>
      </div>

      {/* Footer */}
      <div className="pamc-footer">
        <button className="pamc-share-btn" onClick={handleShare} disabled={!canShare}>
          {saving ? "Sharing…" : "Share"}
        </button>
      </div>
    </div>
  );
}
