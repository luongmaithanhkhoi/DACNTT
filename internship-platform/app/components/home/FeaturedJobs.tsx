"use client";

import { useEffect, useState } from "react";

type FeaturedJob = {
  id: string;
  title: string;
  job_type: string;
  start_date: string | null;
  end_date: string | null;
  Enterprise: {
    name: string;
  };
  Location: {
    name: string;
  };
};

export default function FeaturedJobs() {
  const [jobs, setJobs] = useState<FeaturedJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/jobs/featured")
      .then((res) => res.json())
      .then((data) => {
        setJobs(data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading featured jobs...</p>;
  }

  if (!jobs.length) {
    return <p>No featured jobs</p>;
  }

  return (
    <ul className="row">
      {jobs.map((job) => (
        <li key={job.id} className="col-lg-6 col-md-6">
          <div className="listWrpService">
            <div className="row">
              <div className="col-lg-3 col-md-3 col-xs-3">
                <div className="listImg">
                  {/* tạm hardcode icon, sau này gắn logo */}
                  <img src="/images/feature01.png" alt="" />
                </div>
              </div>

              <div className="col-lg-9 col-md-9 col-xs-9">
                <h3>
                  <a href={`/jobs/${job.id}`}>{job.title}</a>
                </h3>

                <p>{job.Enterprise.name}</p>

                <ul className="featureInfo">
                  <li>
                    <p>{job.Enterprise?.name ?? "Unknown Company"}</p>
                    <i className="fa fa-map-marker" />
                    {job.Location?.name ?? "Unknown Location"}
                  </li>

                  <li>
                    <i className="fa fa-calendar" /> {job.start_date} -{" "}
                    {job.end_date}
                  </li>
                </ul>

                <div className="time-btn">{job.job_type.replace("_", " ")}</div>

                <div className="click-btn">
                  <a href={`/jobs/${job.id}`}>Apply Now</a>
                </div>
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
