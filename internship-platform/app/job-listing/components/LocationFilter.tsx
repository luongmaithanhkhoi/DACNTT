"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Location = {
  id: string;
  name: string;
  code: string;
};

type Props = {
  value: string; // locationId đang chọn ("" = all)
  onSelect: (locationId: string) => void;
  placeholder?: string;
};

export default function LocationFilter({
  value,
  onSelect,
  placeholder = "Location...",
}: Props) {
  const [locations, setLocations] = useState<Location[]>([]);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  // nhớ tên location đã chọn để biết lúc nào nên clear query
  const selectedNameRef = useRef<string>("");

  useEffect(() => {
    fetch("/api/locations")
      .then((res) => res.json())
      .then(setLocations)
      .catch(console.error);
  }, []);

  // Sync input text theo value (locationId) từ parent
  useEffect(() => {
    if (!locations.length) return;

    if (value) {
      const loc = locations.find((l) => l.id === value);
      const name = loc?.name ?? "";
      selectedNameRef.current = name;
      setQuery(name);
    } else {
      // chỉ clear input nếu user đang giữ đúng "tên đã chọn" (tức chưa gõ cái khác)
      if (query === selectedNameRef.current) setQuery("");
      selectedNameRef.current = "";
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, locations]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return locations;
    return locations.filter((loc) => loc.name.toLowerCase().includes(q));
  }, [query, locations]);

  const clearSelection = () => {
    selectedNameRef.current = "";
    setQuery("");
    setOpen(false);
    onSelect(""); // ✅ quan trọng: clear locationId ở parent
  };

  const handleSelect = (loc: Location) => {
    selectedNameRef.current = loc.name;
    setQuery(loc.name);
    setOpen(false);
    onSelect(loc.id);
  };

  return (
    <div
      className="form-group"
      style={{ position: "relative" }}
      onBlur={() => setOpen(false)}
      tabIndex={0}
    >
      <input
        type="text"
        className="form-control"
        placeholder={placeholder}
        value={query}
        onFocus={() => setOpen(true)}
        onChange={(e) => {
          const text = e.target.value;
          setQuery(text);
          setOpen(true);

          // ✅ nếu trước đó đã chọn 1 location mà user bắt đầu sửa input -> clear locationId
          if (value) onSelect("");
        }}
      />

      {open && (
        <ul
          className="dropdown-menu show"
          style={{
            maxHeight: 180,
            overflowY: "auto",
            width: "100%",
            zIndex: 3000,
          }}
        >
          {/* option clear */}
          <li
            style={{ padding: "8px 12px", cursor: "pointer", fontWeight: 600 }}
            onMouseDown={clearSelection}
          >
            All locations
          </li>

          {filtered.map((loc) => (
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
