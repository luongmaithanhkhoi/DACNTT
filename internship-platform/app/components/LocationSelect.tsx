'use client';

import { useEffect, useState } from "react";

type Location = {
  id: string;
  name: string;
  code: string;
};

export default function LocationSelect({
  onChange,
}: {
  onChange: (locationId: string) => void;
}) {
  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    fetch("/api/locations")
      .then((res) => res.json())
      .then(setLocations)
      .catch(console.error);
  }, []);

  return (
    <select
      className="dropdown"
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">Location...</option>

      {locations.map((loc) => (
        <option key={loc.id} value={loc.id}>
          {loc.name}
        </option>
      ))}
    </select>
  );
}
