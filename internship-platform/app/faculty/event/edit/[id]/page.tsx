// app/admin/events/edit/[id]/page.tsx

"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import RichTextEditor from "../../../../post-job/RichTextEditor";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function EditEventPage() {
  const router = useRouter();
  const { id } = useParams(); // Lấy ID sự kiện từ URL

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [role, setRole] = useState<string | null>(null);

  // State cho form
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
  });

  const [descriptionHtml, setDescriptionHtml] = useState<string>(''); // Riêng cho rich text
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  // Kiểm tra role khi mount
  useEffect(() => {
    const savedRole = localStorage.getItem('user_role');
    setRole(savedRole);

    if (savedRole !== 'ADMIN') {
      setError('Chỉ admin mới được chỉnh sửa sự kiện.');
      setLoading(false);
      return;
    }

    // Load dữ liệu sự kiện
    const fetchEvent = async () => {
      try {
        const { data: event, error } = await supabase
          .from('Event')
          .select(`
            *,
            tags:EventTag(tag:Tag(name))
          `)
          .eq('id', id)
          .single();

        if (error || !event) throw new Error('Không tìm thấy sự kiện');

        setFormData({
          title: event.title || '',
          description: event.description || '',
          start_date: event.start_date ? event.start_date.split('T')[0] : '',
          end_date: event.end_date ? event.end_date.split('T')[0] : '',
          event_type: event.event_type || 'OTHER',
          status: event.status || 'PENDING',
          positions_available: event.positions_available?.toString() || '',
          max_participants: event.max_participants?.toString() || '',
          location: event.location || '',
          required_skills: event.required_skills || '',
        });

        setDescriptionHtml(event.description || '');
        setTags(event.tags?.map((t: any) => t.tag.name) || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Lỗi tải sự kiện');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
    setSaving(true);
    setError(null);
    setSuccess(false);

    if (role !== 'ADMIN') {
      setError('Chỉ admin mới được chỉnh sửa sự kiện.');
      setSaving(false);
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Vui lòng đăng nhập');

      const payload = {
        ...formData,
        description: descriptionHtml, // HTML từ RichTextEditor
        tags,
      };

      const res = await fetch(`/api/events/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'Cập nhật sự kiện thất bại');
      }

      setSuccess(true);
      setTimeout(() => router.push('/faculty/jobs'), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi cập nhật sự kiện');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-20 fs-4">Đang tải sự kiện...</div>;

  if (role !== 'ADMIN') {
    return (
      <div className="inner-content py-5">
        <div className="container text-center">
          <p className="text-danger fs-3">Chỉ admin mới được truy cập trang này.</p>
          <Link href="/login" className="btn btn-primary mt-4">Đăng nhập lại</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="inner-content py-5">
      <div className="container">
        <h1 className="text-center mb-5 fs-2 fw-bold">Chỉnh sửa sự kiện</h1>

        {error && <div className="alert alert-danger text-center fs-4">{error}</div>}
        {success && <div className="alert alert-success text-center fs-4">
          Cập nhật sự kiện thành công! Đang chuyển về danh sách...
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
                onChange={setDescriptionHtml}
                placeholder="Nhập mô tả chi tiết sự kiện... (hỗ trợ định dạng văn bản)"
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
              <select name="event_type" className="form-control fs-5" value={formData.event_type} onChange={handleChange}>
                <option value="OTHER">Khác</option>
                <option value="CAREER_DAY">Hội chợ việc làm</option>
                <option value="WORKSHOP">Hội thảo</option>
                <option value="SEMINAR">Hội thảo chuyên đề</option>
                <option value="CONFERENCE">Hội nghị</option>
                <option value="COMPETITION">Cuộc thi</option>
              </select>
            </div>

            {/* Trạng thái */}
            <div className="col-md-6">
              <label className="form-label fs-4 fw-bold">Trạng thái</label>
              <select name="status" className="form-control fs-5" value={formData.status} onChange={handleChange}>
                <option value="PENDING">Chờ duyệt</option>
                <option value="APPROVED">Đã duyệt</option>
                <option value="REJECTED">Từ chối</option>
                <option value="CLOSED">Đóng</option>
              </select>
            </div>

            {/* Các trường số */}
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
                value={formData.required_skills}
                onChange={handleChange}
              />
            </div>

            {/* Tags */}
            <div className="col-12">
              <label className="form-label fs-4 fw-bold">Tags</label>
              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control fs-5"
                  placeholder="Nhập tag mới"
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
                    />
                  </span>
                ))}
              </div>
            </div>

            {/* Submit */}
            <div className="col-12 text-center mt-5">
              <button
                type="submit"
                className="btn btn-danger px-8 py-4 fs-4 me-4"
                disabled={saving}
              >
                {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
              </button>
              <Link href="/faculty/jobs" className="btn btn-secondary px-6 py-4 fs-4">
                Hủy
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}