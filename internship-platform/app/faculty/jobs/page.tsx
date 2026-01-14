"use client";

import { useEffect, useState } from "react";
import { useEnterpriseJobs } from "./useFacultyJobs";
import Link from "next/link";
interface Event {
  id: string;
  title: string;
  status: "PENDING" | "APPROVED" | "CLOSED" | "REJECTED";
  category: { id: string; name: string } | null;
  start_date: string;
  end_date: string;
  location: string;
  event_type: string;
}
const statusStyle = (status: "APPROVED" | "REJECTED" | "PENDING" | "CLOSED") =>
  status === "APPROVED"
    ? "bg-green-100 text-green-700"
    : status === "REJECTED"
      ? "bg-red-100 text-red-700"
      : status === "PENDING"
        ? "bg-yellow-100 text-yellow-700"
        : status === "CLOSED"
          ? "bg-red-100 text-red-700" // Đổi màu cho "Đã đóng" thành đỏ
          : "bg-gray-100 text-gray-700"; // Màu cho trạng thái mặc định

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("vi-VN");

type FilterStatus = "all" | "APPROVED" | "REJECTED" | "PENDING" | "CLOSED";


export default function EnterpriseJobList() {
  const enterpriseId = "abb1f9c4-9887-4e5c-80ef-225899fc4361";

  const handleFilterChange = (status: FilterStatus) => {
    console.log("Changing filter status to:", status);
    setFilterStatus(status);
  };

  const handleApproveJob = async (jobId: string, jobTitle: string) => {
    if (!confirm(`Duyệt công việc "${jobTitle}"?`)) return;

    const success = await approveJob(jobId);
    if (!success) alert(processError || "Không thể duyệt công việc");
  };

  // Gọi API để duyệt công việc
  const approveJob = async (jobId: string): Promise<boolean> => {
    try {
      const baseUrl =
        typeof window !== "undefined" ? window.location.origin : "";
      const res = await fetch(
        `${baseUrl}/api/faculty/job-posts/approve/${jobId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
        }
      );

      const result = await res.json();

      if (res.ok && result.success) {
        // Cập nhật lại danh sách công việc sau khi duyệt
        await fetchJobs(pagination.currentPage, pagination.limit);
        return true;
      } else {
        setProcessError(result.error || "Không thể duyệt công việc");
        return false;
      }
    } catch (err) {
      console.error("Lỗi khi duyệt công việc:", err);
      setProcessError("Lỗi kết nối server. Vui lòng thử lại!");
      return false;
    }
  };
  const handleRejectJob = async (jobId: string, jobTitle: string) => {
    if (!confirm(`Từ chối công việc "${jobTitle}"?`)) return;

    const success = await rejectJob(jobId);
    if (!success) alert(processError || "Không thể từ chối công việc");
  };

  // Gọi API để từ chối công việc
  const rejectJob = async (jobId: string): Promise<boolean> => {
    try {
      const baseUrl =
        typeof window !== "undefined" ? window.location.origin : "";
      const res = await fetch(
        `${baseUrl}/api/faculty/job-posts/reject/${jobId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
        }
      );

      const result = await res.json();

      if (res.ok && result.success) {
        // Cập nhật lại danh sách công việc sau khi từ chối
        await fetchJobs(pagination.currentPage, pagination.limit);
        return true;
      } else {
        setProcessError(result.error || "Không thể từ chối công việc");
        return false;
      }
    } catch (err) {
      console.error("Lỗi khi từ chối công việc:", err);
      setProcessError("Lỗi kết nối server. Vui lòng thử lại!");
      return false;
    }
  };

  const handleCloseEvent = async (eventId: string) => {
    if (!confirm("Bạn có chắc chắn muốn đóng sự kiện này?")) return;

    const success = await closeEvent(eventId);
    if (!success) alert("Không thể đóng sự kiện");
  };

  const closeEvent = async (eventId: string): Promise<boolean> => {
    try {
      const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
      const res = await fetch(`${baseUrl}/api/events/${eventId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });

      const result = await res.json();

      if (res.ok && result.success) {
        await fetchEvents(pagination.currentPage, pagination.limit); // Tải lại các sự kiện sau khi đóng
        return true;
      } else {
        setProcessError(result.error || "Không thể đóng sự kiện");
        return false;
      }
    } catch (err) {
      console.error("Lỗi khi đóng sự kiện:", err);
      setProcessError("Lỗi kết nối server. Vui lòng thử lại!");
      return false;
    }
  };

  const {
    jobs,
    pagination,
    loading,
    error,
    fetchJobs,
    deleteJob,
    deletingId,
    deleteError,
    reopenJob,
    processingId,
  } = useEnterpriseJobs(enterpriseId);

  const [processError, setProcessError] = useState<string | null>(null);

  const { currentPage, totalPages } = pagination;

  /* ================= FILTER ================= */
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [events, setEvents] = useState<Event[]>([]);


  const fetchEvents = async () => {
    try {
      const res = await fetch("/api/faculty/event");  // Gọi API để lấy tất cả sự kiện
      const data = await res.json();
      if (data && data.items) {
        setEvents(data.items); // Cập nhật state với dữ liệu sự kiện
      } else {
        setError("Không có sự kiện nào");
      }
    } catch (err) {
      setError("Lỗi khi tải dữ liệu sự kiện");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();  // Gọi hàm fetch sự kiện khi component mount
  }, []); // Giả sử bạn gọi API khi component mount

  const filteredJobs = jobs.filter((job) => {
    if (filterStatus === "APPROVED")
      return job.is_open && job.status === "APPROVED";
    if (filterStatus === "REJECTED") return job.status === "REJECTED"; // Lọc trạng thái "Đã từ chối"
    if (filterStatus === "PENDING") return job.status === "PENDING";
    if (filterStatus === "CLOSED")
      return job.status !== "PENDING" && !job.is_open;
    return true;
  });

  // Lọc các sự kiện theo trạng thái
  const filteredEvents = events.filter((event) => {
    if (filterStatus === "PENDING") return event.status === "PENDING";
    if (filterStatus === "APPROVED") return event.status === "APPROVED";
    if (filterStatus === "REJECTED") return event.status === "REJECTED";
    if (filterStatus === "CLOSED") return event.status === "CLOSED";
    return true;  // Nếu là "all", không lọc gì cả
  });
  console.log('Filtered Events:', filteredEvents);
  /* ================= ACTION ================= */
  const handleDelete = async (jobId: string, jobTitle: string) => {
    if (!confirm(`ĐÓNG công việc "${jobTitle}"?`)) return;
    const success = await deleteJob(jobId);
    if (!success) alert(deleteError || "Không thể đóng công việc");
  };

  const handleReopenJob = async (jobId: string, jobTitle: string) => {
    if (!confirm(`MỞ LẠI công việc "${jobTitle}"?`)) return;
    const success = await reopenJob(jobId);
    if (!success) alert(processError || "Không thể mở lại");
  };

  const handlePageChange = (page: number) => {
    fetchJobs(page, pagination.limit);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* <div className="inner-heading">
        <div className="container">
          <h3>Danh sách công việc</h3>
        </div>
      </div> */}

      <div className="bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <br />

          {/* FILTER BAR */}
          <div className="flex gap-4 mb-6 fs-4">
            <button
              onClick={() => setFilterStatus("all")}
              className={`px-5 py-2 rounded text-lg ${filterStatus === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-white border border-gray-300 hover:bg-gray-100"
                }`}
            >
              Tất cả
            </button>

            <button
              onClick={() => setFilterStatus("APPROVED")}
              className={`px-5 py-2 rounded text-lg ${filterStatus === "APPROVED"
                  ? "bg-green-600 text-white"
                  : "bg-white border border-gray-300 hover:bg-gray-100"
                }`}
            >
              Đang mở
            </button>
            <button
              onClick={() => setFilterStatus("CLOSED")}
              className={`px-5 py-2 rounded text-lg ${filterStatus === "CLOSED"
                  ? "bg-gray-600 text-white"
                  : "bg-white border border-gray-300 hover:bg-gray-100"
                }`}
            >
              Đã đóng
            </button>
            <button
              onClick={() => setFilterStatus("PENDING")}
              className={`px-5 py-2 rounded text-lg ${filterStatus === "PENDING"
                  ? "bg-yellow-600 text-white"
                  : "bg-white border border-gray-300 hover:bg-gray-100"
                }`}
            >
              Chờ duyệt
            </button>
            <button
              onClick={() => setFilterStatus("REJECTED")}
              className={`px-5 py-2 rounded text-lg ${filterStatus === "REJECTED"
                  ? "bg-red-600 text-white"
                  : "bg-white border border-gray-300 hover:bg-gray-100"
                }`}
            >
              Đã từ chối
            </button>
          </div>
          <br />

          {loading && (
            <div className="text-center text-gray-500 py-10">Đang tải...</div>
          )}

          {error && (
            <div className="text-center text-red-600 py-10">Lỗi: {error}</div>
          )}

          {!loading && !error && (
            <>
              {/* GRID CARD (GIỮ NGUYÊN CARD) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredJobs.length === 0 && (
                  <div className="col-span-full text-center text-gray-500">
                    Không có công việc phù hợp
                  </div>
                )}

                {filteredJobs.map((job) => (
                  <div
                    key={job.id}
                    className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition"
                  >
                    {/* ===== CARD ===== */}
                    <h3 className="text-blue-600 font-semibold text-base mb-1 line-clamp-2">
                      {job.title}
                    </h3>

                    <p className="text-base text-gray-500 mb-3">
                      {job.category?.name || "Chưa phân loại"}
                    </p>

                    <div className="text-lg text-gray-600 space-y-1 mb-4 fs-5">
                      <div>📍 {job.location?.name || "Toàn quốc"}</div>
                      <div>🕒 Fulltime</div>
                      <div>📅 {formatDate(job.created_at)}</div>
                    </div>

                    <span className="fs-5">Trạng thái: </span>
                    <span
                      className={`inline-block px-3 fs-5 py-1 text-base rounded-full font-semibold mb-3 ${statusStyle(
                        (job.status === "APPROVED" && !job.is_open
                          ? "CLOSED"
                          : job.status) as "APPROVED" | "REJECTED" | "PENDING" | "CLOSED"
                      )}`}
                    >
                      {
                        job.status === "APPROVED"
                          ? job.is_open
                            ? "Đang mở" // Công việc đã duyệt và đang mở
                            : "Đã đóng" // Công việc đã duyệt nhưng đã đóng
                          : job.status === "REJECTED"
                            ? "Bị từ chối" // Công việc bị từ chối
                            : "Chờ duyệt" // Công việc đang chờ duyệt
                      }
                    </span>
                    <div className="mt-auto pt-4 flex justify-center">
                      {job.status === "PENDING" && (
                        <button
                          onClick={() => handleApproveJob(job.id, job.title)}
                          disabled={processingId === job.id}
                          className="px-4 py-2 text-lg rounded bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-60"
                        >
                          {processingId === job.id
                            ? "Đang duyệt..."
                            : "Duyệt bài"}
                        </button>
                      )}

                      {job.status === "PENDING" && (
                        <button
                          onClick={() => handleRejectJob(job.id, job.title)}
                          disabled={processingId === job.id}
                          className="px-4 py-2 text-lg rounded bg-red-500 text-white hover:bg-red-600 disabled:opacity-60"
                        >
                          {processingId === job.id
                            ? "Đang từ chối..."
                            : "Từ chối"}
                        </button>
                      )}

                    </div>


                    <div className="mt-auto pt-4 flex justify-center">
                      <Link
                        href={`/enterprises/${enterpriseId}/jobs/${job.id}`}
                        className="fs-5 px-4 py-2 text-lg rounded bg-blue text-black hover:bg-blue inline-block"
                      >
                        Xem
                      </Link>

                      <Link
                        href={`/enterprises/${enterpriseId}/jobs/edit/${job.id}`}
                        className="fs-5 px-4 py-2 text-lg rounded bg-yellow-500 text-black hover:bg-yellow-600"
                      >
                        Sửa
                      </Link>

                      {job.is_open ? (
                        <button
                          onClick={() => handleDelete(job.id, job.title)}
                          disabled={deletingId === job.id}
                          className=" fs-5 px-4 py-2 text-lg rounded bg-red-500 text-white hover:bg-red-600 disabled:opacity-60"
                        >
                          {deletingId === job.id ? "Đang đóng..." : "Đóng"}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleReopenJob(job.id, job.title)}
                          disabled={processingId === job.id}
                          className="px-4 py-2 text-lg rounded bg-green-500 text-white hover:bg-green-600 disabled:opacity-60"
                        >
                          {processingId === job.id ? "Đang mở..." : "Mở lại"}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <br />

              {/* PAGINATION */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-3 mt-10">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="fs-4 font-semibold r px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                  >
                    Trước
                  </button>

                  <span className="font-semibold  px-4 py-2 fs-4">
                    Trang <b>{currentPage}</b> / {totalPages}
                  </span>

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="font-semibold fs-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                  >
                    Sau
                  </button>
                </div>
              )}
              <br></br>
            </>
          )}
        </div>


      </div>

      <div className="inner-heading">
        <div className="container">
          <h3>Danh sách sự kiện</h3>
        </div>
      </div>

      <div className="bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <br />

          {/* FILTER BAR */}
          <div className="flex gap-4 mb-6 fs-4">
            <button
              onClick={() => setFilterStatus("all")}
              className={`px-5 py-2 rounded text-lg ${filterStatus === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-white border border-gray-300 hover:bg-gray-100"
                }`}
            >
              Tất cả
            </button>

            <button
              onClick={() => setFilterStatus("PENDING")}
              className={`px-5 py-2 rounded text-lg ${filterStatus === "PENDING"
                  ? "bg-yellow-600 text-white"
                  : "bg-white border border-gray-300 hover:bg-gray-100"
                }`}
            >
              Chờ duyệt
            </button>

            <button
              onClick={() => setFilterStatus("APPROVED")}
              className={`px-5 py-2 rounded text-lg ${filterStatus === "APPROVED"
                  ? "bg-green-600 text-white"
                  : "bg-white border border-gray-300 hover:bg-gray-100"
                }`}
            >
              Đã duyệt
            </button>

            <button
              onClick={() => setFilterStatus("CLOSED")}
              className={`px-5 py-2 rounded text-lg ${filterStatus === "CLOSED"
                  ? "bg-gray-600 text-white"
                  : "bg-white border border-gray-300 hover:bg-gray-100"
                }`}
            >
              Đã đóng
            </button>

            <button
              onClick={() => setFilterStatus("REJECTED")}
              className={`px-5 py-2 rounded text-lg ${filterStatus === "REJECTED"
                  ? "bg-red-600 text-white"
                  : "bg-white border border-gray-300 hover:bg-gray-100"
                }`}
            >
              Đã từ chối
            </button>
          </div>

          <br />

          {loading && (
            <div className="text-center text-gray-500 py-10">Đang tải...</div>
          )}

          {error && (
            <div className="text-center text-red-600 py-10">Lỗi: {error}</div>
          )}

          {!loading && !error && (
            <>
              {/* GRID CARD */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredEvents.length === 0 && (
                  <div className="col-span-full text-center text-gray-500">
                    Không có sự kiện phù hợp
                  </div>
                )}

                {filteredEvents.map((event: Event) => (
                  <div
                    key={event.id}
                    className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition"
                  >
                    {/* ===== CARD ===== */}
                    <h3 className="text-blue-600 font-semibold text-base mb-1 line-clamp-2">
                      {event.title}
                    </h3>

                    <p className="text-base text-gray-500 mb-3">
                      {event.category?.name || "Chưa phân loại"}
                    </p>

                    <div className="text-lg text-gray-600 space-y-1 mb-4 fs-5">
                      <div>📍 {event.location || "Toàn quốc"}</div>
                      <div>🕒 {event.event_type}</div>
                      <div>
                        📅 {formatDate(event.start_date)} - {formatDate(event.end_date)}
                      </div>
                    </div>

                    <span className="fs-5">Trạng thái: </span>
                    <span
                      className={`inline-block px-3 fs-5 py-1 text-base rounded-full font-semibold mb-3 ${statusStyle(
                        event.status
                      )}`}
                    >
                      {event.status === "APPROVED"
                        ? "Đã duyệt"
                        : event.status === "PENDING"
                          ? "Chờ duyệt"
                          : event.status === "CLOSED"
                            ? "Đã đóng"
                            : "Đã từ chối"}
                    </span>

                    <div className="mt-auto pt-4 flex justify-center">
                      <Link
                        href={`/events/${event.id}`}
                        className="fs-5 px-4 py-2 text-lg rounded bg-blue text-black hover:bg-blue inline-block"
                      >
                        Xem
                      </Link>

                      <Link
                        href={`/enterprises/${enterpriseId}/events/edit/${event.id}`}
                        className="fs-5 px-4 py-2 text-lg rounded bg-yellow-500 text-black hover:bg-yellow-600"
                      >
                        Sửa
                      </Link>

                      {event.status !== "CLOSED" && (
                        <button
                          onClick={() => handleCloseEvent(event.id)}
                          className="fs-5 px-4 py-2 text-lg rounded bg-red-500 text-white hover:bg-red-600"
                        >
                          Đóng sự kiện
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <br />

              {/* PAGINATION */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-3 mt-10">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="fs-4 font-semibold r px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                  >
                    Trước
                  </button>

                  <span className="font-semibold  px-4 py-2 fs-4">
                    Trang <b>{currentPage}</b> / {totalPages}
                  </span>

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="font-semibold fs-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                  >
                    Sau
                  </button>
                </div>
              )}
              <br />
            </>
          )}
        </div>
      </div>

    </>
  );
}
