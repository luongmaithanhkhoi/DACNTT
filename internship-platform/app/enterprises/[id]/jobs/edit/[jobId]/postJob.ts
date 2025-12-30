'use client'


import { useState, useEffect, useRef } from "react";
import { Location, JobCategory, PostJobFormData, MessageState } from "./types";

const ENTERPRISE_ID = "abb1f9c4-9887-4e5c-80ef-225899fc4361"; // Có thể thay bằng useParams sau

export function usePostJobLogic() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<MessageState | null>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [categories, setCategories] = useState<JobCategory[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const formRef = useRef<HTMLFormElement>(null);

  // Fetch Location + JobCategory
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [locRes, catRes] = await Promise.all([
          fetch('/api/locations', { cache: 'no-store' }),
          fetch('/api/job-categories', { cache: 'no-store' }),
        ]);

        const locJson = await locRes.json();
        const catJson = await catRes.json();

        if (locJson.success) setLocations(locJson.data || []);
        if (catJson.success) setCategories(catJson.data || []);
      } catch (err) {
        console.error("Lỗi tải dữ liệu form:", err);
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

    const data: PostJobFormData = {
      title: formData.get("title")?.toString().trim() || "",
      description: formData.get("description")?.toString().trim() || "",
      category_id: formData.get("category_id")?.toString() || null,
      job_type: formData.get("job_type")?.toString() || null,
      work_mode: formData.get("work_mode")?.toString() || null,
      location_id: formData.get("location_id")?.toString() || null,
      internship_period: formData.get("internship_period")?.toString() || null,
      require_gpa_min: formData.get("require_gpa_min")
        ? parseFloat(formData.get("require_gpa_min") as string)
        : null,
      application_deadline: formData.get("application_deadline")?.toString() || null,
    };

    // Validate cơ bản
    if (!data.title || !data.category_id || !data.job_type || !data.location_id) {
      setMessage({ type: "error", text: "Vui lòng điền đầy đủ các trường bắt buộc!" });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `${window.location.origin}/api/enterprises/${ENTERPRISE_ID}/jobs`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
          cache: "no-store",
          next: { revalidate: 0 },
        }
      );

      const result = await res.json();

      if (res.ok) {
        setMessage({ type: "success", text: "Đăng tin tuyển dụng thành công!" });
        formRef.current?.reset();
      } else {
        setMessage({ type: "error", text: result.error || "Đã có lỗi xảy ra" });
      }
    } catch (err) {
      console.error("Lỗi kết nối:", err);
      setMessage({ type: "error", text: "Không kết nối được server. Vui lòng thử lại!" });
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
  };
}