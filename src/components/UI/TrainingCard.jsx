import { Clock } from "@phosphor-icons/react";
import Badge from "./Badge";
import Button from "./Button";
import "./TrainingCard.css";

import matchImg        from "../../assets/images/match-training.png";
import teamImg         from "../../assets/images/team-training.png";
import individualImg   from "../../assets/images/individual-training.png";
import recoveryImg     from "../../assets/images/recovery-training.png";
import noScheduleImg   from "../../assets/images/noschedule-training.png";

const CONFIG = {
  match: {
    image:    matchImg,
    badge:    "Match day",
    title:    "Give your best.",
    titleAlt: "We will track the rest.",
    subtitle: null,
    button:   "Log your performance after game",
    btnType:  "white",
  },
  team: {
    image:    teamImg,
    badge:    "Team training",
    title:    "Together we get better.",
    titleAlt: null,
    subtitle: "Remember to log activity, so we can give you better suggestion",
    button:   "Log your team training",
    btnType:  "white",
  },
  individual: {
    image:    individualImg,
    badge:    "Individual training",
    title:    "Your work. Your advantage.",
    titleAlt: null,
    subtitle: "Remember to log activity, so we can give you better suggestion",
    button:   "Log your individual training",
    btnType:  "white",
  },
  recovery: {
    image:    recoveryImg,
    badge:    "Recovery",
    title:    "Rest today. Stronger tomorrow.",
    titleAlt: null,
    subtitle: null,
    button:   "Log your recovery session",
    btnType:  "white",
  },
  none: {
    image:    noScheduleImg,
    badge:    "No schedule",
    title:    "Make it count.",
    titleAlt: null,
    subtitle: "Remember to log activity to keep your strike.",
    button:   "Log your training",
    btnType:  "primary",
  },
};

function getButtonProps(status, config) {
  if (status === "logged" || status === "missed") {
    return { label: "See your performance", leadingIcon: undefined, disabled: false };
  }
  if (status === "planned") {
    return { label: "Planned", leadingIcon: Clock, disabled: true };
  }
  return { label: config.button, leadingIcon: undefined, disabled: false };
}

export default function TrainingCard({ type = "none", status, onAction, hideButton = false }) {
  const c = CONFIG[type] ?? CONFIG.none;
  const btnProps = getButtonProps(status, c);

  return (
    <div className="tc" style={{ backgroundImage: `url(${c.image})` }}>
      <div className="tc__overlay" aria-hidden="true" />

      <div className="tc__top">
        <Badge text={c.badge} color="transparent" size="xs" />
      </div>

      <div className="tc__bottom">
        <div className="tc__text">
          <p className="tc__title">
            {c.title}
            {c.titleAlt && (
              <>
                <br />
                <span className="tc__title-alt">{c.titleAlt}</span>
              </>
            )}
          </p>
          {c.subtitle && <p className="tc__subtitle">{c.subtitle}</p>}
        </div>
        {!hideButton && (
          <Button
            type={c.btnType}
            size="small"
            fullWidth
            label={btnProps.label}
            leadingIcon={btnProps.leadingIcon}
            disabled={btnProps.disabled}
            onClick={onAction}
          />
        )}
      </div>
    </div>
  );
}
