// app/enterprise/post-event/page.tsx

"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function PostEventPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
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

  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Vui lòng đăng nhập');

      // Lấy enterprise_id từ EnterpriseUser
      const { data: entUser } = await supabase
        .from('EnterpriseUser')
        .select('enterprise_id')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (!entUser) throw new Error('Không tìm thấy doanh nghiệp');

      const res = await fetch('/api/events/post-event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          ...formData,
          enterprise_id: entUser.enterprise_id,
          tags,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'Đăng sự kiện thất bại');
      }

      setSuccess(true);
      setTimeout(() => router.push('/enterprise/events'), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi đăng sự kiện');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="inner-content py-5">
      <div className="container">
        <h2 className="text-center mb-5 fs-2 fw-bold">Đăng sự kiện mới</h2>

        {error && <div className="alert alert-danger text-center">{error}</div>}
        {success && <div className="alert alert-success text-center">Đăng sự kiện thành công! Đang chuyển về danh sách...</div>}

        <form onSubmit={handleSubmit} className="bg-white rounded shadow p-5">
          <div className="row g-4">
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

            <div className="col-12">
              <label className="form-label fs-4 fw-bold">Mô tả sự kiện</label>
              <textarea
                name="description"
                className="form-control fs-5"
                rows={5}
                value={formData.description}
                onChange={handleChange}
              />
            </div>

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

            <div className="col-md-6">
              <label className="form-label fs-4 fw-bold">Loại sự kiện</label>
              <select name="event_type" className="form-control fs-5" value={formData.event_type} onChange={handleChange}>
                <option value="OTHER">Khác</option>
                <option value="CAREER_DAY">Hội chợ việc làm</option>
                <option value="WORKSHOP">Hội thảo</option>
                <option value="SEMINAR">Hội thảo chuyên đề</option>
                {/* Thêm các loại khác */}
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label fs-4 fw-bold">Trạng thái</label>
              <select name="status" className="form-control fs-5" value={formData.status} onChange={handleChange}>
                <option value="PENDING">Đang chờ duyệt</option>
                <option value="APPROVED">Đã duyệt</option>
                <option value="REJECTED">Bị từ chối</option>
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label fs-4 fw-bold">Số vị trí tuyển dụng</label>
              <input
                type="number"
                name="positions_available"
                className="form-control fs-5"
                value={formData.positions_available}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fs-4 fw-bold">Số người tham gia tối đa</label>
              <input
                type="number"
                name="max_participants"
                className="form-control fs-5"
                value={formData.max_participants}
                onChange={handleChange}
              />
            </div>

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

            <div className="col-12">
              <label className="form-label fs-4 fw-bold">Kỹ năng yêu cầu</label>
              <input
                type="text"
                name="required_skills"
                className="form-control fs-5"
                value={formData.required_skills}
                onChange={handleChange}
              />
            </div>

            {/* Tag */}
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
                  <span key={tag} className="badge bg-primary fs-5">
                    {tag}
                    <button type="button" className="btn-close btn-close-white ms-2" onClick={() => removeTag(tag)}></button>
                  </span>
                ))}
              </div>
            </div>

            <div className="col-12 text-center mt-5">
              <button
                type="submit"
                className="btn btn-danger px-8 py-4 fs-4 me-4"
                disabled={loading}
              >
                {loading ? 'Đang đăng sự kiện...' : 'Đăng sự kiện'}
              </button>
              <Link href="/enterprise/events" className="btn btn-secondary px-6 py-4 fs-4">
                Hủy
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}