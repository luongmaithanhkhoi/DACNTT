// hooks/useEnterpriseJobs.ts

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

  const fetchJobs = async (page: number = 1, limit: number = 10) => {
    if (!enterpriseId) return;

    try {
      setLoading(true);
      setError(null);

      const res = await fetch(
        `/api/enterprises/${enterpriseId}/jobs?page=${page}&limit=${limit}`,
        { cache: "no-store" }
      );

      if (!res.ok) throw new Error("Không thể tải danh sách công việc");

      const result = await res.json();

      if (result.success) {
        setJobs(result.data || []);
        setPagination(result.pagination || {
          currentPage: page,
          totalPages: 1,
          totalItems: 0,
          limit,
        });
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi không xác định");
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs(1, 10);
  }, [enterpriseId]);

  return { jobs, pagination, loading, error, fetchJobs };
}