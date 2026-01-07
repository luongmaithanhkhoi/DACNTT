// app/post-job/postJob.ts

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
  description: string | null;
  category_id: string | null;
  job_type: string | null;
  work_mode: string | null;
  location_id: string | null;
  internship_period: string | null;
  require_gpa_min: number | null;
  application_deadline: string | null;
  skills?: SelectedSkill[];
}

interface UsePostJobLogicProps {
  initialData?: JobData | null;
  enterpriseId: string;
  isEdit?: boolean;
  jobId?: string;
  isAdmin?: boolean; // Thêm để biết là admin
}

export function usePostJobLogic({
  initialData = null,
  enterpriseId: propEnterpriseId = "",
  isEdit = false,
  jobId = "",
  isAdmin = false,
}: UsePostJobLogicProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [locations, setLocations] = useState<Location[]>([]);
  const [categories, setCategories] = useState<JobCategory[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const [jobType, setJobType] = useState<string>(initialData?.job_type || "");
  const [categoryId, setCategoryId] = useState<string>(initialData?.category_id || "");
  const [workMode, setWorkMode] = useState<string>(initialData?.work_mode || "");
  const [locationId, setLocationId] = useState<string>(initialData?.location_id || "");

  const [selectedSkills, setSelectedSkills] = useState<SelectedSkill[]>(
    initialData?.skills || []
  );

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [locRes, catRes, skillRes] = await Promise.all([
          fetch('/api/locations', { cache: 'no-store' }),
          fetch('/api/job-categories', { cache: 'no-store' }),
          fetch('/api/skills', { cache: 'no-store' }),
        ]);

        const locJson = await locRes.json();
        const catJson = await catRes.json();
        const skillJson = await skillRes.json();

        setLocations(Array.isArray(locJson) ? locJson : locJson.data || []);
        setCategories(Array.isArray(catJson) ? catJson : catJson.data || []);
        setSkills(Array.isArray(skillJson.data) ? skillJson.data : skillJson || []);
      } catch (err) {
        console.error("Lỗi tải dữ liệu form:", err);
        setMessage({ type: "error", text: "Không thể tải dữ liệu" });
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, []);

  const handleSkillChange = (skillId: string, level: number) => {
    setSelectedSkills(prev => {
      const existing = prev.find(s => s.skill_id === skillId);
      if (existing) {
        if (level === 0) {
          return prev.filter(s => s.skill_id !== skillId);
        }
        return prev.map(s => s.skill_id === skillId ? { ...s, required_level: level } : s);
      }
      if (level > 0) {
        return [...prev, { skill_id: skillId, required_level: level }];
      }
      return prev;
    });
  };

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
      skills: selectedSkills,
    };

    if (!data.title || !data.category_id || !data.job_type || !data.location_id) {
      setMessage({ type: "error", text: "Vui lòng điền đầy đủ các trường bắt buộc!" });
      setLoading(false);
      return;
    }

    try {
      let currentEnterpriseId = propEnterpriseId;

      // Nếu là admin → lấy từ dropdown
      if (isAdmin) {
        const selectElement = document.getElementById('admin-enterprise-select') as HTMLSelectElement;
        if (!selectElement || !selectElement.value) {
          setMessage({ type: "error", text: "Vui lòng chọn doanh nghiệp!" });
          setLoading(false);
          return;
        }
        currentEnterpriseId = selectElement.value;
      }

      const url = isEdit
        ? `/api/enterprises/${currentEnterpriseId}/jobs/${jobId}`
        : `/api/enterprises/${currentEnterpriseId}/jobs`;

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
          setSelectedSkills([]);
        }

        setTimeout(() => {
          router.push(isAdmin ? '/admin/jobs' : `/faculty/jobs`);
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