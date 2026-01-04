"use client";

import { useEffect, useState } from "react";

type JobCategory = {
  id: string;
  name: string;
  code: string;
  icon: string;
};

export default function JobCategoryGrid() {
  const [categories, setCategories] = useState<JobCategory[]>([]);

  useEffect(() => {
    fetch("/api/job-categories")
      .then(res => res.json())
      .then(setCategories)
      .catch(console.error);
  }, []);

  return (
    <ul className="row">
      {categories.slice(0, 8).map(cat => (
        <li key={cat.id} className="col-lg-3 col-md-6">
          <div className="jobsWrp">
            <div className="job-icon">
              <i className={`fa ${cat.icon}`} />
            </div>
            <div className="jobTitle">
              <a href={`/job-listing?category=${cat.id}`}>
                {cat.name}
              </a>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
