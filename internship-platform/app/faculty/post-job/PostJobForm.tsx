"use client";

import { usePostJobLogic } from "./postJob";
import RichTextEditor from "./RichTextEditor"; 
import { useState, useEffect } from "react";

interface Enterprise {
  id: string;
  name: string;
}

interface PostJobFormProps {
  initialData?: any;
  enterpriseId?: string; // Optional - admin không cần truyền
  isEdit?: boolean;
  jobId?: string;
  isAdmin?: boolean; // ✅ NEW: Flag để biết là admin
}

export default function PostJobForm({
  initialData = null,
  enterpriseId = "",
  isEdit = false,
  jobId = "",
  isAdmin = false, // ✅ NEW
}: PostJobFormProps) {
  // ✅ NEW: State cho admin chọn doanh nghiệp
  const [enterprises, setEnterprises] = useState<Enterprise[]>([]);
  const [selectedEnterpriseId, setSelectedEnterpriseId] = useState<string>(enterpriseId);
  const [loadingEnterprises, setLoadingEnterprises] = useState(false);

  const {
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
    handleSkillChange
  } = usePostJobLogic({ 
    initialData, 
    enterpriseId: selectedEnterpriseId, 
    isEdit, 
    jobId 
  });

  const [descriptionHtml, setDescriptionHtml] = useState<string>(initialData?.description || "");

  useEffect(() => {
    if (isAdmin) {
      const fetchEnterprises = async () => {
        setLoadingEnterprises(true);
        try {
          const res = await fetch('/api/enterprises');
          if (res.ok) {
            const data = await res.json();
            setEnterprises(data.data || data || []);
          }
        } catch (err) {
          console.error("Lỗi tải danh sách doanh nghiệp:", err);
        } finally {
          setLoadingEnterprises(false);
        }
      };
      fetchEnterprises();
    }
  }, [isAdmin]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isAdmin && !selectedEnterpriseId) {
      alert("Vui lòng chọn doanh nghiệp!");
      return;
    }

    const form = e.currentTarget;
    let hiddenInput = form.querySelector('input[name="description"]') as HTMLInputElement;

    if (!hiddenInput) {
      hiddenInput = document.createElement('input');
      hiddenInput.type = 'hidden';
      hiddenInput.name = 'description';
      form.appendChild(hiddenInput);
    }

    hiddenInput.value = descriptionHtml;
    handleSubmit(e);
  };

  return (
    <div className="formint conForm">
      <form onSubmit={onSubmit} ref={formRef}>
       
        {isAdmin && (
          <div className="input-wrap mb-4">
            <label className="fs-4 block text-lg font-semibold text-gray-700 mb-2">
              Chọn doanh nghiệp *
            </label>
            <select
              className="form-control"
              required
              value={selectedEnterpriseId}
              onChange={(e) => setSelectedEnterpriseId(e.target.value)}
              disabled={loadingEnterprises || isEdit}
            >
              <option value="">
                {loadingEnterprises ? "Đang tải..." : "-- Chọn doanh nghiệp --"}
              </option>
              {enterprises.map((ent) => (
                <option key={ent.id} value={ent.id}>
                  {ent.name}
                </option>
              ))}
            </select>
            {isEdit && (
              <small className="text-muted">
                Không thể thay đổi doanh nghiệp khi chỉnh sửa
              </small>
            )}
          </div>
        )}

        {/* Tiêu đề công việc */}
        <div className="input-wrap">
          <input
            type="text"
            name="title"
            placeholder="Tiêu đề công việc *"
            className="form-control"
            required
            defaultValue={initialData?.title}
          />
        </div>

        <div className="row">
          {/* Loại công việc */}
          <div className="col-lg-6">
            <div className="input-wrap">
              <select
                name="job_type"
                className="form-control"
                required
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                disabled={loadingData}
              >
                <option value="">Loại công việc *</option>
                <option value="INTERNSHIP">Thực tập sinh</option>
                <option value="FULL_TIME">Toàn thời gian</option>
                <option value="PART_TIME">Bán thời gian</option>
              </select>
            </div>
          </div>

          {/* Danh mục */}
          <div className="col-lg-6">
            <div className="input-wrap">
              <select
                name="category_id"
                className="form-control"
                required
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                disabled={loadingData}
              >
                <option value="">
                  {loadingData ? "Đang tải danh mục..." : "Danh mục công việc *"}
                </option>
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
              <select
                name="work_mode"
                className="form-control"
                value={workMode}
                onChange={(e) => setWorkMode(e.target.value)}
              >
                <option value="">Hình thức làm việc</option>
                <option value="ONSITE">Tại công ty</option>
                <option value="REMOTE">Từ xa</option>
                <option value="HYBRID">Kết hợp</option>
              </select>
            </div>
          </div>

          {/* Địa điểm */}
          <div className="col-lg-6">
            <div className="input-wrap">
              <select
                name="location_id"
                className="form-control"
                required
                value={locationId}
                onChange={(e) => setLocationId(e.target.value)}
                disabled={loadingData}
              >
                <option value="">
                  {loadingData ? "Đang tải địa điểm..." : "Địa điểm làm việc *"}
                </option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Thời gian thực tập */}
          <div className="col-lg-6">
            <div className="input-wrap">
              <input
                type="text"
                name="internship_period"
                placeholder="Thời gian thực tập (vd: 3-6 tháng)"
                className="form-control"
                defaultValue={initialData?.internship_period}
              />
            </div>
          </div>

          {/* GPA tối thiểu */}
          <div className="col-lg-6">
            <div className="input-wrap">
              <input
                type="number"
                step="0.1"
                name="require_gpa_min"
                placeholder="GPA tối thiểu"
                className="form-control"
                defaultValue={initialData?.require_gpa_min}
              />
            </div>
          </div>

          {/* Hạn nộp */}
          <div className="col-lg-12">
            <div className="input-wrap">
              <label className="fs-5">Hạn nộp hồ sơ</label>
              <input
                type="date"
                name="application_deadline"
                className="form-control"
                defaultValue={initialData?.application_deadline}
              />
            </div>
          </div>

          {/* Kỹ năng */}
          <div className="col-lg-12">
            <div className="input-wrap">
              <label className="fs-4 block text-lg font-semibold text-gray-700 mb-3">
                Kỹ năng yêu cầu
              </label>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {skills.length === 0 && loadingData ? (
                  <p className="text-gray-500">Đang tải danh sách kỹ năng...</p>
                ) : skills.length === 0 ? (
                  <p className="text-gray-500">Không có kỹ năng nào</p>
                ) : (
                  skills.map((skill) => {
                    const selected = selectedSkills.find(s => s.skill_id === skill.id);
                    const level = selected?.required_level || 0;

                    return (
                      <div key={skill.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                        <span className="fs-4 font-semibold text-gray-800">{skill.name}</span>
                        <select
                          value={level}
                          onChange={(e) => handleSkillChange(skill.id, parseInt(e.target.value))}
                          className="form-control w-48"
                        >
                          <option value={0}>Không yêu cầu</option>
                          <option value={1}>1 - Cơ bản</option>
                          <option value={2}>2 - Biết sử dụng</option>
                          <option value={3}>3 - Thành thạo</option>
                        </select>
                      </div>
                    );
                  })
                )}
              </div>  
            </div>
          </div>

          {/* Mô tả công việc */}
          <div className="col-lg-12 mb-4">
            <div className="input-wrap">
              <label className="fs-4 block text-sm font-semibold text-gray-700 mb-2">
                Mô tả chi tiết công việc *
              </label>
              <RichTextEditor
                content={initialData?.description || ""}
                onChange={(html) => setDescriptionHtml(html)}
                placeholder="Nhập mô tả công việc..."
              />
            </div>
          </div>

          {/* Submit */}
          <div className="col-lg-12">
            <div className="sub-btn">
              <button 
                type="submit" 
                className="sbutn" 
                disabled={loading || loadingData || (isAdmin && !selectedEnterpriseId)}
              >
                {loading ? "Đang lưu..." : isEdit ? "Cập nhật công việc" : "Đăng tin tuyển dụng"}
              </button>
            </div>
          </div>
        </div>

        {message && (
          <div className="row mt-4">
            <div className="col-lg-12 text-center">
              <p className={message.type === "success" ? "text-success fs-4" : "text-danger fs-4"}>
                {message.text}
              </p>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}