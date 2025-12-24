'use client';

import { useEffect, useState } from "react";

type JobCategory = {
  id: string;
  name: string;
  code: string;
};

export default function CategorySelect({
  onSelect,
}: {
  onSelect: (categoryId: string) => void;
}) {
  const [categories, setCategories] = useState<JobCategory[]>([]);
  const [selected, setSelected] = useState("");

  useEffect(() => {
    fetch("/api/job-categories")
      .then(res => res.json())
      .then(setCategories)
      .catch(console.error);
  }, []);

  const handleChange = (value: string) => {
    setSelected(value);
    onSelect(value);
  };

  return (
    <select
      name="category"
      className="form-control"
      value={selected}
      onChange={(e) => handleChange(e.target.value)}
    >
      <option value="">Category...</option>

      {categories.map((cat) => (
        <option key={cat.id} value={cat.id}>
          {cat.name}
        </option>
      ))}
    </select>
  );
}
