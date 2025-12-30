// "use client";

// import { useParams } from "next/navigation";
// import { useState, useEffect } from "react";
// import { useRef } from "react";
// interface Location {
//   id: string;
//   name: string;
// }

// interface JobCategory {
//   id: string;
//   name: string;
//   code?: string;
// }

// export default function PostJobForm() {
//   // const { id: enterpriseId } = useParams();
//   const enterpriseId = "abb1f9c4-9887-4e5c-80ef-225899fc4361";
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

//   // State cho dữ liệu từ database
//   const [locations, setLocations] = useState<Location[]>([]);
//   const [categories, setCategories] = useState<JobCategory[]>([]);
//   const [loadingData, setLoadingData] = useState(true);
//   const formRef = useRef<HTMLFormElement>(null);
//   // Fetch Location + JobCategory khi mount
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [locRes, catRes] = await Promise.all([
//           fetch('/api/locations', { cache: 'no-store' }),
//           fetch('/api/job-categories', { cache: 'no-store' }),
//         ]);

//         const locResult = await locRes.json();
//         const catResult = await catRes.json();

//         if (locResult.success) setLocations(locResult.data);
//         if (catResult.success) setCategories(catResult.data);
//       } catch (err) {
//         console.error("Lỗi tải dữ liệu form:", err);
//       } finally {
//         setLoadingData(false);
//       }
//     };

//     fetchData();
//   }, []);

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage(null);

//     const formData = new FormData(e.currentTarget);

//     const data = {
//       title: formData.get("title")?.toString().trim(),
//       description: formData.get("description")?.toString().trim(),
//       category_id: formData.get("category_id"),
//       job_type: formData.get("job_type"),
//       work_mode: formData.get("work_mode") || null,
//       location_id: formData.get("location_id") || null,
//       salary_min: formData.get("salary_min") ? Number(formData.get("salary_min")) : null,
//       salary_max: formData.get("salary_max") ? Number(formData.get("salary_max")) : null,
//       allowance_min: formData.get("allowance_min") ? Number(formData.get("allowance_min")) : null,
//       allowance_max: formData.get("allowance_max") ? Number(formData.get("allowance_max")) : null,
//       experience_level: formData.get("experience_level") || null,
//       internship_period: formData.get("internship_period")?.toString() || null,
//       require_gpa_min: formData.get("require_gpa_min") ? parseFloat(formData.get("require_gpa_min") as string) : null,
//       application_deadline: formData.get("application_deadline")?.toString() || null,
//       tags: [],
//       skills: [],
//     };

//     try {
//       console.log("Đang gửi dữ liệu:", data); // Debug 1
//       const res = await fetch(`/api/enterprises/${enterpriseId}/jobs`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(data),
//       });
//       console.log("Response status:", res.status); // Debug 2
//       console.log("Response ok:", res.ok); // Debug 3

//       const result = await res.json();
//       console.log("Response body:", result);
//       if (res.ok) {
//         setMessage({ type: "success", text: "Đăng tin tuyển dụng thành công!" });
//         // e.currentTarget.reset();
//         if (formRef.current) {
//           formRef.current.reset();
//         }

//       } else {
//         setMessage({ type: "error", text: result.error || `Lỗi ${res.status}` });
//       }
//     } catch (err) {
//       console.log("Err:", err);
//       setMessage({ type: "error", text: "Không kết nối được server. Vui lòng thử lại!" });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="formint conForm">
//       <form onSubmit={handleSubmit} ref={formRef}>
//         <div className="row">
//           {/* Tiêu đề */}
//           <div className="col-lg-12">
//             <div className="input-wrap">
//               <input
//                 type="text"
//                 name="title"
//                 placeholder="Tiêu đề công việc *"
//                 className="form-control"
//                 required
//               />
//             </div>
//           </div>

//           {/* Loại công việc - job_type */}
//           <div className="col-lg-6">
//             <div className="input-wrap">
//               <select name="job_type" className="form-control" required disabled={loadingData}>
//                 <option value="">Loại công việc *</option>
//                 <option value="INTERNSHIP">Thực tập sinh</option>
//                 <option value="FULL_TIME">Toàn thời gian</option>
//                 <option value="PART_TIME">Bán thời gian</option>
//               </select>
//             </div>
//           </div>

//           {/* Danh mục - category_id */}
//           <div className="col-lg-6">
//             <div className="input-wrap">
//               <select name="category_id" className="form-control" required disabled={loadingData}>
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

//           {/* Hình thức làm việc - work_mode */}
//           <div className="col-lg-6">
//             <div className="input-wrap">
//               <select name="work_mode" className="form-control">
//                 <option value="">Hình thức làm việc</option>
//                 <option value="ONSITE">Tại công ty (Onsite)</option>
//                 <option value="REMOTE">Từ xa (Remote)</option>
//                 <option value="HYBRID">Kết hợp (Hybrid)</option>
//               </select>
//             </div>
//           </div>

//           {/* Địa điểm - location_id */}
//           <div className="col-lg-6">
//             <div className="input-wrap">
//               <select name="location_id" className="form-control" required disabled={loadingData}>
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
//             <div className="col-lg-6">
//               <div className="input-wrap">
//               <input type="text" name="internship_period" placeholder="Thời gian thực tập (e.g. 3-6 months)" className="form-control" required />
//               </div>
//             </div>

//             <div className="col-lg-6">
//               <div className="input-wrap">
//                 <input type="number" step="0.1" name="require_gpa_min" placeholder="GPA tối thiểu (e.g. 3.0)" className="form-control" />
//               </div>
//             </div>

//             <div className="col-lg-12">
//               <div className="input-wrap">
//                 <input type="date" name="application_deadline" placeholder="Hạn nộp hồ sơ" className="form-control" />
//               </div>
//             </div>
        


//           {/* Mô tả */}
//           <div className="col-lg-12">
//             <div className="input-wrap">
//               <textarea
//                 name="description"
//                 className="form-control"
//                 placeholder="Mô tả chi tiết công việc *"
//                 rows={6}
//                 required
//               />
//             </div>
//           </div>

//           {/* Nút submit */}
//           <div className="col-lg-12 text-center">
//             <button type="submit" className="sbutn" disabled={loading || loadingData}>
//               {loading ? "Đang đăng tin..." : "Đăng tin tuyển dụng"}
//             </button>
//           </div>

//           {/* Thông báo */}
//           {message && (
//             <div className={`col-lg-12 mt-4 text-center text-${message.type === "success" ? "success" : "danger"} fw-bold`}>
//               {message.text}
//             </div>
//           )}
//         </div>
//       </form>
//     </div>
//   );
// }


"use client";

import { usePostJobLogic } from "./postJob";
import { Location, JobCategory } from "./types";

export default function PostJobForm() {
  const {
    loading,
    message,
    locations,
    categories,
    loadingData,
    formRef,
    handleSubmit,
  } = usePostJobLogic();

  return (
    <div className="formint conForm">
      <form onSubmit={handleSubmit} ref={formRef}>
        {/* Job Title */}
        <div className="input-wrap">
          <input
            type="text"
            name="title"
            placeholder="Tiêu đề công việc *"
            className="form-control"
            required
          />
        </div>

        <div className="row">
          {/* Job Type */}
          <div className="col-lg-6">
            <div className="input-wrap">
              <select name="job_type" className="form-control" required disabled={loadingData}>
                <option value="">Loại công việc *</option>
                <option value="INTERNSHIP">Thực tập sinh</option>
                <option value="FULL_TIME">Toàn thời gian</option>
                <option value="PART_TIME">Bán thời gian</option>
              </select>
            </div>
          </div>

          {/* Job Category */}
          <div className="col-lg-6">
            <div className="input-wrap">
              <select name="category_id" className="form-control" required disabled={loadingData}>
                <option value="">
                  {loadingData ? "Đang tải danh mục..." : "Danh mục công việc *"}
                </option>
                {categories.map((cat: JobCategory) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Work Mode */}
          <div className="col-lg-6">
            <div className="input-wrap">
              <select name="work_mode" className="form-control">
                <option value="">Hình thức làm việc</option>
                <option value="ONSITE">Tại công ty</option>
                <option value="REMOTE">Từ xa</option>
                <option value="HYBRID">Kết hợp</option>
              </select>
            </div>
          </div>

          {/* Location */}
          <div className="col-lg-6">
            <div className="input-wrap">
              <select name="location_id" className="form-control" required disabled={loadingData}>
                <option value="">
                  {loadingData ? "Đang tải địa điểm..." : "Địa điểm làm việc *"}
                </option>
                {locations.map((loc: Location) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Internship fields */}
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

          {/* Description */}
          <div className="col-lg-12">
            <div className="input-wrap">
              <textarea
                name="description"
                className="form-control"
                placeholder="Mô tả chi tiết công việc *"
                rows={6}
                required
              />
            </div>
          </div>

          {/* Submit */}
          <div className="col-lg-12">
            <div className="sub-btn">
              <button type="submit" className="sbutn" disabled={loading || loadingData}>
                {loading ? "Đang đăng tin..." : "Đăng tin tuyển dụng"}
              </button>
            </div>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className="row mt-3">
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