const POSITION_MAP = {
  // ID-style keys (stored in DB from PositionSelect / PositionPage)
  "gk": "GK",
  "lb": "LB", "cb": "CB", "cb_l": "CB", "cb_r": "CB", "rb": "RB",
  "cdm": "CDM",
  "lm": "LM", "cm": "CM", "cm_l": "CM", "cm_r": "CM", "rm": "RM",
  "cam": "CAM",
  "lw": "LW", "rw": "RW", "st": "ST",
  // Basketball
  "pg": "PG", "sg": "SG", "sf": "SF", "pf": "PF", "c": "C",

  // Full-name keys
  "goalkeeper": "GK",
  "central back": "CB", "centre back": "CB", "center back": "CB",
  "left back": "LB", "right back": "RB",
  "central midfielder": "CM", "centre midfielder": "CM", "central midfield": "CM",
  "central defending midfielder": "CDM", "central defensive midfielder": "CDM",
  "defensive midfielder": "CDM",
  "central attacking midfielder": "CAM", "attacking midfielder": "CAM",
  "left midfielder": "LM", "right midfielder": "RM",
  "left winger": "LW", "right winger": "RW",
  "striker": "ST", "centre forward": "ST", "center forward": "ST", "forward": "ST",
};

export function toPositionAbbr(position) {
  if (!position) return position;
  const key = position.trim().toLowerCase();
  return POSITION_MAP[key] ?? position.toUpperCase();
}
