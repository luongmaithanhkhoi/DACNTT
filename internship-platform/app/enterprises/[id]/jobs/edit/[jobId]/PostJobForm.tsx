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
  is_open?: boolean;
  // Thêm các field khác nếu cần
}

interface PostJobFormProps {
  initialData?: JobData | null;   // Dữ liệu job khi edit
  enterpriseId: string;           // ID doanh nghiệp
  isEdit?: boolean;               // Mode edit hay create
  jobId?: string;                 // Chỉ cần khi edit
}

export default function PostJobForm({
  initialData = null,
  enterpriseId,
  isEdit = false,
  jobId = "",
}: PostJobFormProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [locations, setLocations] = useState<Location[]>([]);
  const [categories, setCategories] = useState<JobCategory[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [selectedJobType, setSelectedJobType] = useState<string>("");
  const [selectedWorkMode, setSelectedWorkMode] = useState<string>("");

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
        setMessage({ type: "error", text: "Không tải được danh mục hoặc địa điểm" });
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, []);

  // Tự động điền dữ liệu khi edit
  useEffect(() => {
    if (isEdit && initialData && formRef.current) {
      const form = formRef.current;
     

    //   (form.elements.namedItem("title") as HTMLInputElement).value = initialData.title || "";
    //   (form.elements.namedItem("description") as HTMLTextAreaElement).value = initialData.description || "";
    //   (form.elements.namedItem("job_type") as HTMLSelectElement).value = initialData.job_type || "";
    //   (form.elements.namedItem("category_id") as HTMLSelectElement).value = initialData.category_id || "";
    //   (form.elements.namedItem("work_mode") as HTMLSelectElement).value = initialData.work_mode || "";
    //   (form.elements.namedItem("location_id") as HTMLSelectElement).value = initialData.location_id || "";
    //   (form.elements.namedItem("internship_period") as HTMLInputElement).value = initialData.internship_period || "";
    //   (form.elements.namedItem("require_gpa_min") as HTMLInputElement).value = 
    //     initialData.require_gpa_min !== null ? initialData.require_gpa_min.toString() : "";
    //   (form.elements.namedItem("application_deadline") as HTMLInputElement).value = 
    //     initialData.application_deadline || "";
    }
  }, [isEdit, initialData]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);

    const data = {
      title: formData.get("title")?.toString().trim(),
      description: formData.get("description")?.toString().trim() || null,
      category_id: formData.get("category_id")?.toString() || null,
      job_type: formData.get("job_type")?.toString() || null,
      work_mode: formData.get("work_mode")?.toString() || null,
      location_id: formData.get("location_id")?.toString() || null,
      internship_period: formData.get("internship_period")?.toString() || null,
      require_gpa_min: formData.get("require_gpa_min")
        ? parseFloat(formData.get("require_gpa_min") as string)
        : null,
      application_deadline: formData.get("application_deadline")?.toString() || null,
      is_open: true, // luôn mở khi tạo mới, khi edit giữ nguyên hoặc cho phép thay đổi
    };

    // Validate bắt buộc
    if (!data.title || !data.category_id || !data.job_type || !data.location_id) {
      setMessage({ type: "error", text: "Vui lòng điền đầy đủ các trường bắt buộc!" });
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
          text: isEdit ? "Cập nhật công việc thành công!" : "Đăng tin tuyển dụng thành công!",
        });

        // Reset form nếu tạo mới
        if (!isEdit) {
          formRef.current?.reset();
        }

        // Quay lại danh sách sau 2 giây và refresh dữ liệu
        setTimeout(() => {
          router.push(`/enterprises/${enterpriseId}/jobs`);
          router.refresh();
        }, 2000);
      } else {
        setMessage({ type: "error", text: result.error || "Có lỗi xảy ra khi lưu" });
      }
    } catch (err) {
      console.error("Lỗi submit:", err);
      setMessage({ type: "error", text: "Lỗi kết nối server. Vui lòng thử lại!" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="formint conForm">
      <form onSubmit={handleSubmit} ref={formRef}>
        <div className="input-wrap">
          <input
            type="text"
            name="title"
            placeholder="Tiêu đề công việc *"
            className="form-control"
            required
            defaultValue={isEdit ? initialData?.title : undefined}
          />
        </div>

        <div className="row">
          {/* Loại công việc */}
          <div className="col-lg-6">
            <div className="input-wrap">
              <select name="job_type" className="form-control" required disabled={loadingData}>
                {/* <option value="">Loại công việc *</option> */}
                <option value="INTERNSHIP">Thực tập sinh</option>
                <option value="FULL_TIME">Toàn thời gian</option>
                <option value="PART_TIME">Bán thời gian</option>
              </select>
            </div>
          </div>

          {/* Danh mục */}
          <div className="col-lg-6">
            <div className="input-wrap">
              <select name="category_id" className="form-control" required disabled={loadingData}>
                <option value="">{loadingData ? "Đang tải..." : "Danh mục công việc *"}</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Hình thức làm việc */}
          <div className="col-lg-6">
            <div className="input-wrap">
              <select name="work_mode" className="form-control">
                {/* <option value="">Hình thức làm việc</option> */}
                <option value="ONSITE">Tại công ty</option>
                <option value="REMOTE">Từ xa</option>
                <option value="HYBRID">Kết hợp</option>
              </select>
            </div>
          </div>

          {/* Địa điểm */}
          <div className="col-lg-6">
            <div className="input-wrap">
              <select name="location_id" className="form-control" required disabled={loadingData}>
                <option value="">{loadingData ? "Đang tải..." : "Địa điểm làm việc *"}</option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Các field thực tập */}
          <div className="col-lg-6">
            <div className="input-wrap">
              <input
                type="text"
                name="internship_period"
                placeholder="Thời gian thực tập (vd: 3-6 tháng)"
                className="form-control"
              />
            </div>
          </div>

          <div className="col-lg-6">
            <div className="input-wrap">
              <input
                type="number"
                step="0.1"
                name="require_gpa_min"
                placeholder="GPA tối thiểu"
                className="form-control"
              />
            </div>
          </div>

          <div className="col-lg-12">
            <div className="input-wrap">
              <input
                type="date"
                name="application_deadline"
                className="form-control"
              />
            </div>
          </div>

          {/* Mô tả */}
          <div className="col-lg-12">
            <div className="input-wrap">
              <textarea
                name="description"
                className="form-control"
                placeholder="Mô tả chi tiết công việc *"
                rows={6}
                required
                defaultValue={isEdit ? initialData?.description : undefined}
              />
            </div>
          </div>

          {/* Nút submit */}
          <div className="col-lg-12">
            <div className="sub-btn">
              <button type="submit" className="sbutn" disabled={loading || loadingData}>
                {loading ? "Đang lưu..." : isEdit ? "Cập nhật công việc" : "Đăng tin tuyển dụng"}
              </button>
            </div>
          </div>
        </div>

        {/* Thông báo */}
        {message && (
          <div className="row mt-4">
            <div className={`col-lg-12 text-center text-${message.type === "success" ? "green-600" : "red-600"} font-bold`}>
              {message.text}
            </div>
          </div>
        )}
      </form>
    </div>
  );
}