// "use client";

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { createClient } from '@supabase/supabase-js';
// import Link from 'next/link';
// import RichTextEditor from "../post-job/RichTextEditor";

// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
// );

// export default function PostEventPage() {
//   const router = useRouter();

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState(false);
//   const [role, setRole] = useState<string | null>(null);

//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     start_date: '',
//     end_date: '',
//     event_type: 'OTHER',
//     status: 'PENDING',
//     positions_available: '',
//     max_participants: '',
//     location: '',
//     required_skills: '',
//     additional_fields: '',
//   });

//   const [tags, setTags] = useState<string[]>([]);
//   const [newTag, setNewTag] = useState('');

//   useEffect(() => {
//     const savedRole = localStorage.getItem('user_role');
//     setRole(savedRole);

//     if (savedRole !== 'ADMIN') {
//       setError('Chỉ admin mới được đăng sự kiện.');
//     }
//   }, []);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const addTag = () => {
//     if (newTag.trim() && !tags.includes(newTag.trim())) {
//       setTags([...tags, newTag.trim()]);
//       setNewTag('');
//     }
//   };

//   const removeTag = (tag: string) => {
//     setTags(tags.filter(t => t !== tag));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);
//     setSuccess(false);

//     if (role !== 'ADMIN') {
//       setError('Chỉ admin mới được đăng sự kiện.');
//       setLoading(false);
//       return;
//     }

//     try {
//       const { data: { session } } = await supabase.auth.getSession();
//       if (!session) throw new Error('Vui lòng đăng nhập');

//       const res = await fetch('/api/events/post-event', {
//         method: 'POST',
//         headers: { 
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${session.access_token}`,
//         },
//         body: JSON.stringify({
//           ...formData,
//           tags,
//         }),
//       });

//       const result = await res.json();

//       if (!res.ok) {
//         throw new Error(result.error || 'Đăng sự kiện thất bại');
//       }

//       setSuccess(true);
//       setTimeout(() => router.push('/faculty'), 2000); // Redirect về trang quản lý sự kiện cho admin
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Lỗi khi đăng sự kiện');
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (role !== 'ADMIN') {
//     return (
//       <div className="inner-content py-5">
//         <div className="container text-center">
//           <p className="text-danger fs-3">Chỉ admin mới được truy cập trang này.</p>
//           <Link href="/login" className="btn btn-primary mt-4">Đăng nhập lại</Link>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="inner-content py-5">
//       <div className="container">
//         <h1 className="text-center mb-5 fs-2 fw-bold">Đăng sự kiện mới</h1>

//         {error && <div className="alert alert-danger text-center">{error}</div>}
//         {success && <div className="alert alert-success text-center">Đăng sự kiện thành công! Đang chuyển về danh sách...</div>}

//         <form onSubmit={handleSubmit} className="bg-white rounded shadow p-5">
//           <div className="row g-4">
//             <div className="col-12">
//               <label className="form-label fs-4 fw-bold">Tiêu đề sự kiện *</label>
//               <input
//                 type="text"
//                 name="title"
//                 className="form-control fs-5"
//                 required
//                 value={formData.title}
//                 onChange={handleChange}
//               />
//             </div>

//             <div className="col-12">
//               <label className="form-label fs-4 fw-bold">Mô tả sự kiện</label>
             
//               <textarea
//                 name="description"
//                 className="form-control fs-5"
//                 rows={5}
//                 value={formData.description}
//                 onChange={handleChange}
//               />
//             </div>
            

//             <div className="col-md-6">
//               <label className="form-label fs-4 fw-bold">Ngày bắt đầu</label>
//               <input
//                 type="date"
//                 name="start_date"
//                 className="form-control fs-5"
//                 value={formData.start_date}
//                 onChange={handleChange}
//               />
//             </div>

//             <div className="col-md-6">
//               <label className="form-label fs-4 fw-bold">Ngày kết thúc</label>
//               <input
//                 type="date"
//                 name="end_date"
//                 className="form-control fs-5"
//                 value={formData.end_date}
//                 onChange={handleChange}
//               />
//             </div>

//             <div className="col-md-6">
//               <label className="form-label fs-4 fw-bold">Loại sự kiện</label>
//               <select name="event_type" className="form-control fs-5" value={formData.event_type} onChange={handleChange}>
//                 <option value="OTHER">Khác</option>
//                 <option value="CAREER_DAY">Hội chợ việc làm</option>
//                 <option value="WORKSHOP">Hội thảo</option>
//                 <option value="SEMINAR">Hội thảo chuyên đề</option>
//                 {/* Thêm các loại khác nếu cần */}
//               </select>
//             </div>

//             <div className="col-md-6">
//               <label className="form-label fs-4 fw-bold">Trạng thái</label>
//               <select name="status" className="form-control fs-5" value={formData.status} onChange={handleChange}>
//                 <option value="PENDING">Chờ duyệt</option>
//                 <option value="APPROVED">Đã duyệt</option>
//                 <option value="REJECTED">Từ chối</option>
//                 <option value="CLOSED">Đóng</option>
//               </select>
//             </div>

//             <div className="col-md-6">
//               <label className="form-label fs-4 fw-bold">Số vị trí đã có</label>
//               <input
//                 type="number"
//                 name="positions_available"
//                 className="form-control fs-5"
//                 value={formData.positions_available}
//                 onChange={handleChange}
//               />
//             </div>

//             <div className="col-md-6">
//               <label className="form-label fs-4 fw-bold">Số người tham gia tối đa</label>
//               <input
//                 type="number"
//                 name="max_participants"
//                 className="form-control fs-5"
//                 value={formData.max_participants}
//                 onChange={handleChange}
//               />
//             </div>

//             <div className="col-12">
//               <label className="form-label fs-4 fw-bold">Địa điểm</label>
//               <input
//                 type="text"
//                 name="location"
//                 className="form-control fs-5"
//                 value={formData.location}
//                 onChange={handleChange}
//               />
//             </div>

//             <div className="col-12">
//               <label className="form-label fs-4 fw-bold">Kỹ năng yêu cầu</label>
//               <input
//                 type="text"
//                 name="required_skills"
//                 className="form-control fs-5"
//                 value={formData.required_skills}
//                 onChange={handleChange}
//               />
//             </div>

//             <div className="col-12">
//               <label className="form-label fs-4 fw-bold">Thêm tag</label>
//               <div className="input-group mb-3">
//                 <input
//                   type="text"
//                   className="form-control fs-5"
//                   placeholder="Nhập tag (ví dụ: AI, Frontend)"
//                   value={newTag}
//                   onChange={(e) => setNewTag(e.target.value)}
//                 />
//                 <button type="button" className="btn btn-secondary fs-5" onClick={addTag}>
//                   Thêm
//                 </button>
//               </div>
//               <div className="d-flex flex-wrap gap-2">
//                 {tags.map((tag) => (
//                   <span key={tag} className="badge bg-primary fs-5">
//                     {tag}
//                     <button type="button" className="btn-close btn-close-white ms-2" onClick={() => removeTag(tag)}></button>
//                   </span>
//                 ))}
//               </div>
//             </div>

//             <div className="col-12 text-center mt-5">
//               <button
//                 type="submit"
//                 className="btn btn-danger px-8 py-4 fs-4 me-4"
//                 disabled={loading}
//               >
//                 {loading ? 'Đang đăng sự kiện...' : 'Đăng sự kiện'}
//               </button>
//               <Link href="/faculty" className="btn btn-secondary px-6 py-4 fs-4">
//                 Hủy
//               </Link>
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }


// app/admin/post-event/page.tsx (hoặc đường dẫn bạn đang dùng)

"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import RichTextEditor from "../post-job/RichTextEditor"; // Đảm bảo đường dẫn đúng

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function PostEventPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [role, setRole] = useState<string | null>(null);

  // State cho form
  const [formData, setFormData] = useState({
    title: '',
    start_date: '',
    end_date: '',
    event_type: 'OTHER',
    status: 'PENDING',
    positions_available: '',
    max_participants: '',
    location: '',
    required_skills: '',
    additional_fields: '',
  });

  // State riêng cho rich text description (HTML)
  const [descriptionHtml, setDescriptionHtml] = useState<string>('');

  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  // Kiểm tra role khi mount
  useEffect(() => {
    const savedRole = localStorage.getItem('user_role');
    setRole(savedRole);

    if (savedRole !== 'ADMIN') {
      setError('Chỉ admin mới được đăng sự kiện.');
    }
  }, []);

  // Xử lý thay đổi input thông thường
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Thêm/xóa tag
  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    // Kiểm tra quyền
    if (role !== 'ADMIN') {
      setError('Chỉ admin mới được đăng sự kiện.');
      setLoading(false);
      return;
    }

    // Validate cơ bản
    if (!formData.title.trim()) {
      setError('Tiêu đề sự kiện là bắt buộc');
      setLoading(false);
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Vui lòng đăng nhập');

      const payload = {
        ...formData,
        description: descriptionHtml, // ← LẤY HTML từ RichTextEditor
        tags,
      };

      const res = await fetch('/api/events/post-event', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'Đăng sự kiện thất bại');
      }

      setSuccess(true);
      setTimeout(() => router.push('/faculty'), 2000); // Chuyển về danh sách
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi đăng sự kiện');
    } finally {
      setLoading(false);
    }
  };

  // Nếu không phải admin → hiển thị lỗi
  if (role !== 'ADMIN') {
    return (
      <div className="inner-content py-5">
        <div className="container text-center">
          <p className="text-danger fs-3">Chỉ admin mới được truy cập trang này.</p>
          <Link href="/login" className="btn btn-primary mt-4 px-6 py-3">
            Đăng nhập lại
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="inner-content py-5">
      <div className="container">
        <h1 className="text-center mb-5 fs-2 fw-bold">Đăng sự kiện mới (Admin)</h1>

        {error && <div className="alert alert-danger text-center fs-4">{error}</div>}
        {success && <div className="alert alert-success text-center fs-4">
          Đăng sự kiện thành công! Đang chuyển về danh sách...
        </div>}

        <form onSubmit={handleSubmit} className="bg-white rounded shadow p-5">
          <div className="row g-4">
            {/* Tiêu đề */}
            <div className="col-12">
              <label className="form-label fs-4 fw-bold">Tiêu đề sự kiện *</label>
              <input
                type="text"
                name="title"
                className="form-control fs-5"
                required
                value={formData.title}
                onChange={handleChange}
              />
            </div>

            {/* Mô tả - RichTextEditor */}
            <div className="col-12">
              <label className="form-label fs-4 fw-bold">Mô tả sự kiện</label>
              <RichTextEditor
                content={descriptionHtml}
                onChange={setDescriptionHtml} // ← Quan trọng: cập nhật state HTML
                placeholder="Nhập mô tả chi tiết sự kiện... (hỗ trợ định dạng văn bản, danh sách, heading...)"
              />
            </div>

            {/* Ngày bắt đầu */}
            <div className="col-md-6">
              <label className="form-label fs-4 fw-bold">Ngày bắt đầu</label>
              <input
                type="date"
                name="start_date"
                className="form-control fs-5"
                value={formData.start_date}
                onChange={handleChange}
              />
            </div>

            {/* Ngày kết thúc */}
            <div className="col-md-6">
              <label className="form-label fs-4 fw-bold">Ngày kết thúc</label>
              <input
                type="date"
                name="end_date"
                className="form-control fs-5"
                value={formData.end_date}
                onChange={handleChange}
              />
            </div>

            {/* Loại sự kiện */}
            <div className="col-md-6">
              <label className="form-label fs-4 fw-bold">Loại sự kiện</label>
              <select
                name="event_type"
                className="form-control fs-5"
                value={formData.event_type}
                onChange={handleChange}
              >
                <option value="OTHER">Khác</option>
                 <option value="CAREER_DAY">Hội chợ việc làm</option>
                 <option value="WORKSHOP">Hội thảo</option>
                 <option value="SEMINAR">Hội thảo chuyên đề</option>
              </select>
            </div>

            {/* Trạng thái */}
            <div className="col-md-6">
              <label className="form-label fs-4 fw-bold">Trạng thái ban đầu</label>
              <select
                name="status"
                className="form-control fs-5"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="PENDING">Chờ duyệt</option>
                <option value="APPROVED">Đã duyệt (đăng ngay)</option>
              </select>
            </div>

            {/* Số vị trí */}
            <div className="col-md-6">
              <label className="form-label fs-4 fw-bold">Số vị trí đã có</label>
              <input
                type="number"
                name="positions_available"
                className="form-control fs-5"
                min="0"
                value={formData.positions_available}
                onChange={handleChange}
              />
            </div>

            {/* Số người tối đa */}
            <div className="col-md-6">
              <label className="form-label fs-4 fw-bold">Số người tham gia tối đa</label>
              <input
                type="number"
                name="max_participants"
                className="form-control fs-5"
                min="1"
                value={formData.max_participants}
                onChange={handleChange}
              />
            </div>

            {/* Địa điểm */}
            <div className="col-12">
              <label className="form-label fs-4 fw-bold">Địa điểm</label>
              <input
                type="text"
                name="location"
                className="form-control fs-5"
                value={formData.location}
                onChange={handleChange}
              />
            </div>

            {/* Kỹ năng yêu cầu */}
            <div className="col-12">
              <label className="form-label fs-4 fw-bold">Kỹ năng yêu cầu</label>
              <input
                type="text"
                name="required_skills"
                className="form-control fs-5"
                placeholder="Ví dụ: Kỹ năng thuyết trình, Làm việc nhóm"
                value={formData.required_skills}
                onChange={handleChange}
              />
            </div>

            {/* Tags */}
            <div className="col-12">
              <label className="form-label fs-4 fw-bold">Thêm tag</label>
              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control fs-5"
                  placeholder="Nhập tag (ví dụ: AI, Frontend)"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                />
                <button type="button" className="btn btn-secondary fs-5" onClick={addTag}>
                  Thêm
                </button>
              </div>
              <div className="d-flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span key={tag} className="badge bg-primary fs-5 px-3 py-2">
                    {tag}
                    <button
                      type="button"
                      className="btn-close btn-close-white ms-2"
                      onClick={() => removeTag(tag)}
                    ></button>
                  </span>
                ))}
              </div>
            </div>

            {/* Submit */}
            <div className="col-12 text-center mt-5">
              <button
                type="submit"
                className="btn btn-danger px-8 py-4 fs-4 me-4"
                disabled={loading}
              >
                {loading ? 'Đang đăng sự kiện...' : 'Đăng sự kiện'}
              </button>
              <Link href="/faculty/events" className="btn btn-secondary px-6 py-4 fs-4">
                Hủy
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}