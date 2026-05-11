import createGlobe from "cobe";
import { useEffect, useRef } from "react";
import "./Globe.css";

const AUTO_ROTATE = 0.003;
const FRICTION    = 0.92;
const DRAG_SENS   = 0.005;

function lonToPhi(lon) {
  return -((lon * Math.PI) / 180) - Math.PI / 2;
}

export default function Globe({ pinCoords, size = 300 }) {
  const containerRef = useRef(null);
  const globeRef     = useRef(null);
  const phi          = useRef(0);
  const theta        = useRef(0.3);
  const dragging     = useRef(false);
  const lastX        = useRef(0);
  const lastY        = useRef(0);
  const velX         = useRef(0);
  const velY         = useRef(0);
  const targetPhi    = useRef(null);
  const targetTheta  = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create canvas imperatively — avoids React StrictMode re-mount
    // leaving a stale cobe-wrapped canvas that won't re-initialize.
    const canvas = document.createElement("canvas");
    canvas.style.cssText = `width:${size}px;height:${size}px;display:block;touch-action:none;cursor:grab;`;
    container.appendChild(canvas);

    const globe = createGlobe(canvas, {
      devicePixelRatio: 2,
      width:  size * 2,
      height: size * 2,
      phi:    phi.current,
      theta:  theta.current,
      dark:   1,
      diffuse: 1.2,
      mapSamples:    16000,
      mapBrightness: 6,
      baseColor:   [0.3, 0.3, 0.3],
      markerColor: [1.0, 0.6, 0.1],
      glowColor:   [1.0, 1.0, 1.0],
      markers: pinCoords
        ? [{ location: [pinCoords.lat, pinCoords.lon], size: 0.07 }]
        : [],
      onRender(state) {
        if (dragging.current) {
          phi.current   += velX.current;
          theta.current += velY.current;
        } else if (targetPhi.current !== null) {
          const dPhi   = targetPhi.current - phi.current;
          const dTheta = (targetTheta.current ?? theta.current) - theta.current;
          phi.current   += dPhi   * 0.06;
          theta.current += dTheta * 0.06;
          if (Math.abs(dPhi) < 0.003 && Math.abs(dTheta) < 0.003) {
            targetPhi.current   = null;
            targetTheta.current = null;
          }
        } else {
          velX.current *= FRICTION;
          velY.current *= FRICTION;
          phi.current   += velX.current;
          theta.current += velY.current;
          if (Math.abs(velX.current) < 0.0003) { velX.current = 0; phi.current += AUTO_ROTATE; }
          if (Math.abs(velY.current) < 0.0003)   velY.current = 0;
        }
        theta.current = Math.max(-0.52, Math.min(0.52, theta.current));
        state.phi   = phi.current;
        state.theta = theta.current;
      },
    });

    globeRef.current = globe;

    function down(e) {
      dragging.current  = true;
      lastX.current     = e.clientX;
      lastY.current     = e.clientY;
      velX.current      = 0;
      velY.current      = 0;
      targetPhi.current = null;
      canvas.setPointerCapture(e.pointerId);
      canvas.style.cursor = "grabbing";
    }
    function move(e) {
      if (!dragging.current) return;
      velX.current  = (e.clientX - lastX.current) * DRAG_SENS;
      velY.current  = (e.clientY - lastY.current) * DRAG_SENS * 0.4;
      phi.current   += velX.current;
      theta.current += velY.current;
      lastX.current = e.clientX;
      lastY.current = e.clientY;
    }
    function up() {
      dragging.current    = false;
      canvas.style.cursor = "grab";
    }

    canvas.addEventListener("pointerdown",   down);
    canvas.addEventListener("pointermove",   move);
    canvas.addEventListener("pointerup",     up);
    canvas.addEventListener("pointercancel", up);

    return () => {
      globe.destroy();
      globeRef.current = null;
      canvas.remove();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size]);

  useEffect(() => {
    if (!globeRef.current) return;
    globeRef.current.update({
      markers: pinCoords
        ? [{ location: [pinCoords.lat, pinCoords.lon], size: 0.07 }]
        : [],
    });
    if (pinCoords) {
      targetPhi.current   = lonToPhi(pinCoords.lon);
      targetTheta.current = -(pinCoords.lat * Math.PI) / 180 * 0.52;
    }
  }, [pinCoords]);

  return (
    <div
      ref={containerRef}
      className="globe-outer"
      style={{ width: size, height: size }}
    />
  );
}
