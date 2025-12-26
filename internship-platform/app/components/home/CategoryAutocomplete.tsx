"use client";

import { useEffect, useState } from "react";

type JobCategory = {
  id: string;
  name: string;
};

export default function CategoryAutocomplete({
  onSelect,
}: {
  onSelect: (categoryId: string) => void;
}) {
  const [categories, setCategories] = useState<JobCategory[]>([]);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetch("/api/job-categories")
      .then(res => res.json())
      .then(setCategories)
      .catch(console.error);
  }, []);

  const filtered = categories.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="autocomplete">
      <input
        type="text"
        className="form-control"
        placeholder="Category..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
      />

      {open && filtered.length > 0 && (
        <ul className="autocomplete-list"
        style={{
          position: "absolute",
          top: "100%",
          left: 0,
          right: 0,
          background: "#fff",
          border: "1px solid #ddd",
          zIndex: 1000,
          maxHeight: 220,
          overflowY: "auto",
          listStyle: "none",
          margin: 0,
          padding: 0,
        }}
        >
          {filtered.map(cat => (
            <li
              key={cat.id}
              style={{
                padding: "8px 12px",
                cursor: "pointer",
              }}
              onClick={() => {
                setQuery(cat.name);
                setOpen(false);
                onSelect(cat.id);
              }}
              
            >
              {cat.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
