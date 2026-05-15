import { useMemo } from "react";
import "./Globe.css";

const TILT = 0.28;

export default function Globe({ pinCoords, size = 300 }) {
  const r  = (size - 4) / 2;
  const cx = size / 2;
  const cy = size / 2;

  // Vertical ellipses for meridians at 30° intervals
  const meridianRx = useMemo(() => {
    const out = [];
    for (let lon = 30; lon <= 150; lon += 30) {
      const rx = r * Math.sin((lon * Math.PI) / 180);
      if (rx > 0.5) out.push(rx);
    }
    return out;
  }, [r]);

  // Horizontal ellipses for parallels at 30° intervals
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

  // Orthographic projection of pin
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
      // Back hemisphere — clamp to edge
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

        {/* Background fill */}
        <circle cx={cx} cy={cy} r={r} fill="url(#globe-bg)" />

        {/* Grid lines (clipped to globe circle) */}
        <g
          clipPath="url(#globe-clip)"
          stroke="rgba(64,81,253,0.18)"
          strokeWidth="0.9"
          fill="none"
        >
          {/* Prime meridian */}
          <line x1={cx} y1={cy - r} x2={cx} y2={cy + r} />
          {/* Other meridians */}
          {meridianRx.map((rx, i) => (
            <ellipse key={i} cx={cx} cy={cy} rx={rx} ry={r} />
          ))}
          {/* Parallels */}
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
