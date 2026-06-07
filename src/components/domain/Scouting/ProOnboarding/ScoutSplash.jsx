import { useEffect } from "react";
import "./ScoutSplash.css";

export default function ScoutSplash({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2500);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="scout-splash">
      <span className="scout-splash-title">PRO</span>
      <p className="scout-splash-sub">Setting up your Pro Scout experience...</p>
    </div>
  );
}