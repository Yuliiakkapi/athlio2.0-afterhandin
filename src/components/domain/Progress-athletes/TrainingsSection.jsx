import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UsersThree, SneakerMove, SoccerBall } from "@phosphor-icons/react";
import RecoveryIcon from "../../UI/icons/RecoveryIcon";
import TrainingDayCard from "../../UI/TrainingDayCard";
import TrainingCard from "../../UI/TrainingCard";
import Badge from "../../UI/Badge";
import Button from "../../UI/Button";
import "./TrainingsSection.css";

const WEEK_DAYS = [
  { key: "m",  label: "M",  icon: SneakerMove, status: "logged",  cardType: "individual" },
  { key: "t",  label: "T",  icon: UsersThree,  status: "missed",  cardType: "team"       },
  { key: "w",  label: "W",  icon: null,        status: null,      cardType: "none"       },
  { key: "th", label: "TH", icon: null,        status: null,      cardType: "none"       },
  { key: "f",  label: "F",  icon: UsersThree,  status: "planned", cardType: "team"       },
  { key: "sa", label: "SA", icon: SoccerBall,  status: "planned", cardType: "match"      },
  { key: "s",  label: "S",  icon: RecoveryIcon, status: "planned", cardType: "recovery"   },
];

export default function TrainingsSection() {
  const [activeDay, setActiveDay] = useState("sa");
  const navigate = useNavigate();
  const activeEntry = WEEK_DAYS.find((d) => d.key === activeDay);
  const activeCard = activeEntry?.cardType ?? "none";
  const activeStatus = activeEntry?.status ?? null;

  return (
    <section className="prog-section">
      <div className="prog-section-header">
        <div>
          <h2 className="prog-section-title">Trainings</h2>
          <p className="prog-section-subtitle">Work on your goals and track them</p>
        </div>
        <Button type="subtle" size="xsmall" label="See all" onClick={() => navigate("/progress/trainings")} />
      </div>

      <div className="prog-day-picker">
        {WEEK_DAYS.map((d) => (
          <TrainingDayCard
            key={d.key}
            day={d.label}
            active={activeDay === d.key}
            onClick={() => setActiveDay(d.key)}
            icon={d.icon}
            status={d.status}
            variant="week"
          />
        ))}
      </div>

      <TrainingCard type={activeCard} status={activeStatus} />
    </section>
  );
}
