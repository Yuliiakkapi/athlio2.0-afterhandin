import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import TextInput from "../../inputs/TextInput";
import { TeamSelectFields } from "./ClubPickerPost";
import { supabase } from "../../../lib/supabase";
import "./MatchPostForm.css";
import { PopUp, PopUpActions } from "../../UI/PopUp";
import Button from "../../UI/Button";
import { Check, X } from "@phosphor-icons/react";
import MatchComposer from "./MatchComposer";
import DateInput from "../../inputs/DateInput";

async function resolveClubName(club) {
  if (!club) return null;

  // If already a simple string, trust it
  if (typeof club === "string") return club.trim() || null;

  // Try common name fields first
  const inlineName =
    (club.club_other_name && club.club_other_name.trim()) ||
    club.name ||
    club.label ||
    club.title ||
    club.club_name ||
    null;
  if (inlineName) return inlineName;

  // Determine an id we can look up
  const candidateId = club.club_id || club.id || club.value || null;
  if (!candidateId) return null;

  // Fetch from DB by id
  const { data, error } = await supabase
    .from("clubs")
    .select("name")
    .eq("id", candidateId)
    .maybeSingle();

  if (error) {
    console.warn("resolveClubName lookup failed", { candidateId, error });
    return null;
  }
  return data?.name ?? null;
}

async function uploadMediaIfAny(file, userId) {
  if (!file || !userId) return null;
  try {
    const bucket = "post-media";
    const ext = (file.name?.split(".").pop() || "bin").toLowerCase();
    const path = `${userId}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        contentType: file.type || "application/octet-stream",
        upsert: false,
      });
    if (upErr) throw upErr;
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data?.publicUrl || null;
  } catch (e) {
    console.error("upload failed", e);
    return null;
  }
}

function normalizeClubValue(v) {
  if (!v) return { club_id: null, club_other_name: "" };

  if (typeof v === "string") {
    return { club_id: null, club_other_name: v };
  }

  // Object case: try to preserve id and a readable fallback name
  const id = v.club_id ?? v.id ?? v.value ?? null;
  const other =
    (v.club_other_name && v.club_other_name.trim()) ||
    v.name ||
    v.label ||
    v.title ||
    v.club_name ||
    "";

  return { club_id: id, club_other_name: other };
}

export default function MatchPostForm({ onCreated }) {
  const [saving, setSaving] = useState(false);
  const [meId, setMeId] = useState(null);

  // keep visual structure intact; just make it controlled
  const [form, setForm] = useState({
    primarySport: "football",
    league: "",
    location: "",
    date_of_game: "", // optional for now, can be wired to a date picker later

    // your team
    your_team: { club_id: null, club_other_name: null },
    // opponent team
    opponent_team: { club_id: null, club_other_name: null },

    // score & stats
    your_score: null,
    opponent_score: null,
    minutes_played: null,
    goals: null,
    assists: null,
  });

  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [showAskMedia, setShowAskMedia] = useState(false);
  const [showCompose, setShowCompose] = useState(false);
  const [caption, setCaption] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileRef = React.useRef(null);

  // handy patch setter
  function patch(update) {
    setForm((f) => ({ ...f, ...update }));
  }

  // who am I (in case posts.author_id is required or RLS needs it)
  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      setMeId(data?.user?.id || null);
    })();
  }, []);

  useEffect(() => {
    const onTopbarPost = () => {
      if (saving) return; // avoid duplicate clicks
      if (showCompose) {
        // already on caption+preview -> save directly
        savePost();
      } else {
        // still on the form -> open confirm flow (same as submit)
        setShowConfirm(true);
      }
    };

    document.addEventListener("composer:submit", onTopbarPost);
    return () => document.removeEventListener("composer:submit", onTopbarPost);
  }, [saving, showCompose, savePost]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (saving) return;
    setShowConfirm(true);
  }

  function handleConfirmNo() {
    setShowConfirm(false);
    navigate("/home");
  }
  function handleConfirmYes() {
    setShowConfirm(false);
    setShowAskMedia(true);
  }
  async function handleAskMediaNo() {
    setShowAskMedia(false);
    setShowCompose(true);
  }
  function handleAskMediaYes() {
    if (fileRef.current) fileRef.current.click();
  }
  async function onFileChange(e) {
    const f = e.target.files?.[0];
    setShowAskMedia(false);
    if (f) {
      setImageFile(f);
      const url = URL.createObjectURL(f);
      setImagePreview(url);
    }
    setShowCompose(true);
  }

  async function savePost() {
    if (saving) return;
    setSaving(true);
    try {
      // Resolve display names
      console.log("POSTING NAMES", {
        your: form.your_team,
        opp: form.opponent_team,
      });
      const yourTeamName = await resolveClubName(form.your_team);
      const opponentName = await resolveClubName(form.opponent_team);
      // Upload media if any
      const mediaUrl = await uploadMediaIfAny(imageFile, meId);

      const row = {
        type: "match",
        league: form.league?.trim() || null,
        location: form.location?.trim() || null,
        date_of_game: form.date_of_game || null,
        your_team: yourTeamName,
        opponent: opponentName,
        your_score: Number(form.your_score) || 0,
        opponent_score: Number(form.opponent_score) || 0,
        minutes_played: Number(form.minutes_played) || 0,
        goals: Number(form.goals) || 0,
        assists: Number(form.assists) || 0,
        content: caption || null,
        media: mediaUrl,
        author_id: meId || undefined,
      };

      const { data, error } = await supabase
        .from("posts")
        .insert(row)
        .select("id")
        .single();
      if (error) throw error;
      onCreated?.(data.id);
      navigate("/home");
    } catch (err) {
      console.error("Failed to save match post", err);
      alert("Couldn't save the post. Check console and your schema.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      {!showCompose && (
        <form className="match-post-form-wrapper" onSubmit={handleSubmit}>
          <div className="match-section">
            <h2>About the match</h2>
            <div className="inputs-container">
              <TextInput
                label="What league was it?"
                value={form.league}
                onChange={(v) => patch({ league: v })}
              />

              <TeamSelectFields
                sport={form.primarySport || "football"}
                opponentTeam={form.opponent_team}
                onChangeOpponent={(v) =>
                  patch({
                    opponent_team: normalizeClubValue(v),
                  })
                }
              />

              <TextInput
                label="Where was the game?"
                value={form.location}
                onChange={(v) => patch({ location: v })}
              />

              {/* Here will be the calendar component */}
              <DateInput
                label="Date of game"
                value={form.date_of_game}
                onChange={(e) => patch({ date_of_game: e.target.value })}
              />

              <div className="score-inputs-container">
                <div className="score">
                  <p>Your Score*</p>
                  <TextInput
                    label="Score"
                    value={form.your_score}
                    onChange={(v) => patch({ your_score: Number(v) || 0 })}
                  />
                </div>
                <p>:</p>
                <div className="score">
                  <TextInput
                    label="Score"
                    value={form.opponent_score}
                    onChange={(v) => patch({ opponent_score: Number(v) || 0 })}
                  />
                  <p>Opponent Score*</p>
                </div>
              </div>
            </div>
          </div>
          <div className="match-section">
            <h3>Your Stats</h3>
            <div className="stats-container">
              <TextInput
                label="Minutes Played"
                value={form.minutes_played}
                onChange={(v) => patch({ minutes_played: Number(v) || 0 })}
              />
              <TextInput
                label="Goals"
                value={form.goals}
                onChange={(v) => patch({ goals: Number(v) || 0 })}
              />
              <TextInput
                label="Assists"
                value={form.assists}
                onChange={(v) => patch({ assists: Number(v) || 0 })}
              />
            </div>
          </div>
        </form>
      )}
      {showConfirm && (
        <PopUp
          title="Do you want to create a post about this match?"
          onClose={handleConfirmNo}
        >
          <PopUpActions>
            <Button
              type="primary"
              size="small"
              label="Yes"
              onClick={handleConfirmYes}
              Icon={Check}
            />
            <Button
              type="outline"
              size="small"
              label="No"
              onClick={handleConfirmNo}
              Icon={X}
            />
          </PopUpActions>
        </PopUp>
      )}

      {showAskMedia && (
        <PopUp
          title="Do you want to add a picture about this match?"
          onClose={handleAskMediaNo}
        >
          <PopUpActions>
            <Button
              type="primary"
              size="small"
              label="Yes"
              onClick={handleAskMediaYes}
              Icon={Check}
            />
            <Button
              type="outline"
              size="small"
              label="No"
              onClick={handleAskMediaNo}
              Icon={X}
            />
          </PopUpActions>
        </PopUp>
      )}

      {showCompose && (
        <MatchComposer
          form={form}
          caption={caption}
          imagePreview={imagePreview}
          onCaptionChange={setCaption}
        />
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={onFileChange}
      />
    </>
  );
}
