
// "use client";

// import { useEnterpriseJobs } from "./useEnterpriseJobs";
// import Link from "next/link";

// const statusStyle = (isOpen: boolean) =>
//   isOpen ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700";

// const formatDate = (dateString: string) =>
//   new Date(dateString).toLocaleDateString("vi-VN");

// export default function EnterpriseJobList() {
//   const enterpriseId = "abb1f9c4-9887-4e5c-80ef-225899fc4361";

//   const {
//     jobs,
//     pagination,
//     loading,
//     error,
//     fetchJobs,
//     deleteJob,
//     deletingId,
//     deleteError,
//     reopenJob,
//     processError,
//     processingId,
//   } = useEnterpriseJobs(enterpriseId);

//   const { currentPage, totalPages } = pagination;

//   const handleDelete = async (jobId: string, jobTitle: string) => {
//     if (!confirm(`ĐÓNG công việc "${jobTitle}"?`)) return;
//     const success = await deleteJob(jobId);
//     if (!success) alert(deleteError || "Không thể đóng công việc");
//   };

//   const handleReopenJob = async (jobId: string, jobTitle: string) => {
//     if (!confirm(`MỞ LẠI công việc "${jobTitle}"?`)) return;
//     const success = await reopenJob(jobId);
//     if (!success) alert(processError || "Không thể mở lại");
//   };

//   const handlePageChange = (page: number) => {
//     fetchJobs(page, pagination.limit);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   return (
//     <>
//       <div className="inner-heading">
//         <div className="container">
//           <h3>Danh sách công việc</h3>
//         </div>
//       </div>

//       <div className="bg-gray-50 py-8">
//         <div className="container mx-auto px-4">
//         <br></br>

//           {loading && (
//             <div className="text-center text-gray-500 py-10">Đang tải...</div>
//           )}

//           {error && (
//             <div className="text-center text-red-600 py-10">
//               Lỗi: {error}
//             </div>
//           )}

//           {!loading && !error && (
//             <>
//               {/* GRID CARD */}
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//                 {jobs.length === 0 && (
//                   <div className="col-span-full text-center text-gray-500">
//                     Chưa có công việc nào
//                   </div>
//                 )}

//                 {jobs.map((job) => (
//                   <div
//                     key={job.id}
//                     className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition"
//                   >
//                     {/* Title */}
//                     <h3 className="text-blue-600 font-semibold text-base mb-1 line-clamp-2">
//                       {job.title}
//                     </h3>

//                     <p className="text-base text-gray-500 mb-3">
//                       {job.category?.name || "Chưa phân loại"}
//                     </p>

//                     {/* Info */}
//                     <div className="text-lg text-gray-600 space-y-1 mb-4">
//                       <div>📍 {job.location?.name || "Toàn quốc"}</div>
//                       <div>🕒 Fulltime</div>
//                       <div>📅 {formatDate(job.created_at)}</div>
//                     </div>

//                     {/* Status */}
//                     <span>Trạng thái: </span>
//                     <span
//                       className={`inline-block px-3 py-1 text-base rounded-full font-semibold mb-3 ${statusStyle(
//                         job.is_open
//                       )}`}
//                     >
//                       {job.is_open ? "Đang mở" : "Đã đóng"}
//                     </span>

//                     {/* Actions */}
//                     <div className="mt-auto pt-4 flex justify-center ">
//                      <Link
//                         href={`/enterprises/${enterpriseId}/jobs/${job.id}`}
//                         className="px-4 py-2  text-lg rounded bg-blue text-black hover:bg-blue inline-block"
//                       >
//                         Xem
//                       </Link>

//                       <Link
//                         href={`/enterprises/${enterpriseId}/jobs/edit/${job.id}`}
//                         className="px-4 py-2 text-lg rounded bg-yellow-500 text-black hover:bg-yellow-600"
//                       >
//                         Sửa
//                       </Link>

//                       {job.is_open ? (
//                         <button
//                           onClick={() => handleDelete(job.id, job.title)}
//                           disabled={deletingId === job.id}
//                           className="px-4 py-2 text-lg rounded bg-red-500 text-white hover:bg-red-600 disabled:opacity-60"
//                         >
//                           {deletingId === job.id ? "Đang đóng..." : "Đóng"}
//                         </button>
//                       ) : (
//                         <button
//                           onClick={() => handleReopenJob(job.id, job.title)}
//                           disabled={processingId === job.id}
//                           className="px-4 py-2 text-lg rounded bg-green-500 text-white hover:bg-green-600 disabled:opacity-60"
//                         >
//                           {processingId === job.id ? "Đang mở..." : "Mở lại"}
//                         </button>
//                       )}
//                     </div>
//                   </div>
                  
//                 ))}
//               </div>
//               <br></br>

//               {/* PAGINATION */}
//               {totalPages > 1 && (
//                 <div className="flex justify-center gap-3 mt-10">
//                   <button
//                     disabled={currentPage === 1}
//                     onClick={() => handlePageChange(currentPage - 1)}
//                     className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
//                   >
//                     Previous
//                   </button>

//                   <span className="px-4 py-2">
//                     Trang <b>{currentPage}</b> / {totalPages}
//                   </span>

//                   <button
//                     disabled={currentPage === totalPages}
//                     onClick={() => handlePageChange(currentPage + 1)}
//                     className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
//                   >
//                     Next
//                   </button>
//                 </div>
//               )}
//             </>
//           )}
//         </div>
//         <br></br>
//       </div>
//     </>
//   );
// }

"use client";

import { useState } from "react";
import { useEnterpriseJobs } from "./useEnterpriseJobs";
import Link from "next/link";

const statusStyle = (isOpen: boolean) =>
  isOpen ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700";

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("vi-VN");

type FilterStatus = "all" | "open" | "closed";

export default function EnterpriseJobList() {
  const enterpriseId = "abb1f9c4-9887-4e5c-80ef-225899fc4361";

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
    processError,
    processingId,
  } = useEnterpriseJobs(enterpriseId);

  const { currentPage, totalPages } = pagination;

  /* ================= FILTER ================= */
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");

  const filteredJobs = jobs.filter((job) => {
    if (filterStatus === "open") return job.is_open;
    if (filterStatus === "closed") return !job.is_open;
    return true;
  });

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
      <div className="inner-heading">
        <div className="container">
          <h3>Danh sách công việc</h3>
        </div>
      </div>

      <div className="bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <br />

          {/* FILTER BAR */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setFilterStatus("all")}
              className={`px-5 py-2 rounded text-lg ${
                filterStatus === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-white border border-gray-300 hover:bg-gray-100"
              }`}
            >
              Tất cả
            </button>

            <button
              onClick={() => setFilterStatus("open")}
              className={`px-5 py-2 rounded text-lg ${
                filterStatus === "open"
                  ? "bg-green-600 text-white"
                  : "bg-white border border-gray-300 hover:bg-gray-100"
              }`}
            >
              Đang mở
            </button>

            <button
              onClick={() => setFilterStatus("closed")}
              className={`px-5 py-2 rounded text-lg ${
                filterStatus === "closed"
                  ? "bg-red-600 text-white"
                  : "bg-white border border-gray-300 hover:bg-gray-100"
              }`}
            >
              Đã đóng
            </button>
          </div>
          <br></br>

          {loading && (
            <div className="text-center text-gray-500 py-10">Đang tải...</div>
          )}

          {error && (
            <div className="text-center text-red-600 py-10">
              Lỗi: {error}
            </div>
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
                    {/* ===== CARD GIỮ NGUYÊN ===== */}
                    <h3 className="text-blue-600 font-semibold text-base mb-1 line-clamp-2">
                      {job.title}
                    </h3>

                    <p className="text-base text-gray-500 mb-3">
                      {job.category?.name || "Chưa phân loại"}
                    </p>

                    <div className="text-lg text-gray-600 space-y-1 mb-4">
                      <div>📍 {job.location?.name || "Toàn quốc"}</div>
                      <div>🕒 Fulltime</div>
                      <div>📅 {formatDate(job.created_at)}</div>
                    </div>

                    <span>Trạng thái: </span>
                    <span
                      className={`inline-block px-3 py-1 text-base rounded-full font-semibold mb-3 ${statusStyle(
                        job.is_open
                      )}`}
                    >
                      {job.is_open ? "Đang mở" : "Đã đóng"}
                    </span>

                    <div className="mt-auto pt-4 flex justify-center">
                      <Link
                        href={`/enterprises/${enterpriseId}/jobs/${job.id}`}
                        className="px-4 py-2 text-lg rounded bg-blue text-black hover:bg-blue inline-block"
                      >
                        Xem
                      </Link>

                      <Link
                        href={`/enterprises/${enterpriseId}/jobs/edit/${job.id}`}
                        className="px-4 py-2 text-lg rounded bg-yellow-500 text-black hover:bg-yellow-600"
                      >
                        Sửa
                      </Link>

                      {job.is_open ? (
                        <button
                          onClick={() => handleDelete(job.id, job.title)}
                          disabled={deletingId === job.id}
                          className="px-4 py-2 text-lg rounded bg-red-500 text-white hover:bg-red-600 disabled:opacity-60"
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
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                  >
                    Previous
                  </button>

                  <span className="px-4 py-2">
                    Trang <b>{currentPage}</b> / {totalPages}
                  </span>

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
               
              )}
               <br></br>
            </>
          )}
        </div>
      </div>
    </>
  );
}
