"use client";

import React, { useEffect, useMemo, useState } from "react";

type EventItem = {
  id: string;
  title: string;
  description?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  status?: string | null; // PUBLISHED|CLOSED|DRAFT
  location?: string | null;
  created_at?: string | null;

  // nếu DB bạn có category_id
  category_id?: string | null;

  // nếu bạn vẫn còn event_type trong DB thì giữ, còn bỏ thì xóa dòng này
  // event_type?: string | null;
};

type EventsResponse = {
  total: number;
  items: EventItem[];
};

type CategoryItem = { id: string; name: string; slug?: string | null };

function formatShortDate(d?: string | null) {
  if (!d) return "";
  const date = new Date(d);
  if (Number.isNaN(date.getTime())) return "";
  const day = String(date.getDate()).padStart(2, "0");
  const mon = date.toLocaleString("en-US", { month: "short" }).toUpperCase();
  return `${day} ${mon}`;
}

function buildPageList(totalPages: number, current: number) {
  const pages: Array<number | "…"> = [];
  const push = (x: number | "…") => pages.push(x);

  if (totalPages <= 8) {
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

export default function EventList({
  limit = 10,
  onlyPublished = true,
  q = "",
  categoryId = "",
}: {
  limit?: number;
  onlyPublished?: boolean;
  q?: string;
  categoryId?: string;
}) {
  const pageSize = limit;

  const [events, setEvents] = useState<EventItem[]>([]);
  const [total, setTotal] = useState(0);

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cateMap, setCateMap] = useState<Record<string, string>>({});

  // ✅ reset về trang 1 khi filter/search thay đổi
  useEffect(() => {
    setPage(1);
  }, [q, categoryId, pageSize]);

  const totalPages = useMemo(() => {
    if (!total) return 1;
    return Math.max(1, Math.ceil(total / pageSize));
  }, [total, pageSize]);

  const pageList = useMemo(
    () => buildPageList(totalPages, page),
    [totalPages, page]
  );

  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  // ✅ fetch phụ thuộc page để pagination chạy
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const offset = (page - 1) * pageSize;

        const params = new URLSearchParams();
        params.set("limit", String(pageSize));
        params.set("offset", String(offset));
        params.set("order_by", "start_date");
        params.set("order_dir", "desc");
        if (onlyPublished) params.set("status", "PUBLISHED");

        if (q) params.set("q", q);
        if (categoryId) params.set("category_id", categoryId);

        const res = await fetch(`/api/events?${params.toString()}`, {
          cache: "no-store",
        });
        const body = (await res
          .json()
          .catch(() => null)) as EventsResponse | null;

        if (!res.ok)
          throw new Error((body as any)?.error ?? `HTTP ${res.status}`);

        if (!cancelled) {
          setEvents(body?.items ?? []);
          setTotal(body?.total ?? 0);
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
  }, [page, pageSize, onlyPublished, q, categoryId]);

  useEffect(() => {
    fetch(
      "/api/events/categories?limit=200&offset=0&order_by=name&order_dir=asc",
      {
        cache: "no-store",
      }
    )
      .then((r) => r.json())
      .then((body) => {
        const items = (body?.items ?? body ?? []) as CategoryItem[];
        const map: Record<string, string> = {};
        for (const c of items) map[c.id] = c.name;
        setCateMap(map);
      })
      .catch(() => setCateMap({}));
  }, []);

  if (loading) return <div>Đang tải tin tức...</div>;
  if (error) return <div style={{ color: "red" }}>Lỗi: {error}</div>;

  return (
    <>
      <div className="blogWraper">
        <ul className="blogList">
          {events.map((ev) => (
            <li key={ev.id}>
              <div className="row">
                <div className="col-lg-5 col-md-4">
                  <div className="postimg">
                    {/* bạn muốn giữ ảnh cố định thì để 1 ảnh */}
                    <img src={"/images/blog/4.jpg"} alt={ev.title} />
                    <div className="date">{formatShortDate(ev.start_date)}</div>
                  </div>
                </div>

                <div className="col-lg-7 col-md-8">
                  <div className="post-header">
                    <h4>
                      <a href={`/events/${ev.id}`}>{ev.title}</a>
                    </h4>

                    <div className="postmeta">
                      Location: <span>{ev.location || "—"}</span> &nbsp; |
                      &nbsp; Category:{" "}
                      <span>
                        {ev.category_id ? cateMap[ev.category_id] ?? "—" : "—"}
                      </span>
                    </div>
                  </div>

                  <p>
                    {(ev.description ?? "").slice(0, 160)}
                    {ev.description && ev.description.length > 160 ? "..." : ""}
                  </p>

                  <div className="view-btn">
                    <a href={`/events/${ev.id}`}>Read More</a>
                  </div>
                </div>
              </div>
            </li>
          ))}

          {events.length === 0 && <li>Chưa có tin tức / sự kiện nào.</li>}
        </ul>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagiWrap">
          <div className="row">
            <div className="col-lg-4 col-md-6">
              <div className="showreslt">
                Showing {start}-{end} {total ? `of ${total}` : ""}
              </div>
            </div>

            <div className="col-lg-8 col-md-6">
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
      )}
    </>
  );
}
