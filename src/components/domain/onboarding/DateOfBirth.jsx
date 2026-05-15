import { useRef, useState, useEffect } from "react";
import "./DateOfBirth.css";

const ITEM_H = 54;           // height of each drum item in px
const PAD    = ITEM_H * 2;   // top/bottom padding so first/last items can centre

const MONTHS = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];

const NOW       = new Date();
const MIN_YEAR  = NOW.getFullYear() - 80;
const MAX_YEAR  = NOW.getFullYear() - 5;
const YEARS     = Array.from({ length: MAX_YEAR - MIN_YEAR + 1 }, (_, i) => MIN_YEAR + i);

function getDaysInMonth(month0, year) {
  return new Date(year, month0 + 1, 0).getDate();
}

/* ──────────────────────────────────────────────────────────────────
   Single drum column
────────────────────────────────────────────────────────────────── */
function Drum({ items, initialIdx, onSelect, format, label }) {
  const scrollRef = useRef();
  const timerRef  = useRef();
  const [visual, setVisual] = useState(initialIdx);

  // Scroll to initial position instantly on mount
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = initialIdx * ITEM_H;
    setVisual(initialIdx);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function handleScroll() {
    const el = scrollRef.current;
    if (!el) return;
    const raw     = el.scrollTop / ITEM_H;
    const idx     = Math.round(raw);
    const clamped = Math.max(0, Math.min(items.length - 1, idx));
    setVisual(clamped);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      onSelect(clamped);
    }, 120);
  }

  function tapItem(i) {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: i * ITEM_H, behavior: "smooth" });
    setVisual(i);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => onSelect(i), 320);
  }

  return (
    <div className="dob-drum-wrap" aria-label={label}>
      {/* Fixed highlight band at centre */}
      <div className="dob-drum-highlight" aria-hidden="true" />

      {/* Scrollable list */}
      <div
        ref={scrollRef}
        className="dob-drum-scroll"
        onScroll={handleScroll}
        aria-hidden="true"
      >
        <div className="dob-drum-pad" />
        {items.map((item, i) => (
          <div
            key={i}
            className={`dob-drum-item${i === visual ? " dob-drum-item--sel" : ""}`}
            onClick={() => tapItem(i)}
          >
            {format ? format(item) : item}
          </div>
        ))}
        <div className="dob-drum-pad" />
      </div>

      {/* Gradient fades */}
      <div className="dob-drum-fade dob-drum-fade--top" aria-hidden="true" />
      <div className="dob-drum-fade dob-drum-fade--bot" aria-hidden="true" />
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────
   DateOfBirth step
   value: "YYYY-MM-DD" string  |  onChange: (str) => void
────────────────────────────────────────────────────────────────── */
export default function DateOfBirth({ value, onChange }) {
  function parseValue() {
    if (value) {
      const [y, m, d] = value.split("-").map(Number);
      const yIdx = YEARS.indexOf(y);
      if (!isNaN(d) && m >= 1 && m <= 12) {
        return { dayIdx: d - 1, monthIdx: m - 1, yearIdx: yIdx >= 0 ? yIdx : YEARS.indexOf(2005) };
      }
    }
    // Default shown in Figma: Jun 12 2005
    return { dayIdx: 11, monthIdx: 5, yearIdx: YEARS.indexOf(2005) };
  }

  const init = parseValue();
  const [dayIdx,   setDayIdx]   = useState(init.dayIdx);
  const [monthIdx, setMonthIdx] = useState(init.monthIdx);
  const [yearIdx,  setYearIdx]  = useState(init.yearIdx >= 0 ? init.yearIdx : YEARS.length - 16);

  const currentYear  = YEARS[yearIdx];
  const daysCount    = getDaysInMonth(monthIdx, currentYear);
  const days         = Array.from({ length: daysCount }, (_, i) => i + 1);
  const clampedDay   = Math.min(dayIdx, daysCount - 1);

  function emit(d, m, yIdx) {
    const y       = YEARS[yIdx];
    const maxDay  = getDaysInMonth(m, y);
    const safeDay = Math.min(d, maxDay - 1);
    onChange?.(`${y}-${String(m + 1).padStart(2, "0")}-${String(safeDay + 1).padStart(2, "0")}`);
  }

  return (
    <div className="dob-step">
      <div className="dob-header">
        <h1 className="dob-title">Date of birth</h1>
        <p className="dob-subtitle">We use this to show you relevant comparisons and opportunities.</p>
      </div>

      <div className="dob-picker-shell">
        <div className="dob-picker" role="group" aria-label="Date of birth picker">
          {/* Day — remount key when daysCount changes to re-sync scroll */}
          <Drum
            key={`day-${daysCount}`}
            items={days}
            initialIdx={clampedDay}
            onSelect={(i) => { setDayIdx(i); emit(i, monthIdx, yearIdx); }}
            format={(d) => String(d).padStart(2, "0")}
            label="Day"
          />

          <Drum
            key="month"
            items={MONTHS}
            initialIdx={monthIdx}
            onSelect={(i) => { setMonthIdx(i); emit(clampedDay, i, yearIdx); }}
            label="Month"
          />

          <Drum
            key="year"
            items={YEARS}
            initialIdx={yearIdx}
            onSelect={(i) => { setYearIdx(i); emit(clampedDay, monthIdx, i); }}
            format={(y) => String(y)}
            label="Year"
          />
        </div>
      </div>
    </div>
  );
}
