"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";

interface Location {
  id: string;
  name: string;
}

interface JobCategory {
  id: string;
  name: string;
}

interface JobData {
  id?: string;
  title: string;
  description: string | null;
  category_id: string | null;
  job_type: string | null;
  work_mode: string | null;
  location_id: string | null;
  internship_period: string | null;
  require_gpa_min: number | null;
  application_deadline: string | null;
}

interface UsePostJobLogicProps {
  initialData?: JobData | null;
  enterpriseId: string;
  isEdit?: boolean;
  jobId?: string;
}

export function usePostJobLogic({
  initialData = null,
  enterpriseId,
  isEdit = false,
  jobId = "",
}: UsePostJobLogicProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [locations, setLocations] = useState<Location[]>([]);
  const [categories, setCategories] = useState<JobCategory[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Controlled state
  const [jobType, setJobType] = useState<string>(initialData?.job_type || "");
  const [categoryId, setCategoryId] = useState<string>(initialData?.category_id || "");
  const [workMode, setWorkMode] = useState<string>(initialData?.work_mode || "");
  const [locationId, setLocationId] = useState<string>(initialData?.location_id || "");

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [locRes, catRes] = await Promise.all([
          fetch('/api/locations', { cache: 'no-store' }),
          fetch('/api/job-categories', { cache: 'no-store' }),
        ]);

        const locJson = await locRes.json();
        const catJson = await catRes.json();

        setLocations(Array.isArray(locJson) ? locJson : []);
        setCategories(Array.isArray(catJson) ? catJson : []);

        console.log("Locations:", locJson);
        console.log("Categories:", catJson);
      } catch (err) {
        console.error("Lỗi fetch:", err);
        setMessage({ type: "error", text: "Không thể tải danh sách" });
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);

    const data = {
      title: formData.get("title")?.toString().trim(),
      description: formData.get("description")?.toString().trim() || null,
      category_id: categoryId || null,
      job_type: jobType || null,
      work_mode: workMode || null,
      location_id: locationId || null,
      internship_period: formData.get("internship_period")?.toString() || null,
      require_gpa_min: formData.get("require_gpa_min")
        ? parseFloat(formData.get("require_gpa_min") as string)
        : null,
      application_deadline: formData.get("application_deadline")?.toString() || null,
    };

    if (!data.title || !data.category_id || !data.job_type || !data.location_id) {
      setMessage({ type: "error", text: "Vui lòng chọn đầy đủ các trường bắt buộc!" });
      setLoading(false);
      return;
    }

    try {
      const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
      const url = isEdit
        ? `${baseUrl}/api/enterprises/${enterpriseId}/jobs/${jobId}`
        : `${baseUrl}/api/enterprises/${enterpriseId}/jobs`;

      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        cache: "no-store",
      });

      const result = await res.json();

      if (res.ok) {
        setMessage({
          type: "success",
          text: isEdit ? "Cập nhật thành công!" : "Đăng tin thành công!",
        });

        if (!isEdit) {
          formRef.current?.reset();
          setJobType("");
          setCategoryId("");
          setWorkMode("");
          setLocationId("");
        }

        setTimeout(() => {
          router.push(`/enterprises/${enterpriseId}/jobs`);
          router.refresh();
        }, 2000);
      } else {
        setMessage({ type: "error", text: result.error || "Lỗi khi lưu" });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Lỗi kết nối server" });
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    message,
    locations,
    categories,
    loadingData,
    formRef,
    handleSubmit,
    jobType,
    setJobType,
    categoryId,
    setCategoryId,
    workMode,
    setWorkMode,
    locationId,
    setLocationId,
  };
}