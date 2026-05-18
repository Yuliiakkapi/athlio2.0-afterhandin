import { Flame } from "@phosphor-icons/react";
import Badge from "../../UI/Badge";
import Button from "../../UI/Button";
import haalandImg from "../../../assets/images/haalandchallenge.png";
import virginImg from "../../../assets/images/virginchallenge.jpg";
import "./ChallengesSection.css";

const CHALLENGES = [
  {
    id: 1,
    title: "The Haaland Hunt",
    goal: "10 goals in a season",
    difficulty: "Hard",
    diffColor: "danger",
    tags: ["Striker"],
    bg: haalandImg,
  },
  {
    id: 2,
    title: "The VVD Wall",
    goal: "8 matches with zero goals",
    difficulty: "Medium",
    diffColor: "warning",
    tags: ["Defenders", "GK"],
    bg: virginImg,
  },
];

export default function ChallengesSection() {
  return (
    <section className="prog-section">
      <div className="prog-section-header">
        <div>
          <h2 className="prog-section-title">Challenges</h2>
          <p className="prog-section-subtitle">
            Test yourself with football stars
          </p>
        </div>
        <Button type="subtle" size="xsmall" label="See all" />
      </div>

      <div className="prog-challenges-scroll">
        {CHALLENGES.map((c) => (
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
              {c.tags[0] && <Badge text={c.tags[0]} color="transparent" size="sm" />}
              {c.tags[1] && <Badge text={c.tags[1]} color="transparent" size="sm" />}
            </div>

            <div className="prog-challenge-bottom">
              <div className="prog-challenge-info">
                <p className="prog-challenge-title">{c.title}</p>
                <p className="prog-challenge-goal">{c.goal}</p>
              </div>
              <Button type="primary" size="xsmall" label="Join" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
