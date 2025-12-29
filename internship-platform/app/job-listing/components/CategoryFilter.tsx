'use client';

import { useEffect, useState } from 'react';

type JobCategory = {
  id: string;
  name: string;
};

export default function CategoryFilter({
  value,
  onChange,
}: {
  value: string;
  onChange: (id: string) => void;
}) {
  const [categories, setCategories] = useState<JobCategory[]>([]);

  useEffect(() => {
    fetch('/api/job-categories')
      .then(res => res.json())
      .then(setCategories)
      .catch(console.error);
  }, []);

  return (
    <div className="form-group">
      <select
        className="form-control"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          maxHeight: 180,   // 👈 giới hạn chiều cao
          overflowY: 'auto'
        }}
      >
        <option value="">All categories</option>
        {categories.map(cat => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>
    </div>
  );
}
