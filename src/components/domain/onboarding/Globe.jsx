import { useMemo } from "react";
import "./Globe.css";

const TILT = 0.28;

// Continent outlines as [lon, lat] pairs, clockwise winding.
// Globe is centred at lon=0 — visible hemisphere is roughly lon -90 to +90.
// North America is clipped to lon=-90 (the limb) so the polygon closes cleanly.
const CONTINENTS = [
  // ── Africa ──────────────────────────────────────────────────────────────
  [
    [-6,36],[10,37],[13,33],[20,32],[30,31],[35,29],
    [38,20],[43,12],[51,11],[45,2],[40,-4],[40,-10],
    [36,-18],[34,-22],[32,-28],[26,-34],[20,-35],[18,-33],
    [15,-27],[12,-16],[9,4],[3,6],[-1,5],[-5,5],
    [-11,6],[-15,11],[-17,15],[-17,21],[-14,24],[-9,30],[-6,36],
  ],
  // ── Europe (mainland + Russia W, simplified) ─────────────────────────
  [
    [-9,36],[-9,44],[-4,44],[-5,48],[2,51],[8,55],
    [12,57],[28,72],[30,65],[30,60],[38,57],
    [35,47],[30,46],[28,46],[28,41],[24,38],[20,40],
    [16,38],[12,44],[8,44],[3,43],[-3,38],[-9,36],
  ],
  // ── Greenland ──────────────────────────────────────────────────────────
  [
    [-44,60],[-38,65],[-22,70],[-18,75],[-24,80],
    [-40,83],[-55,83],[-65,80],[-68,75],[-64,70],
    [-58,65],[-50,62],[-44,60],
  ],
  // ── North America (east, bounded at the limb lon=-90) ──────────────────
  // Polygon starts/ends on the limb so the Z close traces the horizon edge.
  [
    [-90,60],[-85,58],[-78,55],[-67,48],[-65,44],
    [-70,42],[-76,38],[-80,35],[-82,30],[-80,25],
    [-80,20],[-84,15],[-88,16],[-90,16],
  ],
  // ── South America ───────────────────────────────────────────────────────
  [
    [-80,0],[-78,-2],[-75,-10],[-72,-18],[-68,-30],
    [-68,-55],[-65,-55],[-58,-52],[-55,-38],[-48,-28],
    [-40,-20],[-34,-8],[-38,-4],[-46,-1],[-52,4],
    [-58,8],[-60,12],[-72,12],[-75,8],[-78,5],[-80,0],
  ],
  // ── Asia (Turkey → Levant → Arabia → India → Central Asia, limb-bounded) ─
  [
    [28,41],  // Istanbul (junction with Europe)
    [36,37],  // Turkey S Mediterranean
    [36,33],  // Lebanon / Syria
    [35,29],  // Sinai junction with Africa
    [38,20],  // Saudi Arabia Red Sea coast
    [43,12],  // Yemen / Aden
    [54,18],  // Oman W
    [58,22],  // Oman NE
    [62,22],  // Pakistan S
    [68,22],  // Karachi
    [70,20],  // India NW
    [72,8],   // India SW (Kerala)
    [80,8],   // India S tip
    [80,20],  // India E coast
    [87,22],  // Bangladesh / Calcutta
    [90,24],  // Limb S
    [90,56],  // Limb N
    [80,62],  // Russia / W Siberia
    [60,56],  // Kazakhstan
    [50,52],  // Kazakhstan W
    [44,44],  // Georgia / Caucasus
    [38,42],  // Turkey NE (Black Sea coast)
    [28,41],  // CLOSE
  ],
];

function projectPt(lon, lat, cx, cy, r) {
  const lonR = (lon * Math.PI) / 180;
  const latR = (lat * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(latR) * Math.sin(lonR),
    y: cy - r * Math.sin(latR),
    visible: Math.cos(latR) * Math.cos(lonR) > -0.05,
  };
}

function buildPath(coords, cx, cy, r) {
  let d = "";
  let penDown = false;
  for (const [lon, lat] of coords) {
    const { x, y, visible } = projectPt(lon, lat, cx, cy, r);
    if (visible) {
      d += penDown
        ? `L${x.toFixed(1)},${y.toFixed(1)}`
        : `M${x.toFixed(1)},${y.toFixed(1)}`;
      penDown = true;
    } else {
      penDown = false;
    }
  }
  if (d) d += "Z";
  return d;
}

export default function Globe({ pinCoords, size = 300 }) {
  const r  = (size - 4) / 2;
  const cx = size / 2;
  const cy = size / 2;

  const meridianRx = useMemo(() => {
    const out = [];
    for (let lon = 30; lon <= 150; lon += 30) {
      const rx = r * Math.sin((lon * Math.PI) / 180);
      if (rx > 0.5) out.push(rx);
    }
    return out;
  }, [r]);

  const parallels = useMemo(() => {
    const out = [];
    for (let lat = -60; lat <= 60; lat += 30) {
      const latR = (lat * Math.PI) / 180;
      out.push({
        rx: r * Math.cos(latR),
        ry: r * Math.cos(latR) * TILT,
        py: cy - r * Math.sin(latR),
        isEquator: lat === 0,
      });
    }
    return out;
  }, [r, cy]);

  const continentPaths = useMemo(
    () => CONTINENTS.map((coords) => buildPath(coords, cx, cy, r)),
    [cx, cy, r]
  );

  let pinX = null;
  let pinY = null;
  if (pinCoords) {
    const latR = (pinCoords.lat * Math.PI) / 180;
    const lonR = (pinCoords.lon * Math.PI) / 180;
    const z    = Math.cos(latR) * Math.cos(lonR);
    if (z >= -0.15) {
      pinX = cx + r * Math.cos(latR) * Math.sin(lonR);
      pinY = cy - r * Math.sin(latR);
    } else {
      const sign = lonR > 0 ? 1 : -1;
      pinX = cx + r * 0.82 * sign;
      pinY = cy - r * 0.65 * Math.sin(latR);
    }
  }

  return (
    <div className="globe-outer" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        style={{ display: "block" }}
        aria-hidden="true"
      >
        <defs>
          <clipPath id="globe-clip">
            <circle cx={cx} cy={cy} r={r} />
          </clipPath>
          <radialGradient id="globe-bg" cx="38%" cy="35%" r="65%">
            <stop offset="0%"   stopColor="#eef2ff" />
            <stop offset="60%"  stopColor="#dbe4ff" />
            <stop offset="100%" stopColor="#bfcbff" />
          </radialGradient>
        </defs>

        {/* Ocean */}
        <circle cx={cx} cy={cy} r={r} fill="url(#globe-bg)" />

        {/* Continents */}
        <g clipPath="url(#globe-clip)">
          {continentPaths.map((d, i) =>
            d ? (
              <path
                key={i}
                d={d}
                fill="rgba(64,81,253,0.6)"
                stroke="rgba(64,81,253,0.75)"
                strokeWidth="0.8"
                strokeLinejoin="round"
              />
            ) : null
          )}
        </g>

        {/* Grid lines */}
        <g
          clipPath="url(#globe-clip)"
          stroke="rgba(64,81,253,0.13)"
          strokeWidth="0.9"
          fill="none"
        >
          <line x1={cx} y1={cy - r} x2={cx} y2={cy + r} />
          {meridianRx.map((rx, i) => (
            <ellipse key={i} cx={cx} cy={cy} rx={rx} ry={r} />
          ))}
          {parallels.map((p, i) => (
            <ellipse
              key={i}
              cx={cx}
              cy={p.py}
              rx={p.rx}
              ry={p.ry}
              strokeWidth={p.isEquator ? 1.4 : 0.9}
            />
          ))}
        </g>

        {/* Outer ring */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="rgba(64,81,253,0.28)"
          strokeWidth="1.5"
        />

        {/* Location pin */}
        {pinX !== null && (
          <g>
            <circle cx={pinX} cy={pinY} r={11} fill="rgba(64,81,253,0.12)" />
            <circle cx={pinX} cy={pinY} r={6}  fill="rgba(64,81,253,0.28)" />
            <circle cx={pinX} cy={pinY} r={3.5} fill="#4051fd" />
            <circle cx={pinX} cy={pinY} r={1.5} fill="#fff" opacity="0.8" />
          </g>
        )}
      </svg>
    </div>
  );
}