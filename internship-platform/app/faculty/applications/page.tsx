"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Job {
  id: string;
  title: string;
}

interface Application {
  id: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  created_at: string;
  jobId: string;
  jobTitle: string;
  student: {
    id: string;
    fullName: string;
    major: string;
    gpa: number | null;
    phone: string;
    location: string;
    avatarUrl: string;
    cv_url?: string;
  };
}

export default function EnterpriseApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [allJobs, setAllJobs] = useState<Job[]>([]); 
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [statusFilter, setStatusFilter] = useState<
    "ALL" | "PENDING" | "ACCEPTED" | "REJECTED"
  >("ALL");

  const [selectedCV, setSelectedCV] = useState<string | null>(null);

  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const res = await fetch(`/api/faculty/jobs`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setAllJobs(json.data);
        }
      }
    };

    fetchJobs();
  }, []);

  // Lấy danh sách applications
  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        window.location.href = "/login";
        return;
      }

      const query = new URLSearchParams({
        page: currentPage.toString(),
      });
      if (statusFilter !== "ALL") {
        query.append("status", statusFilter);
      }

      const res = await fetch(`/api/faculty/applications?${query}`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setApplications(json.applications || []);
          setTotalPages(json.pagination.totalPages);
          setTotalItems(json.pagination.totalItems);
        }
      } else {
        alert("Lỗi khi tải hồ sơ ứng tuyển");
      }
      setLoading(false);
    };

    fetchApplications();
  }, [currentPage, statusFilter]);

  const updateStatus = async (
    appId: string,
    newStatus: "ACCEPTED" | "REJECTED"
  ) => {
    if (
      !confirm(
        `Bạn có chắc muốn ${
          newStatus === "ACCEPTED" ? "CHẤP NHẬN" : "TỪ CHỐI"
        } ứng viên này?`
      )
    ) {
      return;
    }

    setUpdatingId(appId);
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) return;

    const res = await fetch(`/api/faculty/applications/${appId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ status: newStatus }),
    });

    if (res.ok) {
      const result = await res.json();
      if (result.success) {
        setApplications((prev) =>
          prev.map((app) =>
            app.id === appId ? { ...app, status: newStatus } : app
          )
        );
        alert(result.message || "Cập nhật thành công!");
      }
    } else {
      alert("Không thể cập nhật trạng thái");
    }
    setUpdatingId(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <span className="badge bg-warning text-dark px-3 py-1">Đang chờ</span>
        );
      case "ACCEPTED":
        return <span className="badge bg-success px-3 py-1">Chấp nhận</span>;
      case "REJECTED":
        return <span className="badge bg-danger px-3 py-1">Từ chối</span>;
      default:
        return <span className="badge bg-secondary px-3 py-1">{status}</span>;
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="text-center py-20 fs-4">Đang tải hồ sơ ứng tuyển...</div>
    );
  }

  return (
    <div className="inner-content py-5">
      <div className="container">
        <h1 className="text-center mb-5 fs-2 fw-bold">
          Hồ sơ ứng tuyển ({totalItems})
        </h1>

        {/* Bộ lọc trạng thái */}
        <div className="row mb-4">
          <div className="col-md-4">
            <select
              className="form-control"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as any);
                setCurrentPage(1);
              }}
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="PENDING">Đang chờ</option>
              <option value="ACCEPTED">Đã chấp nhận</option>
              <option value="REJECTED">Đã từ chối</option>
            </select>
          </div>
        </div>

        {applications.length === 0 ? (
          <div className="text-center py-10">
            <p className="fs-4 text-gray-600">
              {statusFilter === "ALL"
                ? "Chưa có hồ sơ ứng tuyển nào."
                : `Không có hồ sơ nào ở trạng thái "${
                    statusFilter === "PENDING"
                      ? "Đang chờ"
                      : statusFilter === "ACCEPTED"
                      ? "Chấp nhận"
                      : "Từ chối"
                  }".`}
            </p>
            <Link
              href="/faculty/post-job"
              className="btn btn-danger px-6 py-3 fs-5"
            >
              Đăng tin tuyển dụng mới
            </Link>
          </div>
        ) : (
          <div className="row g-4 mb-5">
            {applications.map((app) => (
              <div key={app.id} className="col-md-6 col-lg-4">
                <div className="bg-white rounded shadow p-4 h-100 d-flex flex-column">
                  <div className="d-flex align-items-center mb-3">
                    <img
                      src={app.student.avatarUrl}
                      alt={app.student.fullName}
                      className="rounded-circle me-3"
                      style={{ width: 60, height: 60, objectFit: "cover" }}
                    />
                    <div>
                      <h5>
                        <Link
                          href={`/students/${app.student.id}`}
                          className="text-primary text-decoration-none"
                        >
                          {app.student.fullName}
                        </Link>
                      </h5>
                      <p className="text-muted mb-0">
                        {app.student.major || "Chưa cập nhật"}
                      </p>
                    </div>
                  </div>

                  <p className="mb-2">
                    <strong>Công việc:</strong> {app.jobTitle}
                  </p>
                  <p className="mb-2">
                    <strong>GPA:</strong> {app.student.gpa || "Chưa cập nhật"}
                  </p>
                  <p className="mb-2">
                    <strong>Điện thoại:</strong> {app.student.phone}
                  </p>
                  <p className="mb-3">
                    <strong>Địa điểm:</strong> {app.student.location}
                  </p>

                  <div className="mt-auto">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      {getStatusBadge(app.status)}
                      <small className="text-muted">
                        Nộp:{" "}
                        {new Date(app.created_at).toLocaleDateString("vi-VN")}
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Phân trang */}
        {totalPages > 1 && (
          <nav className="d-flex justify-content-center">
            <ul className="pagination">
              <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
              </li>
              {[...Array(totalPages)].map((_, i) => (
                <li
                  key={i + 1}
                  className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(i + 1)}
                  >
                    {i + 1}
                  </button>
                </li>
              ))}
              <li
                className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </div>
  );
}
