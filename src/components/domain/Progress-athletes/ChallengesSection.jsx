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
    difficulty: "HARD",
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
          <p className="prog-section-subtitle">Test yourself with football stars</p>
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
            <div className="prog-challenge-overlay" aria-hidden="true" />
            <div className="prog-challenge-badges">
              <Badge text={c.difficulty} color={c.diffColor} size="s" />
              {c.tags.map((tag) => (
                <Badge key={tag} text={tag} color="transparent" size="s" />
              ))}
            </div>
            <div className="prog-challenge-bottom">
              <div>
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
