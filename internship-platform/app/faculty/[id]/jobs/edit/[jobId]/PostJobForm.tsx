
// "use client";

// import { usePostJobLogic } from "./usePostJobLogic";

// interface PostJobFormProps {
//   initialData?: any;
//   enterpriseId: string;
//   isEdit?: boolean;
//   jobId?: string;
// }

// export default function PostJobForm({
//   initialData = null,
//   enterpriseId,
//   isEdit = false,
//   jobId = "",
// }: PostJobFormProps) {
//   const {
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
//   } = usePostJobLogic({ initialData, enterpriseId, isEdit, jobId });

//   return (
//     <div className="formint conForm">
//       <form onSubmit={handleSubmit} ref={formRef}>
//         <div className="input-wrap">
//           <input
//             type="text"
//             name="title"
//             placeholder="Tiêu đề công việc *"
//             className="form-control"
//             required
//             defaultValue={isEdit ? initialData?.title : undefined}
//           />
//         </div>

//         <div className="row">
//           {/* Loại công việc */}
//           <div className="col-lg-6">
//             <div className="input-wrap">
//               <select
//                 name="job_type"
//                 className="form-control"
//                 required
//                 value={jobType}
//                 onChange={(e) => setJobType(e.target.value)}
//                 disabled={loadingData}
//               >
//                 <option value="">Loại công việc *</option>
//                 <option value="INTERNSHIP">Thực tập sinh</option>
//                 <option value="FULL_TIME">Toàn thời gian</option>
//                 <option value="PART_TIME">Bán thời gian</option>
//               </select>
//             </div>
//           </div>

//           {/* Danh mục công việc */}
//           <div className="col-lg-6">
//             <div className="input-wrap">
//               <select
//                 name="category_id"
//                 className="form-control"
//                 required
//                 value={categoryId}
//                 onChange={(e) => setCategoryId(e.target.value)}
//                 disabled={loadingData}
//               >
//                 <option value="">
//                   {loadingData ? "Đang tải danh mục..." : "Danh mục công việc *"}
//                 </option>
//                 {categories.map((cat) => (
//                   <option key={cat.id} value={cat.id}>
//                     {cat.name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           {/* Hình thức làm việc */}
//           <div className="col-lg-6">
//             <div className="input-wrap">
//               <select
//                 name="work_mode"
//                 className="form-control"
//                 value={workMode}
//                 onChange={(e) => setWorkMode(e.target.value)}
//               >
//                 <option value="">Hình thức làm việc</option>
//                 <option value="ONSITE">Tại công ty</option>
//                 <option value="REMOTE">Từ xa</option>
//                 <option value="HYBRID">Kết hợp</option>
//               </select>
//             </div>
//           </div>

//           {/* Địa điểm */}
//           <div className="col-lg-6">
//             <div className="input-wrap">
//               <select
//                 name="location_id"
//                 className="form-control"
//                 required
//                 value={locationId}
//                 onChange={(e) => setLocationId(e.target.value)}
//                 disabled={loadingData}
//               >
//                 <option value="">
//                   {loadingData ? "Đang tải địa điểm..." : "Địa điểm làm việc *"}
//                 </option>
//                 {locations.map((loc) => (
//                   <option key={loc.id} value={loc.id}>
//                     {loc.name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           {/* Thời gian thực tập */}
//           <div className="col-lg-6">
//             <div className="input-wrap">
//               <input
//                 type="text"
//                 name="internship_period"
//                 placeholder="Thời gian thực tập (vd: 3-6 tháng)"
//                 className="form-control"
//                 defaultValue={isEdit ? initialData?.internship_period : undefined}
//               />
//             </div>
//           </div>

//           {/* GPA tối thiểu */}
//           <div className="col-lg-6">
//             <div className="input-wrap">
//               <input
//                 type="number"
//                 step="0.1"
//                 name="require_gpa_min"
//                 placeholder="GPA tối thiểu"
//                 className="form-control"
//                 defaultValue={isEdit && initialData?.require_gpa_min !== null ? initialData.require_gpa_min : undefined}
//               />
//             </div>
//           </div>

//           {/* Hạn nộp */}
//           <div className="col-lg-12">
//             <div className="input-wrap">
//               <input
//                 type="date"
//                 name="application_deadline"
//                 className="form-control"
//                 defaultValue={isEdit ? initialData?.application_deadline : undefined}
//               />
//             </div>
//           </div>

//           {/* Mô tả */}
//           <div className="col-lg-12">
//             <div className="input-wrap">
//               <textarea
//                 name="description"
//                 className="form-control"
//                 placeholder="Mô tả chi tiết công việc *"
//                 rows={6}
//                 required
//                 defaultValue={isEdit ? initialData?.description : undefined}
//               />
//             </div>
//           </div>

//           {/* Nút submit */}
//           <div className="col-lg-12">
//             <div className="sub-btn">
//               <button type="submit" className="sbutn" disabled={loading || loadingData}>
//                 {loading ? "Đang lưu..." : isEdit ? "Cập nhật công việc" : "Đăng tin tuyển dụng"}
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Thông báo */}
//         {message && (
//           <div className="row mt-4">
//             <div className={`col-lg-12 text-center font-bold ${message.type === "success" ? "text-green-600" : "text-red-600"}`}>
//               {message.text}
//             </div>
//           </div>
//         )}
//       </form>
//     </div>
//   );
// }


// app/post-job/PostJobForm.tsx (hoặc vị trí của bạn)

// app/post-job/PostJobForm.tsx (phần quan trọng đã sửa)

"use client";
import { usePostJobLogic } from "@/app/post-job/postJob";
// import { usePostJobLogic } from "./usePostJobLogic";
import RichTextEditor from "@/app/post-job/RichTextEditor"; 
import { useState, useEffect } from "react";

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
  } = usePostJobLogic({ initialData, enterpriseId, isEdit, jobId });

  // State cho RichTextEditor
  const [descriptionHtml, setDescriptionHtml] = useState<string>("");

  // KHỞI TẠO DESCRIPTION KHI EDIT
  useEffect(() => {
    if (initialData?.description) {
      setDescriptionHtml(initialData.description);
    }
  }, [initialData]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    let hiddenInput = form.querySelector('input[name="description"]') as HTMLInputElement | null;

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
          <div className="input-wrap">
            <input
              type="text"
              name="title"
              placeholder="Tiêu đề công việc *"
              className="form-control"
              defaultValue={initialData?.title || ""}
              required
            />
          </div>
  
          <div className="row">
            {/* Loại công việc */}
            <div className="col-lg-6">
            <div className="input-wrap">
              <select
                name="job_type"
                className="form-control"
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                disabled={loadingData}
                required
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
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                disabled={loadingData}
                required
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
                value={locationId}
                onChange={(e) => setLocationId(e.target.value)}
                disabled={loadingData}
                required
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
                defaultValue={initialData?.internship_period || ""}
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
                defaultValue={initialData?.require_gpa_min || ""}
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
                defaultValue={initialData?.application_deadline || ""}
              />
            </div>
          </div>
  
  
            <div className="col-lg-12">
              <div className="input-wrap">
                <label className=" fs-4 block text-lg font-semibold text-gray-700 mb-3">
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
                        <div key={skill.id} className="flex flex-col justify-between bg-gray-50 p-3 rounded-lg">
                          <span className=" fs-4 font-semibold text-gray-800 ">{skill.name}</span>
                          
                          <select
                            value={level}
                            onChange={(e) => handleSkillChange(skill.id, parseInt(e.target.value))}
                            className="form-control w-48"
                          >
                            <option value={0}>Không yêu cầu</option>
                            <option value={1}>1 - Cơ bản</option>
                            <option value={2}>2 - Biết sử dụng</option>
                            <option value={3}>3 - Thành thạo</option>
                            {/* <option value={4}>4 - Chuyên sâu</option>
                            <option value={5}>5 - Chuyên gia</option> */}
                          </select>
                        </div>
                      );
                    })
                  )}
                </div>  
              </div>
            </div>
            
  
            {/* Mô tả công việc - Rich Text Editor */}
            <div className="col-lg-12 mb-4">
              <div className="input-wrap">
                <label className=" fs-4 block text-sm font-semibold text-gray-700 mb-2">
                  Mô tả chi tiết công việc *
                </label>
                <RichTextEditor
                  content={initialData?.description || ""}
                  onChange={(html) => setDescriptionHtml(html)}
                  placeholder="Nhập mô tả công việc... (hỗ trợ in đậm, nghiêng, danh sách, heading...)"
                />
              </div>
            </div>
  
            {/* Submit */}
            <div className="col-lg-12">
              <div className="sub-btn">
                <button type="submit" className="sbutn" disabled={loading || loadingData}>
                  {loading ? "Đang lưu..." : isEdit ? "Cập nhật công việc" : "Đăng tin tuyển dụng"}
                </button>
              </div>
            </div>
          </div>
  
          {message && (
            <div className="row mt-4">
              <div className="col-lg-12 text-center">
                <p className={message.type === "success" ? "text-success" : "text-danger"}>
                  {message.text}
                </p>
              </div>
            </div>
          )}
        </form>
      </div>
    );
}