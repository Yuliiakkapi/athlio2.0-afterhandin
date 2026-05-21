import "./DonutChartCard.css";

const VISITOR_DATA = [
  { label: "Scouts", percentage: 50, color: "#4051fd" },
  { label: "Coaches", percentage: 23, color: "#fe7611" },
  { label: "Clubs", percentage: 17, color: "#33f578" },
  { label: "Agents", percentage: 10, color: "#ff6976" },
];

export default function DonutChartCard() {
  return (
    <div className="donut-card">
      <div className="donut-content">
        <div className="donut-chart-wrapper">
          <DonutChart data={VISITOR_DATA} />
        </div>

        <div className="donut-legend">
          {VISITOR_DATA.map((item) => (
            <div key={item.label} className="donut-legend-item">
              <div className="donut-legend-info">
                <div
                  className="donut-legend-color"
                  style={{ backgroundColor: item.color }}
                />
                <span className="donut-legend-label">{item.label}</span>
              </div>
              <span className="donut-legend-percentage">{item.percentage}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DonutChart({ data }) {
  let angle = 0;
  const slices = data.map((item, idx) => {
    const sliceAngle = (item.percentage / 100) * 360;
    const startAngle = angle;
    const endAngle = angle + sliceAngle;
    angle = endAngle;

    const radius = 45;
    const innerRadius = 30;

    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const x1 = radius * Math.cos(startRad);
    const y1 = radius * Math.sin(startRad);
    const x2 = radius * Math.cos(endRad);
    const y2 = radius * Math.sin(endRad);

    const ix1 = innerRadius * Math.cos(startRad);
    const iy1 = innerRadius * Math.sin(startRad);
    const ix2 = innerRadius * Math.cos(endRad);
    const iy2 = innerRadius * Math.sin(endRad);

    const largeArc = sliceAngle > 180 ? 1 : 0;

    const pathData = [
      `M ${ix1} ${iy1}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
      `L ${ix2} ${iy2}`,
      `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${ix1} ${iy1}`,
      "Z",
    ].join(" ");

    return (
      <path
        key={idx}
        d={pathData}
        fill={item.color}
        opacity="0.9"
      />
    );
  });

  return (
    <svg width="110" height="110" viewBox="-55 -55 110 110" className="donut-svg">
      {slices}
      <text x="0" y="0" textAnchor="middle" dy="0.3em" className="donut-center-text">
        43
      </text>
      <text x="0" y="12" textAnchor="middle" className="donut-center-label">
        visitors
      </text>
    </svg>
  );
}
