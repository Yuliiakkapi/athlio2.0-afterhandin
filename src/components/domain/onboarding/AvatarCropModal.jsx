import { useState, useRef, useCallback, useEffect } from "react";
import "./AvatarCropModal.css";

const CONTAINER = 280;
const OUTPUT    = 400;

function clamp(val, min, max) {
  return Math.min(max, Math.max(min, val));
}

function getMinScale(w, h) {
  return Math.max(CONTAINER / w, CONTAINER / h);
}

function clampPos(x, y, scale, w, h) {
  return {
    x: clamp(x, CONTAINER - w * scale, 0),
    y: clamp(y, CONTAINER - h * scale, 0),
  };
}

export default function AvatarCropModal({ src, onApply, onCancel }) {
  const imgRef        = useRef(null);
  const dragRef       = useRef(null);
  const touchRef      = useRef(null);
  const lastPinchRef  = useRef(null);
  const stateRef      = useRef({});

  const [pos,      setPos]      = useState({ x: 0, y: 0 });
  const [scale,    setScale]    = useState(1);
  const [nat,      setNat]      = useState(null);
  const [minScale, setMinScale] = useState(1);

  // Keep stateRef in sync so event handlers never see stale values
  useEffect(() => {
    stateRef.current = { pos, scale, nat, minScale };
  });

  // ── Image load: fit-to-fill and centre ─────────────────────────
  function handleImgLoad(e) {
    const { naturalWidth: w, naturalHeight: h } = e.currentTarget;
    const ms = getMinScale(w, h);
    setNat({ w, h });
    setMinScale(ms);
    setScale(ms);
    setPos({ x: (CONTAINER - w * ms) / 2, y: (CONTAINER - h * ms) / 2 });
  }

  // ── Mouse drag ─────────────────────────────────────────────────
  const handleMouseMove = useCallback((e) => {
    if (!dragRef.current) return;
    const { nat: n, scale: s } = stateRef.current;
    if (!n) return;
    setPos(clampPos(
      e.clientX - dragRef.current.startX,
      e.clientY - dragRef.current.startY,
      s, n.w, n.h,
    ));
  }, []);

  const handleMouseUp = useCallback(() => {
    dragRef.current = null;
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup",   handleMouseUp);
  }, [handleMouseMove]);

  function handleMouseDown(e) {
    e.preventDefault();
    dragRef.current = { startX: e.clientX - pos.x, startY: e.clientY - pos.y };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup",   handleMouseUp);
  }

  // ── Touch drag + pinch zoom ────────────────────────────────────
  function handleTouchStart(e) {
    if (e.touches.length === 1) {
      touchRef.current = {
        startX: e.touches[0].clientX - pos.x,
        startY: e.touches[0].clientY - pos.y,
      };
    } else if (e.touches.length === 2) {
      lastPinchRef.current = Math.hypot(
        e.touches[1].clientX - e.touches[0].clientX,
        e.touches[1].clientY - e.touches[0].clientY,
      );
    }
  }

  function handleTouchMove(e) {
    e.preventDefault();
    const { nat: n, scale: s, minScale: ms, pos: p } = stateRef.current;
    if (!n) return;

    if (e.touches.length === 2 && lastPinchRef.current != null) {
      const dist = Math.hypot(
        e.touches[1].clientX - e.touches[0].clientX,
        e.touches[1].clientY - e.touches[0].clientY,
      );
      const ratio = dist / lastPinchRef.current;
      lastPinchRef.current = dist;
      const next  = clamp(s * ratio, ms, ms * 4);
      const imgCX = (CONTAINER / 2 - p.x) / s;
      const imgCY = (CONTAINER / 2 - p.y) / s;
      setScale(next);
      setPos(clampPos(CONTAINER / 2 - imgCX * next, CONTAINER / 2 - imgCY * next, next, n.w, n.h));
    } else if (e.touches.length === 1 && touchRef.current) {
      setPos(clampPos(
        e.touches[0].clientX - touchRef.current.startX,
        e.touches[0].clientY - touchRef.current.startY,
        s, n.w, n.h,
      ));
    }
  }

  function handleTouchEnd(e) {
    if (e.touches.length < 2) lastPinchRef.current = null;
    if (e.touches.length === 0) touchRef.current = null;
  }

  // ── Scroll-wheel zoom ──────────────────────────────────────────
  function handleWheel(e) {
    e.preventDefault();
    const { nat: n, scale: s, minScale: ms, pos: p } = stateRef.current;
    if (!n) return;
    const next  = clamp(s * (e.deltaY < 0 ? 1.08 : 0.92), ms, ms * 4);
    const imgCX = (CONTAINER / 2 - p.x) / s;
    const imgCY = (CONTAINER / 2 - p.y) / s;
    setScale(next);
    setPos(clampPos(CONTAINER / 2 - imgCX * next, CONTAINER / 2 - imgCY * next, next, n.w, n.h));
  }

  // ── Zoom slider ────────────────────────────────────────────────
  function handleSlider(e) {
    const { nat: n, scale: s, minScale: ms, pos: p } = stateRef.current;
    if (!n) return;
    const next  = ms + (Number(e.target.value) / 100) * ms * 3;
    const imgCX = (CONTAINER / 2 - p.x) / s;
    const imgCY = (CONTAINER / 2 - p.y) / s;
    setScale(next);
    setPos(clampPos(CONTAINER / 2 - imgCX * next, CONTAINER / 2 - imgCY * next, next, n.w, n.h));
  }

  const sliderPct = nat ? clamp(Math.round(((scale - minScale) / (minScale * 3)) * 100), 0, 100) : 0;

  // ── Apply: render to canvas and export ────────────────────────
  function handleApply() {
    if (!imgRef.current || !nat) return;
    const canvas = document.createElement("canvas");
    canvas.width  = OUTPUT;
    canvas.height = OUTPUT;
    const ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.arc(OUTPUT / 2, OUTPUT / 2, OUTPUT / 2, 0, Math.PI * 2);
    ctx.clip();
    const ratio = OUTPUT / CONTAINER;
    ctx.drawImage(
      imgRef.current,
      pos.x * ratio,
      pos.y * ratio,
      nat.w * scale * ratio,
      nat.h * scale * ratio,
    );
    onApply(canvas.toDataURL("image/jpeg", 0.92));
  }

  useEffect(() => () => {
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup",   handleMouseUp);
  }, [handleMouseMove, handleMouseUp]);

  return (
    <div className="acm-overlay" onClick={onCancel}>
      <div className="acm-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="acm-handle" />
        <h2 className="acm-title heading-3xl-italic">Adjust photo</h2>
        <p className="acm-hint text-sm-medium">Drag to reposition · pinch or scroll to zoom</p>

        <div
          className="acm-crop-wrap"
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onWheel={handleWheel}
          style={{ touchAction: "none" }}
        >
          <img
            ref={imgRef}
            src={src}
            alt=""
            className="acm-img"
            draggable={false}
            onLoad={handleImgLoad}
            style={nat ? { left: pos.x, top: pos.y, width: nat.w * scale, height: nat.h * scale } : { visibility: "hidden" }}
          />
          {/* Dark overlay with transparent circular aperture */}
          <div className="acm-crop-mask" />
          {/* Subtle white ring to delineate the crop boundary */}
          <div className="acm-circle-ring" />
        </div>

        <div className="acm-zoom-row">
          <span className="acm-zoom-icon">−</span>
          <input
            type="range"
            className="acm-zoom-slider"
            min={0}
            max={100}
            value={sliderPct}
            onChange={handleSlider}
          />
          <span className="acm-zoom-icon">+</span>
        </div>

        <div className="acm-actions">
          <button className="acm-btn acm-btn--cancel text-base-semibold" type="button" onClick={onCancel}>
            Cancel
          </button>
          <button className="acm-btn acm-btn--apply text-base-semibold" type="button" onClick={handleApply}>
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}