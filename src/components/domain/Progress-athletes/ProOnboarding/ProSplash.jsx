import { useEffect } from "react";
import "./ProSplash.css";

export default function ProSplash({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2500);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="pro-splash">
      <span className="pro-splash-title">PRO</span>
      <p className="pro-splash-sub">Setting up your Pro experience...</p>
    </div>
  );
}
