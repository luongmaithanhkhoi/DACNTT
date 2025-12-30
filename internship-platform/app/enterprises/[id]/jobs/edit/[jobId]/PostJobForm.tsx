
"use client";

import { usePostJobLogic } from "./usePostJobLogic";

interface PostJobFormProps {
  initialData?: any;
  enterpriseId: string;
  isEdit?: boolean;
  jobId?: string;
}

export default function PostJobForm({
  initialData = null,
  enterpriseId,
  isEdit = false,
  jobId = "",
}: PostJobFormProps) {
  const {
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
  } = usePostJobLogic({ initialData, enterpriseId, isEdit, jobId });

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

          {/* Danh mục công việc */}
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
                defaultValue={isEdit ? initialData?.internship_period : undefined}
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
                defaultValue={isEdit && initialData?.require_gpa_min !== null ? initialData.require_gpa_min : undefined}
              />
            </div>
          </div>

          {/* Hạn nộp */}
          <div className="col-lg-12">
            <div className="input-wrap">
              <input
                type="date"
                name="application_deadline"
                className="form-control"
                defaultValue={isEdit ? initialData?.application_deadline : undefined}
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
            <div className={`col-lg-12 text-center font-bold ${message.type === "success" ? "text-green-600" : "text-red-600"}`}>
              {message.text}
            </div>
          </div>
        )}
      </form>
    </div>
  );
}