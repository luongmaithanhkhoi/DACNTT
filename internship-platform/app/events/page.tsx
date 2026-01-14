"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import EventList from "./components/EventList";
import EventSidebar from "./components/EventSidebar";

export default function EventPage() {
  const searchParams = useSearchParams();

  // state filter
  const [q, setQ] = useState("");
  const [categoryId, setCategoryId] = useState("");

  /**
   * ✅ SYNC URL QUERY → STATE
   * Ví dụ:
   * /events?q=abc&category=UUID
   */
  useEffect(() => {
    const qParam = searchParams.get("q") ?? "";
    const categoryParam = searchParams.get("category") ?? "";

    setQ(qParam);
    setCategoryId(categoryParam);
  }, [searchParams]);
  
  return (
    <>
      {/*inner heading start*/}
      {/* <div className="inner-heading">
        <div className="container">
          <h3>Blog</h3>
        </div>
      </div> */}
      {/*inner heading end*/}
      {/*Inner Content start*/}
      <div className="inner-content blog-wrap">
        <div className="container">
          {/*Blog Start*/}
          <div className="row">
            <div className="col-lg-8">
              {/* Blog List start */}
              <EventList limit={6} q={q} categoryId={categoryId} />
            </div>
            <div className="col-lg-4">
              {/* Side Bar */}
              <EventSidebar
                q={q}
                categoryId={categoryId}
                onApply={({ q, categoryId }) => {
                  setQ(q);
                  setCategoryId(categoryId);
                }}
              />
            </div>
          </div>
          {/*Blog End*/}
        </div>
      </div>
      {/*Inner Content End*/}
    </>
  );
}
