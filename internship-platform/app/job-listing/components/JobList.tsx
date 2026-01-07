"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
type Job = {
  id: string;
  title: string;
  description?: string | null;
  location?: string | null;
  internship_period?: string | null;
  application_deadline?: string | null;
  employment_type?: string | null;
  work_mode?: string | null;
  allowance_min?: number | null;
  allowance_max?: number | null;
  Enterprise?: {
    id: string;
    name?: string | null;
    image_url?: string | null;
    industry?: string | null;
    location?: string | null;
  } | null;
};

type JobsResponse = {
  total: number;
  items: Job[];
};

function formatDate(d?: string | null) {
  if (!d) return "";
  const date = new Date(d);
  if (Number.isNaN(date.getTime())) return d;
  return date.toLocaleDateString("vi-VN");
}

// tạo list page kiểu: 1 ... 4 5 [6] 7 8 ... 20
function buildPageList(totalPages: number, current: number) {
  const pages: Array<number | "…"> = [];
  const push = (x: number | "…") => pages.push(x);

  if (totalPages <= 9) {
    for (let i = 1; i <= totalPages; i++) push(i);
    return pages;
  }

  push(1);

  const left = Math.max(2, current - 2);
  const right = Math.min(totalPages - 1, current + 2);

  if (left > 2) push("…");
  for (let i = left; i <= right; i++) push(i);
  if (right < totalPages - 1) push("…");

  push(totalPages);
  return pages;
}

export default function JobsList({
  limit = 10, // pageSize
  q = "",
  locationId = "",
  categoryId = "",
}: {
  limit?: number;
  q?: string;
  locationId?: string;
  categoryId?: string;
}) {
  const pageSize = limit;

  const [jobs, setJobs] = useState<Job[]>([]);
  const [total, setTotal] = useState(0);

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // reset về trang 1 khi filter thay đổi
  useEffect(() => {
    setPage(1);
  }, [q, locationId, categoryId, pageSize]);

  useEffect(() => {
    let cancelled = false;

    async function fetchJobs(params: URLSearchParams): Promise<JobsResponse> {
      const res = await fetch(`/api/jobs?${params.toString()}`, { cache: "no-store" });
      const body = await res.json().catch(() => null);
      if (!res.ok) throw new Error(body?.error ?? `HTTP ${res.status}`);

      return {
        total: Number(body?.total ?? 0),
        items: (body?.items ?? []) as Job[],
      };
    }

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const hasLoc = !!locationId;
        const hasCat = !!categoryId;

        // base params
        const base = new URLSearchParams();
        base.set("order_by", "created_at");
        base.set("order_dir", "desc");
        if (q) base.set("q", q);

        // helper clone
        const mk = () => new URLSearchParams(base.toString());

        // CASE A: có cả Location + Category => ưu tiên both, nhưng vẫn hiển thị union
        if (hasLoc && hasCat) {
          // fetch đủ nhiều để render tới trang hiện tại
          const fetchCap = pageSize * page;

          const pBoth = mk();
          pBoth.set("limit", String(fetchCap));
          pBoth.set("offset", "0");
          pBoth.set("location_id", locationId);
          pBoth.set("category_id", categoryId);

          const pLoc = mk();
          pLoc.set("limit", String(fetchCap));
          pLoc.set("offset", "0");
          pLoc.set("location_id", locationId);

          const pCat = mk();
          pCat.set("limit", String(fetchCap));
          pCat.set("offset", "0");
          pCat.set("category_id", categoryId);

          const [bothRes, locRes, catRes] = await Promise.all([
            fetchJobs(pBoth),
            fetchJobs(pLoc),
            fetchJobs(pCat),
          ]);

          // union total = |L ∪ C| = |L| + |C| - |L∩C|
          const unionTotal = Math.max(0, locRes.total + catRes.total - bothRes.total);

          // merge unique theo thứ tự ưu tiên: both -> loc -> cat
          const map = new Map<string, Job>();
          for (const j of bothRes.items) map.set(j.id, j);
          for (const j of locRes.items) if (!map.has(j.id)) map.set(j.id, j);
          for (const j of catRes.items) if (!map.has(j.id)) map.set(j.id, j);

          const merged = Array.from(map.values());

          // slice đúng trang
          const startIdx = (page - 1) * pageSize;
          const pageItems = merged.slice(startIdx, startIdx + pageSize);

          if (!cancelled) {
            setJobs(pageItems);
            setTotal(unionTotal);
          }
          return;
        }

        // CASE B: chỉ có 0/1 filter => paginate chuẩn bằng offset
        const offset = (page - 1) * pageSize;

        const p = mk();
        p.set("limit", String(pageSize));
        p.set("offset", String(offset));
        if (hasLoc) p.set("location_id", locationId);
        if (hasCat) p.set("category_id", categoryId);

        const res = await fetchJobs(p);

        if (!cancelled) {
          setJobs(res.items ?? []);
          setTotal(res.total ?? 0);
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? "Unknown error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [pageSize, q, locationId, categoryId, page]);

  const totalPages = useMemo(() => {
    if (total <= 0) return 1;
    return Math.max(1, Math.ceil(total / pageSize));
  }, [total, pageSize]);

  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  const pageList = useMemo(() => buildPageList(totalPages, page), [totalPages, page]);

  if (loading) return <div>Đang tải jobs...</div>;
  if (error) return <div style={{ color: "red" }}>Lỗi: {error}</div>;

  return (
    <>
      <ul className="listService">
        {jobs.map((job) => (
          <li key={job.id}>
            <div className="listWrpService featured-wrap">
              <div className="row">
                <div className="col-xl-2 col-md-3 col-xs-3">
                  <div className="listImg">
                    <img src={job.Enterprise?.image_url || "/images/feature01.png"} alt="" />
                  </div>
                </div>

                <div className="col-xl-10 col-md-9 col-xs-9">
                  <div className="row">
                    <div className="col-xl-9">
                      <h3>
                        <a href={`/jobs/${job.id}`}>{job.title}</a>
                      </h3>

                      <p>{job.Enterprise?.name || "Company"}</p>

                      <ul className="featureInfo innerfeat">
                        <li>
                          <i className="fa fa-map-marker" aria-hidden="true" />{" "}
                          {job.location || job.Enterprise?.location || "—"}
                        </li>

                        <li>
                          <i className="fa fa-calendar" aria-hidden="true" />{" "}
                          {job.internship_period
                            ? job.internship_period
                            : job.application_deadline
                            ? `Deadline: ${formatDate(job.application_deadline)}`
                            : "—"}
                        </li>

                        <li>{job.employment_type || "—"}</li>
                      </ul>

                      <div className="para ">
                        <div
                          className="ProseMirror text-dark lh-lg line-clamp-2"
                          dangerouslySetInnerHTML={{
                            __html: job.description || "Không có mô tả chi tiết.",
                          }}
                              /> 
                        {/* {job.description?.slice(0, 180) || "Không có mô tả."}
                        {job.description && job.description.length > 180 ? "..." : ""} */}
                      </div>
                    </div>

                    <div className="col-xl-3">
                      <div className="click-btn apply">
                       <Link href={`/jobs/${job.id}`} className="click-btn apply">
                          Apply Now
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}

        {jobs.length === 0 && <li>Chưa có job nào.</li>}
      </ul>

      {/* Pagination */}
      <div className="pagiWrap">
        <div className="row">
          <div className="col-xl-4 col-md-4">
            <div className="showreslt">
              Showing {start}-{end} {total ? `of ${total}` : ""}
            </div>
          </div>

          <div className="col-xl-8 col-md-8">
            <ul className="pagination">
              <li className={page <= 1 ? "disabled" : ""}>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (page > 1) setPage(page - 1);
                  }}
                >
                  ‹
                </a>
              </li>

              {pageList.map((p, idx) =>
                p === "…" ? (
                  <li key={`dots-${idx}`} className="disabled">
                    <a href="#" onClick={(e) => e.preventDefault()}>
                      …
                    </a>
                  </li>
                ) : (
                  <li key={p} className={p === page ? "active" : ""}>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setPage(p);
                      }}
                    >
                      {p}
                    </a>
                  </li>
                )
              )}

              <li className={page >= totalPages ? "disabled" : ""}>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (page < totalPages) setPage(page + 1);
                  }}
                >
                  ›
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
