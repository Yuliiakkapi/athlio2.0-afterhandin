import { TShirt, Plus } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
import Button from "./Button";
import "./InfoCards.css";

function flagEmoji(code) {
  if (!code || code.length !== 2) return null;
  return String.fromCodePoint(
    ...code.toUpperCase().split("").map((c) => 0x1f1e6 + c.charCodeAt(0) - 65)
  );
}

function calcAge(birthDate) {
  if (!birthDate) return null;
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

export default function ProfileInfoCard({ info = {}, isMe = false }) {
  const navigate = useNavigate();

  const age = calcAge(info.birthDate);
  const formattedDob = info.birthDate ? info.birthDate.replace(/-/g, "/") : null;
  const nationalityFlag = flagEmoji(info.nationalityCode);

  const fields = [
    formattedDob && {
      id: "dob",
      label: formattedDob,
      value: age != null ? `${age} years` : formattedDob,
    },
    info.nationality && {
      id: "nationality",
      label: "NATIONALITY",
      value: `${nationalityFlag ? nationalityFlag + " " : ""}${info.nationality}`,
    },
    info.location && {
      id: "location",
      label: "LOCATION",
      value: info.location,
    },
    info.heightCm != null && {
      id: "height",
      label: "HEIGHT (CM)",
      value: info.heightCm,
    },
    info.weightKg != null && {
      id: "weight",
      label: "WEIGHT (KG)",
      value: info.weightKg,
    },
    info.injured != null && {
      id: "injured",
      label: "INJURED",
      value: info.injured ? "Yes" : "No",
    },
    info.preferredFoot && {
      id: "foot",
      label: "FOOT",
      value: info.preferredFoot.charAt(0).toUpperCase() + info.preferredFoot.slice(1),
    },
    info.playingStyle && {
      id: "style",
      label: "STYLE",
      value: info.playingStyle,
    },
    info.shirtNumber != null && {
      id: "shirt",
      label: "NUMBER",
      value: (
        <span className="profile-info-shirt">
          <TShirt size={14} weight="regular" />
          {info.shirtNumber}
        </span>
      ),
    },
  ].filter(Boolean);

  const allFields = [
    "dob", "nationality", "location", "height", "weight",
    "injured", "foot", "style", "shirt",
  ];
  const presentIds = new Set(fields.map((f) => f.id));
  const hasAnyMissing = allFields.some((id) => !presentIds.has(id));

  return (
    <div className="profile-info-card">
      <div className="profile-info-grid">
        {fields.map((field) => (
          <div key={field.id} className="profile-info-field">
            <span className="profile-info-label">{field.label}</span>
            <span className="profile-info-value">{field.value}</span>
          </div>
        ))}

        {isMe && hasAnyMissing && (
          <div className="profile-info-add">
            <Button
              type="subtle"
              size="small"
              label="Add info"
              leadingIcon={Plus}
              onClick={() => navigate("/profile/me/edit")}
            />
          </div>
        )}
      </div>
    </div>
  );
}
