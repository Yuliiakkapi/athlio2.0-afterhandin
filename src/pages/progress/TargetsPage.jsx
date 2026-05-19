import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trash } from "@phosphor-icons/react";
import { useUser } from "../../context/UserContext";
import { useTargets } from "../../context/TargetsContext";
import Tabs from "../../components/UI/Tabs";
import Badge from "../../components/UI/Badge";
import Button from "../../components/UI/Button";
import IconButton from "../../components/UI/IconButton";
import "./TargetsPage.css";

const TABS = ["Season", "Month", "Week"];
const LOCKED_TABS = ["Month", "Week"];
const SWIPE_THRESHOLD = 80;

const BANNER_SUBTITLE = {
  Season: "Track your progress and achieve your best season yet",
  Month:  "Track your progress and achieve your best month yet",
  Week:   "Track your progress and achieve your best week yet",
};

function SwipeableTargetCard({ label, value, max, color, deadline, onDelete }) {
  const pct = Math.round((value / max) * 100);
  const startX = useRef(null);
  const [offset, setOffset] = useState(0);
  const [deleting, setDeleting] = useState(false);

  function onPointerDown(e) {
    startX.current = e.clientX;
  }

  function onPointerMove(e) {
    if (startX.current === null) return;
    const delta = e.clientX - startX.current;
    if (delta < 0) setOffset(Math.max(delta, -140));
  }

  function onPointerUp() {
    if (offset <= -SWIPE_THRESHOLD) {
      setDeleting(true);
      setTimeout(onDelete, 280);
    } else {
      setOffset(0);
    }
    startX.current = null;
  }

  return (
    <div className={`tp-swipe-wrap${deleting ? " tp-swipe-wrap--out" : ""}`}>
      <div className="tp-swipe-bg">
        <Trash size={24} weight="bold" />
        <span>Delete</span>
      </div>
      <div
        className="tp-card"
        style={{ transform: `translateX(${offset}px)`, transition: startX.current ? "none" : "transform 0.25s ease" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        <div className="tp-card__top">
          <div className="tp-card__info">
            <p className="tp-card__label">{label}</p>
            <p className="tp-card__deadline">Deadline: {deadline}</p>
          </div>
          <div className="tp-card__value">
            <span className="tp-card__num">{value}</span>
            <span className="tp-card__max">/{max}</span>
          </div>
        </div>
        <div className="tp-card__track">
          <div className="tp-card__fill" style={{ width: `${pct}%`, background: color }} />
        </div>
      </div>
    </div>
  );
}

function LockedState({ onUnlock }) {
  return (
    <div className="tp-locked">
      <Badge text="PRO" color="pro-athlete" size="md" />
      <div className="tp-locked__text">
        <h3 className="tp-locked__title">This feature is locked</h3>
        <p className="tp-locked__desc">
          Unlock unlimited targets with Pro. Get AI suggestions
          for targets and track your progress
        </p>
      </div>
      <Button type="primary" size="medium" fullWidth label="Unlock Premium" onClick={onUnlock} />
    </div>
  );
}

export default function TargetsPage() {
  const [tab, setTab] = useState("Season");
  const { profile } = useUser();
  const { targets: allTargets, removeTarget } = useTargets();
  const navigate = useNavigate();

  const isPro = Boolean(profile?.is_pro);
  const isLocked = !isPro && LOCKED_TABS.includes(tab);
  const targets = allTargets[tab] ?? [];
  const met = targets.filter((t) => t.value >= t.max).length;

  return (
    <div className="tp-page">
      <Tabs tabs={TABS} active={tab} onChange={setTab} />

      {isLocked ? (
        <LockedState onUnlock={() => navigate("/upgrade-pro")} />
      ) : (
        <>
          <div className="tp-banner">
            <div className="tp-banner__text">
              <h2 className="tp-banner__title">{tab} targets</h2>
              <p className="tp-banner__sub">{BANNER_SUBTITLE[tab]}</p>
            </div>
            <div className="tp-banner__counter">
              <span className="tp-banner__num">
                {met}<span className="tp-banner__total">/{targets.length}</span>
              </span>
              <span className="tp-banner__label">Targets met</span>
            </div>
          </div>

          <div className="tp-list">
            {targets.map((t) => (
              <SwipeableTargetCard
                key={t.id}
                {...t}
                onDelete={() => removeTarget(t.id)}
              />
            ))}
          </div>

          <div className="tp-fab">
            <span className="tp-fab__label">Add target</span>
            <IconButton icon={Plus} type="primary" size="medium" />
          </div>
        </>
      )}
    </div>
  );
}
