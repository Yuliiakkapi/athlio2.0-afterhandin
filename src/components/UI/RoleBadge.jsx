import "./RoleBadge.css";

export default function RoleBadge({ role }) {
  if (!role) return null;
  return <span className="role-badge">{role}</span>;
}
