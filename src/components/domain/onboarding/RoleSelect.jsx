import "./RoleSelect.css";
import SelectionCard from "./UI/SelectionCard";
import AthleteIcon from "../../../assets/icons/athlete.svg?react";
import ScoutIcon from "../../../assets/icons/scout.svg?react";
import OrgIcon from "../../../assets/icons/organisation.svg?react";

const ROLES = [
  {
    id: "athlete",
    title: "Athlete",
    description: "Create and manage your athlete profile, showcase stats and video.",
    icon: <AthleteIcon />,
  },
  {
    id: "scout",
    title: "Scout",
    description: "Discover talent, save profiles and contact athletes.",
    icon: <ScoutIcon />,
  },
  {
    id: "organization",
    title: "Organization",
    description: "Manage club or organization accounts and post opportunities.",
    icon: <OrgIcon />,
  },
];

export default function RoleSelect({ role, onChange }) {
  return (
    <div>
      <div
        className="role-header"
        style={{ display: "inline-flex", flexDirection: "column", gap: 8 }}
      >
        <h1 className="role-header-title">Choose your role</h1>
        <p className="role-header-subtitle">Select how you want to use athlio</p>
      </div>

      <div className="role-grid" role="radiogroup" aria-label="Choose your role">
        {ROLES.map((r) => {
          const selected = role === r.id;
          return (
            <SelectionCard
              key={r.id}
              name={r.title}
              description={r.description}
              icon={r.icon}
              value={r.id}
              groupName="role"
              checked={selected}
              onChange={onChange}
            />
          );
        })}
      </div>
    </div>
  );
}
