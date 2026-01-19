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

interface Skill {
  id: string;
  name: string;
}

interface SelectedSkill {
  skill_id: string;
  required_level: number;
}

interface JobData {
  id?: string;
  title: string;
  description?: string | null;
  category_id?: string | null;
  job_type?: string | null;
  work_mode?: string | null;
  location_id?: string | null;
  internship_period?: string | null;
  require_gpa_min?: number | null;
  application_deadline?: string | null;
  skills?: SelectedSkill[]; // Mảng kỹ năng khi edit
}

interface UsePostJobLogicProps {
  initialData?: JobData | null;
  enterpriseId: string;
  isEdit?: boolean;
  jobId?: string;
  isAdmin?: boolean;
}

export function usePostJobLogic({
  initialData = null,
  enterpriseId,
  isEdit = false,
  jobId = "",
  isAdmin = false,
}: UsePostJobLogicProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [locations, setLocations] = useState<Location[]>([]);
  const [categories, setCategories] = useState<JobCategory[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Controlled state - khởi tạo từ initialData khi edit
  const [jobType, setJobType] = useState<string>(initialData?.job_type || "");
  const [categoryId, setCategoryId] = useState<string>(
    initialData?.category_id || ""
  );
  const [workMode, setWorkMode] = useState<string>(
    initialData?.work_mode || ""
  );
  const [locationId, setLocationId] = useState<string>(
    initialData?.location_id || ""
  );

  // Khởi tạo selectedSkills từ initialData.skills khi edit
  const [selectedSkills, setSelectedSkills] = useState<SelectedSkill[]>(
    initialData?.skills || []
  );

  const formRef = useRef<HTMLFormElement>(null);

  // Load locations, categories, skills
  useEffect(() => {
    const fetchData = async () => {
      setLoadingData(true);
      try {
        const [locRes, catRes, skillRes] = await Promise.all([
          fetch("/api/locations", { cache: "no-store" }),
          fetch("/api/job-categories", { cache: "no-store" }),
          fetch("/api/skills", { cache: "no-store" }),
        ]);

        if (!locRes.ok || !catRes.ok || !skillRes.ok) {
          throw new Error("Không thể tải dữ liệu");
        }

        const locJson = await locRes.json();
        const catJson = await catRes.json();
        const skillJson = await skillRes.json();

        setLocations(Array.isArray(locJson) ? locJson : locJson.data || []);
        setCategories(Array.isArray(catJson) ? catJson : catJson.data || []);
        setSkills(Array.isArray(skillJson) ? skillJson : skillJson.data || []);
      } catch (err) {
        console.error("Lỗi tải dữ liệu form:", err);
        setMessage({ type: "error", text: "Không thể tải dữ liệu cần thiết" });
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, []);

  // Cập nhật state khi initialData thay đổi (khi edit)
  useEffect(() => {
    if (initialData) {
      setJobType(initialData.job_type || "");
      setCategoryId(initialData.category_id || "");
      setWorkMode(initialData.work_mode || "");
      setLocationId(initialData.location_id || "");
      setSelectedSkills(initialData.skills || []);
    }
  }, [initialData]);

  // Xử lý thay đổi kỹ năng
  const handleSkillChange = (skillId: string, level: number) => {
    setSelectedSkills((prev) => {
      const existingIndex = prev.findIndex((s) => s.skill_id === skillId);

      if (level === 0) {
        // Xóa nếu level = 0
        if (existingIndex !== -1) {
          return prev.filter((_, index) => index !== existingIndex);
        }
        return prev;
      }

      if (existingIndex !== -1) {
        // Cập nhật level
        const updated = [...prev];
        updated[existingIndex] = { skill_id: skillId, required_level: level };
        return updated;
      }

      // Thêm mới
      return [...prev, { skill_id: skillId, required_level: level }];
    });
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const description = formData.get("description")?.toString().trim();

    const data = {
      title: formData.get("title")?.toString().trim(),
      description: description || null,
      category_id: categoryId || null,
      job_type: jobType || null,
      work_mode: workMode || null,
      location_id: locationId || null,
      internship_period:
        formData.get("internship_period")?.toString().trim() || null,
      require_gpa_min: formData.get("require_gpa_min")
        ? parseFloat(formData.get("require_gpa_min") as string)
        : null,
      application_deadline:
        formData.get("application_deadline")?.toString() || null,
      skills: selectedSkills.filter((s) => s.required_level > 0), // Chỉ gửi level > 0
    };

    // Validate bắt buộc
    if (
      !data.title ||
      !data.category_id ||
      !data.job_type ||
      !data.location_id
    ) {
      setMessage({
        type: "error",
        text: "Vui lòng điền đầy đủ các trường bắt buộc!",
      });
      setLoading(false);
      return;
    }

    if (!description) {
      setMessage({ type: "error", text: "Vui lòng nhập mô tả công việc!" });
      setLoading(false);
      return;
    }

    try {
      const url = isEdit
        ? isAdmin
          ? `/api/admin/jobs/${jobId}`
          : `/api/enterprises/${enterpriseId}/jobs/${jobId}`
        : `/api/enterprises/${enterpriseId}/jobs`;

      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok) {
        setMessage({
          type: "success",
          text: isEdit
            ? "Cập nhật tin tuyển dụng thành công!"
            : "Đăng tin tuyển dụng thành công!",
        });

        // Chỉ reset form khi tạo mới
        if (!isEdit) {
          formRef.current?.reset();
          setJobType("");
          setCategoryId("");
          setWorkMode("");
          setLocationId("");
          setSelectedSkills([]);
        }

        // Redirect sau 2 giây
        setTimeout(() => {
          const target = isAdmin
            ? `/admin/jobs` // hoặc route list job admin của bạn
            : `/enterprise/${enterpriseId}/jobs`;
        
          router.push(target);
          router.refresh();
        }, 2000);
      } else {
        setMessage({
          type: "error",
          text: result.error || "Lỗi khi lưu tin tuyển dụng",
        });
      }
    } catch (err) {
      console.error("Submit error:", err);
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
    skills,
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
    selectedSkills,
    handleSkillChange,
  };
}
