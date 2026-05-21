const POSITION_MAP = {
  // Goalkeeper
  "goalkeeper": "GK",

  // Defenders
  "central back": "CB",
  "centre back": "CB",
  "center back": "CB",
  "left back": "LB",
  "right back": "RB",

  // Midfielders
  "central midfielder": "CM",
  "centre midfielder": "CM",
  "central midfield": "CM",
  "central defending midfielder": "CDM",
  "central defensive midfielder": "CDM",
  "defensive midfielder": "CDM",
  "central attacking midfielder": "CAM",
  "attacking midfielder": "CAM",
  "left midfielder": "LM",
  "right midfielder": "RM",

  // Forwards
  "left winger": "LW",
  "right winger": "RW",
  "striker": "ST",
  "centre forward": "ST",
  "center forward": "ST",
  "forward": "ST",
};

export function toPositionAbbr(position) {
  if (!position) return position;
  const key = position.trim().toLowerCase();
  return POSITION_MAP[key] ?? position.toUpperCase();
}
