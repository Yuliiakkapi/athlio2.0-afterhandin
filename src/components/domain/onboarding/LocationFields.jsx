import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MapPin, X } from "@phosphor-icons/react";
import SearchBar from "../../UI/SearchBar";
import Globe from "./Globe";
import "./LocationFields.css";

const NOMINATIM = "https://nominatim.openstreetmap.org";

async function searchCities(query) {
  const url = `${NOMINATIM}/search?q=${encodeURIComponent(query)}&format=json&limit=6&addressdetails=1`;
  const res  = await fetch(url, { headers: { "Accept-Language": "en" } });
  const data = await res.json();
  return data
    .filter(r => r.address && (r.address.city || r.address.town || r.address.village || r.address.municipality))
    .map(r => ({
      id:      r.place_id,
      city:    r.address.city || r.address.town || r.address.village || r.address.municipality,
      country: r.address.country || "",
      lat:     parseFloat(r.lat),
      lon:     parseFloat(r.lon),
    }))
    .filter((r, i, arr) => arr.findIndex(x => x.city === r.city && x.country === r.country) === i)
    .slice(0, 5);
}

export default function LocationFields({ country, city, onChange }) {
  const [query,       setQuery]       = useState(city || "");
  const [suggestions, setSuggestions] = useState([]);
  const [searching,   setSearching]   = useState(false);
  const [open,        setOpen]        = useState(false);
  const [pinCoords,   setPinCoords]   = useState(null);
  const deb           = useRef(null);
  const searchWrapRef = useRef(null);
  const [dropdownRect, setDropdownRect] = useState(null);

  const hasSelection = !!(city && country);

  useEffect(() => {
    if (deb.current) clearTimeout(deb.current);
    const term = query.trim();
    if (term.length < 2) { setSuggestions([]); setOpen(false); return; }
    setSearching(true);
    deb.current = setTimeout(async () => {
      try {
        const results = await searchCities(term);
        setSuggestions(results);
        setOpen(results.length > 0);
      } catch { /* silent */ }
      finally { setSearching(false); }
    }, 400);
  }, [query]);

  function pickSuggestion(s) {
    setQuery(""); setSuggestions([]); setOpen(false);
    onChange({ city: s.city, country: s.country });
    setPinCoords({ lat: s.lat, lon: s.lon });
  }

  function clearSelection() {
    onChange({ city: "", country: "" });
    setPinCoords(null);
    setQuery("");
  }

  useEffect(() => {
    if (!open || !searchWrapRef.current) { setDropdownRect(null); return; }
    function update() {
      const r = searchWrapRef.current?.getBoundingClientRect();
      if (r) setDropdownRect({ top: r.bottom + 6, left: r.left, right: window.innerWidth - r.right });
    }
    update();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [open]);

  const globeSize = Math.min(Math.round(window.innerWidth * 0.78), 300);

  return (
    <div className="loc-step">
      <div className="loc-header">
        <h1 className="loc-title">Your Location</h1>
        <p className="loc-subtitle">
          Get recommended nearby clubs, local opportunities and regional leaderboards.
        </p>
      </div>

      {hasSelection ? (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div className="loc-selected-chip">
            <MapPin size={15} weight="fill" />
            {city}, {country}
          </div>
          <button className="loc-selected-clear" onClick={clearSelection} aria-label="Clear location">
            <X size={18} weight="bold" />
          </button>
        </div>
      ) : (
        <div className="loc-search-wrap" ref={searchWrapRef}>
          <SearchBar
            label="Search for a city or town..."
            placeholder="Search for a city or town..."
            value={query}
            onChange={(v) => setQuery(v)}
            onClear={() => { setQuery(""); setSuggestions([]); setOpen(false); }}
          />

          {open && dropdownRect && createPortal(
            <div
              className="loc-suggestions"
              style={{ position: "fixed", top: dropdownRect.top, left: dropdownRect.left, right: dropdownRect.right }}
            >
              {searching && <p className="loc-searching">Searching…</p>}
              {suggestions.map(s => (
                <button key={s.id} className="loc-suggestion-item" onClick={() => pickSuggestion(s)} type="button">
                  <MapPin size={16} weight="fill" className="loc-suggestion-pin" />
                  <div className="loc-suggestion-text">
                    <span className="loc-suggestion-city">{s.city}</span>
                    <span className="loc-suggestion-country">{s.country}</span>
                  </div>
                </button>
              ))}
            </div>,
            document.body
          )}
        </div>
      )}

      <div className="loc-visual" aria-hidden="true">
        <div className="loc-glow" />
        <div className="loc-ring" />
        <div className="loc-ring" />
        <div className="loc-ring" />
        <Globe pinCoords={pinCoords} size={globeSize} />
      </div>
    </div>
  );
}
