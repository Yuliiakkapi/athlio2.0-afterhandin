import Button from "../components/UI/Button";
import "./DesignSystem.css";

const VARIANTS = ["primary", "outline", "secondary", "subtle"];
const SIZES = ["medium", "small", "xsmall"];

export default function DesignSystem() {
  return (
    <div className="ds-page">
      <h1 className="ds-title">Button variants</h1>

      {/* ── Size × Variant grid ───────────────────────────────── */}
      {SIZES.map((size) => (
        <section key={size} className="ds-section">
          <h2 className="ds-section-title">{size}</h2>
          <div className="ds-row">
            {VARIANTS.map((type) => (
              <div key={type} className="ds-cell">
                <span className="ds-label">{type}</span>
                <Button size={size} type={type} label="Button" />
              </div>
            ))}
          </div>
        </section>
      ))}

      {/* ── Big (full-width) ─────────────────────────────────── */}
      <section className="ds-section">
        <h2 className="ds-section-title">big (full-width)</h2>
        <div className="ds-col">
          {VARIANTS.map((type) => (
            <div key={type} className="ds-cell ds-cell--full">
              <span className="ds-label">{type}</span>
              <Button size="big" type={type} label="Button" />
            </div>
          ))}
        </div>
      </section>

      {/* ── Disabled states ──────────────────────────────────── */}
      <section className="ds-section">
        <h2 className="ds-section-title">disabled</h2>
        <div className="ds-row">
          {VARIANTS.map((type) => (
            <div key={type} className="ds-cell">
              <span className="ds-label">{type}</span>
              <Button size="medium" type={type} label="Button" disabled />
            </div>
          ))}
        </div>
      </section>

      {/* ── With Icon ────────────────────────────────────────── */}
      <section className="ds-section">
        <h2 className="ds-section-title">with icon</h2>
        <div className="ds-row">
          {VARIANTS.map((type) => (
            <div key={type} className="ds-cell">
              <span className="ds-label">{type}</span>
              <Button
                size="medium"
                type={type}
                label="Button"
                Icon={() => (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                )}
              />
            </div>
          ))}
        </div>
      </section>

      {/* ── Extra variants ───────────────────────────────────── */}
      <section className="ds-section">
        <h2 className="ds-section-title">extra variants</h2>
        <div className="ds-row">
          <div className="ds-cell">
            <span className="ds-label">gray</span>
            <Button size="medium" type="gray" label="Button" />
          </div>
          <div className="ds-cell">
            <span className="ds-label">following</span>
            <Button size="medium" type="following" label="Following" />
          </div>
        </div>
      </section>
    </div>
  );
}
