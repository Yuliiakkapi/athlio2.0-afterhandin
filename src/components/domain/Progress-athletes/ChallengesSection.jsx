import { useNavigate } from "react-router-dom";
import { Flame } from "@phosphor-icons/react";
import { useChallenges } from "../../../context/ChallengesContext";
import Badge from "../../UI/Badge";
import Button from "../../UI/Button";
import "./ChallengesSection.css";

export default function ChallengesSection() {
  const navigate = useNavigate();
  const { challenges, joinChallenge } = useChallenges();
  const newChallenges = challenges.filter((c) => c.status === "new");
  return (
    <section className="prog-section">
      <div className="prog-section-header">
        <div>
          <h2 className="prog-section-title">Challenges</h2>
          <p className="prog-section-subtitle">
            Test yourself with football stars
          </p>
        </div>
        <Button type="subtle" size="xsmall" label="See all" onClick={() => navigate("/progress/challenges")} />
      </div>

      <div className="prog-challenges-scroll">
        {newChallenges.map((c) => (
          <div
            key={c.id}
            className="prog-challenge-card"
            style={{ backgroundImage: `url(${c.bg})` }}
          >
            <div className="prog-challenge-overlay" />

            <div className="prog-challenge-top">
              <Badge
                text={c.difficulty}
                color={c.diffColor}
                size="sm"
                leftIcon={<Flame size={14} weight="regular" />}
              />
              {c.tags[0] && (
                <Badge text={c.tags[0]} color="transparent" size="sm" />
              )}
              {c.tags[1] && (
                <Badge text={c.tags[1]} color="transparent" size="sm" />
              )}
            </div>

            <div className="prog-challenge-bottom">
              <div className="prog-challenge-info">
                <p className="prog-challenge-title">{c.title}</p>
                <p className="prog-challenge-goal">{c.goal}</p>
              </div>
              <Button type="primary" size="xsmall" label="Join" onClick={() => joinChallenge(c.id)} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
