"use client";

import { useState } from "react";
import EventDetailSidebar from "./components/EventDetailSidebar";

type EventDetail = {
  id: string;
  title: string;
  description?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  status?: string | null;
  location?: string | null;
  event_categories?: {
    id: string;
    name: string;
  } | null;
  tags?: { id: string; name: string }[];
};

function formatDate(d?: string | null) {
  if (!d) return "—";
  const date = new Date(d);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("vi-VN");
}

export default function EventDetailClient({ ev }: { ev: EventDetail }) {
  const [q, setQ] = useState("");
  const [categoryId, setCategoryId] = useState("");

  return (
    <>
      <div className="inner-heading">
        <div className="container">
          <h3>{ev.title}</h3>
        </div>
      </div>

      <div className="inner-content blog-wrap">
        <div className="container">
          <div className="row">
            {/* LEFT */}
            <div className="col-lg-8">
              <div className="blogWraper blogdetail">
                <ul className="blogList">
                  <li>
                    <div className="post-header margin-top30">
                      <h4>{ev.title}</h4>

                      <div className="postmeta">
                        <strong>Category:</strong>{" "}
                        {ev.event_categories?.name ?? "—"} |{" "}
                        <strong>Location:</strong> {ev.location ?? "—"}
                      </div>

                      <div className="postmeta">
                        <strong>Start:</strong>{" "}
                        {formatDate(ev.start_date)} |{" "}
                        <strong>End:</strong>{" "}
                        {formatDate(ev.end_date)}
                      </div>
                    </div>

                    <hr />

                    <div className="postmeta ProseMirror">
                      <div
                          dangerouslySetInnerHTML={{
                            __html: ev.description || 'Không có mô tả chi tiết.',
                          }}
                        >
                      </div>
                      
                      {/* {ev.description ?? "Chưa có mô tả."} */}
                    </div>
                   
        

                    {ev.tags && ev.tags.length > 0 && (
                      <>
                        <hr />
                        <div className="postmeta ">
                          
                          <strong>Tags:</strong>{" "}
                          {ev.tags.map((t) => (
                            <span
                              key={t.id}
                              style={{
                                marginRight: 8,
                                padding: "2px 8px",
                                border: "1px solid #ddd",
                                borderRadius: 4,
                                fontSize: 13,
                              }}
                            >
                              #{t.name}
                            </span>
                          ))}
                        </div>
                      </>
                    )}
                  </li>
                </ul>
              </div>
            </div>

            {/* RIGHT */}
            <div className="col-lg-4">
              <EventDetailSidebar
                q={q}
                categoryId={categoryId}
                onApply={({ q, categoryId }) => {
                  setQ(q);
                  setCategoryId(categoryId);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
