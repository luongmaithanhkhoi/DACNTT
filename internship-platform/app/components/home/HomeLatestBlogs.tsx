"use client";

import React, { useEffect, useState } from "react";

type BlogItem = {
  id: string;
  title: string;
  description?: string | null;
  start_date?: string | null;
  category_id?: string | null;
};  

function formatShortDate(d?: string | null) {
  if (!d) return "";
  const date = new Date(d);
  const day = String(date.getDate()).padStart(2, "0");
  const mon = date.toLocaleString("en-US", { month: "short" }).toUpperCase();
  return `${day} ${mon}`;
}

export default function HomeLatestBlogs() {
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [cateMap, setCateMap] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch(
      "/api/events?limit=3&offset=0&order_by=start_date&order_dir=desc&status=PUBLISHED",
      { cache: "no-store" }
    )
      .then((r) => r.json())
      .then((body) => setBlogs(body?.items ?? []))
      .catch(() => setBlogs([]));
  }, []);

  useEffect(() => {
    fetch(
      "/api/events/categories?limit=200&offset=0&order_by=name&order_dir=asc",
      { cache: "no-store" }
    )
      .then((r) => r.json())
      .then((body) => {
        const items = body?.items ?? body ?? [];
        const map: Record<string, string> = {};
        for (const c of items) {
          map[c.id] = c.name;
        }
        setCateMap(map);
      })
      .catch(() => setCateMap({}));
  }, []);

  return (
    <div className="blog-wrap">
      <div className="container">
        <div className="heading-title">
          Latest <span>Blogs</span>
        </div>

        <div className="headTxt">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et viverra
          nulla. Fusce at rhoncus diam, quis convallis ligula.
        </div>

        <ul className="row blogGrid">
          {blogs.map((blog) => (
            <li key={blog.id} className="col-lg-4">
              <div className="blog-inter">
                <div className="postimg">
                  <img src="/images/blog/1.jpg" alt={blog.title} />
                  <div className="date">{formatShortDate(blog.start_date)}</div>
                </div>

                <div className="post-header">
                  <h4>
                    <a href={`/events/${blog.id}`}>{blog.title}</a>
                  </h4>
                  <div className="postmeta">
                    Category :{" "}
                    <span>
                      {blog.category_id
                        ? cateMap[blog.category_id] ?? "—"
                        : "—"}
                    </span>
                  </div>
                </div>

                <div className="postmeta">
                  <p>
                    {(blog.description ?? "").slice(0, 100)}
                    {blog.description && blog.description.length > 100
                      ? "..."
                      : ""}
                  </p>
                  <div className="view-btn">
                    <a href={`/events/${blog.id}`}>Read More</a>
                  </div>
                </div>
              </div>
            </li>
          ))}

          {blogs.length === 0 && <li className="col-12">Chưa có bài viết.</li>}
        </ul>
      </div>
    </div>
  );
}
