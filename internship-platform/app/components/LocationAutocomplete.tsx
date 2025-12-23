'use client';

import { useEffect, useMemo, useState } from "react";

type Location = {
  id: string;
  name: string;
  code: string;
};

export default function LocationAutocomplete({
  onSelect,
}: {
  onSelect: (locationId: string) => void;
}) {
  const [locations, setLocations] = useState<Location[]>([]);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  // Load locations (OK vì đây là external system: API)
  useEffect(() => {
    fetch("/api/locations")
      .then(res => res.json())
      .then(setLocations)
      .catch(console.error);
  }, []);

  // Derived state → useMemo (KHÔNG useEffect)
  const filtered = useMemo(() => {
    if (!query.trim()) return [];

    const q = query.toLowerCase();
    return locations.filter(loc =>
      loc.name.toLowerCase().includes(q)
    );
  }, [query, locations]);

  const handleSelect = (loc: Location) => {
    setQuery(loc.name);
    setOpen(false);
    onSelect(loc.id);
  };

  return (
    <div style={{ position: "relative" }}>
      <input
        type="text"
        className="form-control"
        placeholder="Location..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
      />

      {open && filtered.length > 0 && (
        <ul
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            background: "#fff",
            border: "1px solid #ddd",
            zIndex: 1000,
            maxHeight: 200,
            overflowY: "auto",
            listStyle: "none",
            margin: 0,
            padding: 0,
          }}
        >
          {filtered.map(loc => (
            <li
              key={loc.id}
              style={{ padding: "8px 12px", cursor: "pointer" }}
              onMouseDown={() => handleSelect(loc)}
            >
              {loc.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
