"use client";

import { useState, useEffect } from "react";

export interface Category {
  id: string;
  name: string;
}

export interface Location {
  id: string;
  name: string;
}

export interface JobFromAPI {
  id: string;
  title: string;
  created_at: string;
  is_open: boolean;
  job_type?: string;
  work_mode?: string;
  category: Category | null;
  location: Location | null;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  limit: number;
}

export function useEnterpriseJobs(enterpriseId: string) {
  const [jobs, setJobs] = useState<JobFromAPI[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    limit: 10,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State cho chức năng xóa
  const [deleting, setDeleting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
    const [processingId, setProcessingId] = useState<string | null>(null);
  const [processError, setProcessError] = useState<string | null>(null);
  const fetchJobs = async (page: number = 1, limit: number = 10) => {
    if (!enterpriseId) {
      setJobs([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await fetch(
        `/api/faculty/job-posts?page=${page}&limit=${limit}`,
        { cache: "no-store" }
      );

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: Không thể tải danh sách công việc`);
      }

      const result = await res.json();

      if (result.success) {
        setJobs(result.data || []);
        setPagination(
          result.pagination || {
            currentPage: page,
            totalPages: 1,
            totalItems: 0,
            limit,
          }
        );
      } else {
        throw new Error(result.error || "Lỗi từ server");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Lỗi không xác định";
      setError(msg);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  // Hàm xóa (đóng) job
  const deleteJob = async (jobId: string): Promise<boolean> => {
    if (!enterpriseId || !jobId) return false;

    setDeleting(true);
    setDeletingId(jobId);
    setDeleteError(null);

    try {
      const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
      const res = await fetch(`${baseUrl}/api/enterprises/${enterpriseId}/jobs/${jobId}`, {
        method: "DELETE",
        cache: "no-store",
      });

      const result = await res.json();

      if (res.ok && result.success) {
        // Refresh lại danh sách (giữ nguyên trang hiện tại)
        await fetchJobs(pagination.currentPage, pagination.limit);
        return true;
      } else {
        setDeleteError(result.error || "Không thể đóng công việc");
        return false;
      }
    } catch (err) {
      console.error("Lỗi khi đóng job:", err);
      setDeleteError("Lỗi kết nối server. Vui lòng thử lại!");
      return false;
    } finally {
      setDeleting(false);
      setDeletingId(null);
    }
  };

  const reopenJob = async (jobId: string): Promise<boolean> => {
    if (!enterpriseId || !jobId) return false;

    setProcessingId(jobId);
    setProcessError(null);

    try {
      const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
      const res = await fetch(`${baseUrl}/api/enterprises/${enterpriseId}/jobs/${jobId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_open: true }), // Chỉ cần gửi trường này
        cache: "no-store",
      });

      const result = await res.json();

      if (res.ok && result.success) {
        // Refresh danh sách
        await fetchJobs(pagination.currentPage, pagination.limit);
        return true;
      } else {
        setProcessError(result.error || "Không thể mở lại công việc");
        return false;
      }
    } catch (err) {
      console.error("Lỗi khi mở lại job:", err);
      setProcessError("Lỗi kết nối server. Vui lòng thử lại!");
      return false;
    } finally {
      setProcessingId(null);
    }
  };

  // Load lần đầu
  useEffect(() => {
    fetchJobs(1, 10);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enterpriseId]);

  return {
    jobs,
    pagination,
    loading,
    error,
    fetchJobs,        // Để đổi trang, refresh thủ công

    // Chức năng xóa
    deleteJob,
    deleting,
    deletingId,
    deleteError,

    // Mở lại job
    reopenJob,
    processingId,
    processError,
  };
}