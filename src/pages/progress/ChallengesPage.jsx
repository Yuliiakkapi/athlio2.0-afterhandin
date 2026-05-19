import { useState } from "react";
import { Flame, CheckCircle } from "@phosphor-icons/react";
import { useChallenges } from "../../context/ChallengesContext";
import Tabs from "../../components/UI/Tabs";
import Badge from "../../components/UI/Badge";
import Button from "../../components/UI/Button";
import "./ChallengesPage.css";

const TABS = ["Accepted", "New", "Done"];

function ChallengeCard({ challenge, onJoin }) {
  const { title, goal, difficulty, diffColor, tags, bg, status, value, max, completedOn } = challenge;
  const isDone = status === "done";
  const pct = Math.round((value / max) * 100);

  return (
    <div className="cp-card" style={{ backgroundImage: `url(${bg})` }}>
      <div className={`cp-card__overlay${isDone ? " cp-card__overlay--done" : ""}`} />

      {isDone && (
        <div className="cp-card__completed">
          <CheckCircle size={16} weight="fill" />
          <span>Completed on {completedOn}</span>
        </div>
      )}

      <div className="cp-card__top">
        <Badge
          text={difficulty}
          color={diffColor}
          size="sm"
          leftIcon={<Flame size={14} weight="regular" />}
        />
        {tags.map((tag) => (
          <Badge key={tag} text={tag} color="transparent" size="sm" />
        ))}
      </div>

      <div className="cp-card__bottom">
        <div className="cp-card__info">
          <p className="cp-card__title">{title}</p>
          <p className="cp-card__goal">{goal}</p>
        </div>
        {status === "new" && (
          <Button type="primary" size="xsmall" label="Join" onClick={() => onJoin(challenge.id)} />
        )}
        {status === "accepted" && (
          <Button type="white" size="xsmall" label="In progress" />
        )}
      </div>

      {(isDone || status === "accepted") && (
        <div className="cp-card__progress">
          <div className="cp-card__progress-track">
            <div className="cp-card__progress-fill" style={{ width: `${pct}%` }} />
          </div>
          <div className="cp-card__progress-meta">
            <span className="cp-card__progress-label">Progress</span>
            <span className="cp-card__progress-value">{value} / {max} goals</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ChallengesPage() {
  const [tab, setTab] = useState("New");
  const { challenges, joinChallenge } = useChallenges();

  const filtered = challenges.filter((c) => c.status === tab.toLowerCase());

  return (
    <div className="cp-page">
      <Tabs tabs={TABS} active={tab} onChange={setTab} />

      <div className="cp-list">
        {filtered.length === 0 ? (
          <p className="cp-empty">No {tab.toLowerCase()} challenges yet</p>
        ) : (
          filtered.map((c) => (
            <ChallengeCard key={c.id} challenge={c} onJoin={joinChallenge} />
          ))
        )}
      </div>
    </div>
  );
}
