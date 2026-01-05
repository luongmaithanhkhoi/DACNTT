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
  skills?: SelectedSkill[]; // Kỹ năng khi edit
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
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Controlled state
  const [jobType, setJobType] = useState<string>(initialData?.job_type || "");
  const [categoryId, setCategoryId] = useState<string>(initialData?.category_id || "");
  const [workMode, setWorkMode] = useState<string>(initialData?.work_mode || "");
  const [locationId, setLocationId] = useState<string>(initialData?.location_id || "");

  // State cho skills
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
        console.log("Skills raw:", skillJson);

        setLocations(Array.isArray(locJson) ? locJson : []);
        setCategories(Array.isArray(catJson) ? catJson : []);
       setSkills(Array.isArray(skillJson.data) ? skillJson.data : []);
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
          return prev.filter(s => s.skill_id !== skillId); // Xóa nếu level = 0
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
      skills: selectedSkills, // ← Gửi mảng skills
    };

    if (!data.title || !data.category_id || !data.job_type || !data.location_id) {
      setMessage({ type: "error", text: "Vui lòng điền đầy đủ các trường bắt buộc!" });
      setLoading(false);
      return;
    }

    try {
      const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
      const currentEnterpriseId = typeof window !== 'undefined' 
          ? localStorage.getItem('enterprise_id')
          : null;

        if (!currentEnterpriseId) {
          setMessage({ type: "error", text: "Không tìm thấy doanh nghiệp. Vui lòng đăng nhập lại." });
          setLoading(false);
          return;
}
      const url = isEdit
        ? `${baseUrl}/api/enterprises/${currentEnterpriseId}/jobs/${jobId}`
        : `${baseUrl}/api/enterprises/${currentEnterpriseId}/jobs`;

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


// "use client";

// import { useRouter } from "next/navigation";
// import { useState, useEffect, useRef } from "react";

// interface Location {
//   id: string;
//   name: string;
// }

// interface JobCategory {
//   id: string;
//   name: string;
// }

// interface JobData {
//   id?: string;
//   title: string;
//   description: string | null;
//   category_id: string | null;
//   job_type: string | null;
//   work_mode: string | null;
//   location_id: string | null;
//   internship_period: string | null;
//   require_gpa_min: number | null;
//   application_deadline: string | null;
// }

// interface UsePostJobLogicProps {
//   initialData?: JobData | null;
//   enterpriseId: string;
//   isEdit?: boolean;
//   jobId?: string;
// }

// export function usePostJobLogic({
//   initialData = null,
//   enterpriseId,
//   isEdit = false,
//   jobId = "",
// }: UsePostJobLogicProps) {
//   const router = useRouter();

//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

//   const [locations, setLocations] = useState<Location[]>([]);
//   const [categories, setCategories] = useState<JobCategory[]>([]);
//   const [loadingData, setLoadingData] = useState(true);

//   // Controlled state cho select
//   const [jobType, setJobType] = useState<string>(initialData?.job_type || "");
//   const [categoryId, setCategoryId] = useState<string>(initialData?.category_id || "");
//   const [workMode, setWorkMode] = useState<string>(initialData?.work_mode || "");
//   const [locationId, setLocationId] = useState<string>(initialData?.location_id || "");

//   const formRef = useRef<HTMLFormElement>(null);

//   // Fetch danh mục + địa điểm
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [locRes, catRes] = await Promise.all([
//           fetch('/api/locations', { cache: 'no-store' }),
//           fetch('/api/job-categories', { cache: 'no-store' }),
//         ]);

//         const locJson = await locRes.json();
//         const catJson = await catRes.json();

//         // API trả về mảng trực tiếp → set thẳng
//         setLocations(Array.isArray(locJson) ? locJson : []);
//         setCategories(Array.isArray(catJson) ? catJson : []);
//       } catch (err) {
//         console.error("Lỗi tải dữ liệu form:", err);
//         setMessage({ type: "error", text: "Không thể tải danh mục hoặc địa điểm" });
//       } finally {
//         setLoadingData(false);
//       }
//     };

//     fetchData();
//   }, []);

//   // Điền dữ liệu khi edit
//   useEffect(() => {
//     if (isEdit && initialData && !loadingData) {
//       setJobType(initialData.job_type || "");
//       setCategoryId(initialData.category_id || "");
//       setWorkMode(initialData.work_mode || "");
//       setLocationId(initialData.location_id || "");
//     }
//   }, [isEdit, initialData, loadingData]);

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage(null);

//     const formData = new FormData(e.currentTarget);

//     const data = {
//       title: formData.get("title")?.toString().trim(),
//       description: formData.get("description")?.toString().trim() || null,
//       category_id: categoryId || null,
//       job_type: jobType || null,
//       work_mode: workMode || null,
//       location_id: locationId || null,
//       internship_period: formData.get("internship_period")?.toString() || null,
//       require_gpa_min: formData.get("require_gpa_min")
//         ? parseFloat(formData.get("require_gpa_min") as string)
//         : null,
//       application_deadline: formData.get("application_deadline")?.toString() || null,
//     };

//     if (!data.title || !data.category_id || !data.job_type || !data.location_id) {
//       setMessage({ type: "error", text: "Vui lòng chọn đầy đủ các trường bắt buộc!" });
//       setLoading(false);
//       return;
//     }

//     try {
//       const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
//       enterpriseId = "abb1f9c4-9887-4e5c-80ef-225899fc4361";
//       const url = isEdit
//         ? `${baseUrl}/api/enterprises/${enterpriseId}/jobs/${jobId}`
//         : `${baseUrl}/api/enterprises/${enterpriseId}/jobs`;

//       const res = await fetch(url, {
//         method: isEdit ? "PUT" : "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(data),
//         cache: "no-store",
//       });

//       const result = await res.json();

//       if (res.ok) {
//         setMessage({
//           type: "success",
//           text: isEdit ? "Cập nhật công việc thành công!" : "Đăng tin tuyển dụng thành công!",
//         });

//         if (!isEdit) {
//           formRef.current?.reset();
//           setJobType("");
//           setCategoryId("");
//           setWorkMode("");
//           setLocationId("");
//         }

//         setTimeout(() => {
//           router.push(`/enterprises/${enterpriseId}/jobs`);
//           router.refresh();
//         }, 2000);
//       } else {
//         setMessage({ type: "error", text: result.error || "Lỗi khi lưu" });
//       }
//     } catch (err) {
//       setMessage({ type: "error", text: "Lỗi kết nối server" });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return {
//     loading,
//     message,
//     locations,
//     categories,
//     loadingData,
//     formRef,
//     handleSubmit,
//     jobType,
//     setJobType,
//     categoryId,
//     setCategoryId,
//     workMode,
//     setWorkMode,
//     locationId,
//     setLocationId,
//   };
// }