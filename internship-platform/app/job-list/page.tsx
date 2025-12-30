"use client";

import { useEnterpriseJobs } from "./useEnterpriseJobs";

const statusStyle = (isOpen: boolean) =>
  isOpen ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700";

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("vi-VN");

export default function EnterpriseJobList() {
  const enterpriseId = "abb1f9c4-9887-4e5c-80ef-225899fc4361";
  const { jobs, pagination, loading, error, fetchJobs } = useEnterpriseJobs(enterpriseId);

  const { currentPage, totalPages } = pagination;

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchJobs(newPage, pagination.limit);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <>
      <div className="inner-heading">
        <div className="container">
          <h3>Danh sách công việc</h3>
        </div>
      </div>

      <div className="inner-content loginWrp">
        <div className="container">
          <div className="row justify-content-center">
           
              <div className="login">
                <div className="contctxt">Thông tin danh sách công việc</div>

                {loading && (
                  <div className="p-8 text-center text-gray-500">
                    Đang tải...
                  </div>
                )}

                {error && (
                  <div className="p-8 text-center text-red-600">
                    Lỗi: {error}
                  </div>
                )}

                {!loading && !error && (
                  <>
                    <div className="overflow-x-auto mb-6">
                      <table className="w-full text-sm">
                        {/* ... thead như cũ ... */}
                        <thead className="bg-gray-50 text-gray-700">
                        <tr>
                            <th className="p-4 text-left">Tên công việc</th>
                            <th className="p-4 text-left">Danh mục</th>
                            <th className="p-4 text-left">Địa điểm</th>
                            <th className="p-4 text-left">Ngày đăng</th>
                            <th className="p-4 text-left">Trạng thái</th>
                            <th className="p-4 text-center">Hành động</th>
                            </tr>
                      </thead>
                        <tbody>
                          {jobs.length === 0 ? (
                            <tr>
                              <td colSpan={6} className="p-8 text-center text-gray-500">
                                Chưa có công việc nào được đăng
                              </td>
                            </tr>
                          ) : (
                            jobs.map((job) => (
                              <tr key={job.id} className="border-t hover:bg-gray-50">
                                <td className="p-4 font-medium text-gray-800">{job.title}</td>
                                <td className="p-4">{job.category?.name || "Chưa phân loại"}</td>
                                <td className="p-4">{job.location?.name || "Toàn quốc"}</td>
                                <td className="p-4">{formatDate(job.created_at)}</td>
                                <td className="p-4">
                                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyle(job.is_open)}`}>
                                    {job.is_open ? "Đang mở" : "Đã đóng"}
                                  </span>
                                </td>
                                <td className="p-4 text-center space-x-2">
                                  {/* <button className="px-3 py-1 text-sm rounded bg-blue-500 text-white hover:bg-blue-600">
                                    Xem
                                  </button> */}
                                  <a
                                    href={`/enterprises/${enterpriseId}/jobs/${job.id}`}
                                    className="px-3 py-1 text-sm rounded bg-blue-500 text-white hover:bg-blue-600 transition inline-block"
                                  >
                                    Xem
                                  </a>
                                  <button className="px-3 py-1 text-sm rounded bg-yellow-500 text-white hover:bg-yellow-600">
                                    Sửa
                                  </button>
                                  <button
                                    className={`px-3 py-1 text-sm rounded text-white ${
                                      job.is_open
                                        ? "bg-red-500 hover:bg-red-600"
                                        : "bg-gray-400 cursor-not-allowed"
                                    }`}
                                    disabled={!job.is_open}
                                  >
                                    Đóng
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex justify-center items-center gap-2 mt-6">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1 || loading}
                          className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Previous
                        </button>

                        <span className="px-4 py-2">
                          Trang <strong>{currentPage}</strong> / {totalPages}
                        </span>

                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages || loading}
                          className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
    </>
  );
}