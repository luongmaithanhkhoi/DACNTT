"use client";

import React, { useEffect, useState } from "react";

type EventItem = {
  id: string;
  title: string;
  start_date?: string | null;
};

type CategoryItem = {
  id: string;
  name: string;
  slug?: string | null;
};

function formatDate(d?: string | null) {
  if (!d) return "";
  const date = new Date(d);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("vi-VN");
}

export default function EventSidebar({
  q,
  categoryId,
  onApply, // ✅ 1 callback apply cả q + category
}: {
  q: string;
  categoryId: string;
  onApply: (payload: { q: string; categoryId: string }) => void;
}) {
  // draft state (người dùng đang nhập/chọn)
  const [draftText, setDraftText] = useState(q);
  const [draftCategoryId, setDraftCategoryId] = useState(categoryId);

  const [recent, setRecent] = useState<EventItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loadingCate, setLoadingCate] = useState(false);

  // khi state bên ngoài thay đổi (vd reset từ page) thì sync lại draft
  useEffect(() => setDraftText(q), [q]);
  useEffect(() => setDraftCategoryId(categoryId), [categoryId]);

  // Recent events
  useEffect(() => {
    fetch(
      "/api/events?limit=5&offset=0&order_by=start_date&order_dir=desc&status=PUBLISHED",
      { cache: "no-store" }
    )
      .then((r) => r.json())
      .then((body) => setRecent(body?.items ?? []))
      .catch(() => setRecent([]));
  }, []);

  // Categories
  useEffect(() => {
    let cancelled = false;

    async function loadCategories() {
      try {
        setLoadingCate(true);

        // ✅ endpoint của bạn đang dùng
        const res = await fetch(
          "/api/events/categories?limit=200&offset=0&order_by=name&order_dir=asc",
          { cache: "no-store" }
        );
        const body = await res.json().catch(() => null);

        if (!res.ok) throw new Error(body?.error ?? `HTTP ${res.status}`);

        const items = (body?.items ?? body ?? []) as CategoryItem[];
        if (!cancelled) setCategories(items);
      } catch {
        if (!cancelled) setCategories([]);
      } finally {
        if (!cancelled) setLoadingCate(false);
      }
    }

    loadCategories();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSearch = () => {
    onApply({
      q: draftText.trim(),
      categoryId: draftCategoryId,
    });
  };

  const handleReset = () => {
    setDraftText("");
    setDraftCategoryId("");
    onApply({ q: "", categoryId: "" });
  };

  return (
    <div className="sidebar">
      {/* Search input */}
      <div className="widget">
        <h5 className="widget-title">Search</h5>
        <div className="search">
          {/* chỉ còn input thôi, không có nút trong input */}
          <input
            type="text"
            className="form-control"
            placeholder="Tìm theo tiêu đề / nội dung..."
            value={draftText}
            onChange={(e) => setDraftText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch(); // ✅ Enter để search luôn
            }}
          />
        </div>
      </div>

      {/* Category */}
      <div className="widget">
        <h5 className="widget-title">Chủ đề</h5>

        <select
          className="form-control"
          value={draftCategoryId}
          onChange={(e) => setDraftCategoryId(e.target.value)}
          disabled={loadingCate}
        >
          <option value="">{loadingCate ? "Đang tải..." : "Tất cả chủ đề"}</option>

          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        {!loadingCate && categories.length === 0 && (
          <div style={{ marginTop: 8, fontSize: 13, opacity: 0.8 }}>
            Chưa có category (hoặc API category chưa đúng endpoint).
          </div>
        )}
      </div>

      {/* ✅ Search button riêng */}
      <div className="widget">
        <button type="button" className="btn btn-block" onClick={handleSearch}>
          Search
        </button>
      </div>

      {/* Reset */}
      <div className="widget">
        <button type="button" className="btn btn-block" onClick={handleReset}>
          Reset filter
        </button>
      </div>

      {/* Recent List */}
      <div className="widget">
        <h5 className="widget-title">Recent List</h5>
        <ul className="papu-post">
          {recent.slice(0, 5).map((ev) => (
            <li key={ev.id}>
              <div className="media-body">
                <a className="media-heading" href={`/events/${ev.id}`}>
                  {ev.title}
                </a>
                <span>{formatDate(ev.start_date)}</span>
              </div>
            </li>
          ))}
          {recent.length === 0 && <li>Chưa có bài gần đây.</li>}
        </ul>
      </div>
    </div>
  );
}
