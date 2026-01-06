
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function EditProfilePage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    full_name: '',
    major: '',
    gpa: '',
    summary: '',
    phone: '',
    location: '',
    portfolio_url: '',
    avatar_url: '/images/client.jpg', // default
  });

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('/images/client.jpg');

  // Load profile hiện tại
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push('/login');
          return;
        }

        const res = await fetch('/api/students/me', {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });

        if (!res.ok) throw new Error('Không thể tải profile');

        const json = await res.json();
        const profile = json.profile;

        setFormData({
          full_name: profile.full_name || '',
          major: profile.major || '',
          gpa: profile.gpa?.toString() || '',
          summary: profile.summary || '',
          phone: profile.phone || '',
          location: profile.location || '',
          portfolio_url: profile.portfolio_url || '',
          avatar_url: profile.avatar_url || '/images/client.jpg',
        });

        setPreviewUrl(profile.avatar_url || '/images/client.jpg');
      } catch (err) {
        setError('Không thể tải thông tin profile');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [router]);

  // Preview ảnh khi chọn file
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Upload avatar lên Supabase Storage
  const uploadAvatar = async (studentId: string): Promise<string | null> => {
    if (!avatarFile) return null;

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return null;

    const fileExt = avatarFile.name.split('.').pop();
    const fileName = `${studentId}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('avatars') // Tên bucket – tạo bucket tên avatars trong Supabase Storage
      .upload(fileName, avatarFile, { upsert: true });

    if (error) {
      console.error('Upload avatar error:', error);
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName);

    return publicUrl;
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Không có session');

      // Upload avatar nếu có
      let avatarUrl = formData.avatar_url;
      if (avatarFile) {
        // Lấy student_id từ API me (hoặc lưu tạm từ load profile)
        const meRes = await fetch('/api/students/me', {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        const meJson = await meRes.json();
        const newAvatarUrl = await uploadAvatar(meJson.profile.user_id);
        if (newAvatarUrl) avatarUrl = newAvatarUrl;
      }

      // Update profile
      const updateData: any = {
        full_name: formData.full_name || null,
        major: formData.major || null,
        gpa: formData.gpa ? parseFloat(formData.gpa) : null,
        summary: formData.summary || null,
        phone: formData.phone || null,
        location: formData.location || null,
        portfolio_url: formData.portfolio_url || null,
      };

      if (avatarUrl !== formData.avatar_url) {
        // Cập nhật cả avatar_url trong bảng User (nếu bạn lưu ở bảng User)
        await fetch('/api/students/me', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ ...updateData, avatar_url: avatarUrl }),
        });
      } else {
        await fetch('/api/students/me', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify(updateData),
        });
      }

      setSuccess(true);
      setTimeout(() => router.push('/profile'), 2000);
    } catch (err) {
      setError('Cập nhật profile thất bại');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-center py-10">Đang tải...</p>;

  return (
    <div className="inner-content loginWrp">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <h2 className="text-center mb-4">Chỉnh sửa Profile</h2>

            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">Cập nhật thành công.</div>}

            <form onSubmit={handleSubmit}>
              {/* Avatar */}
              <div className="text-center mb-4 justify-content-center">
                <div className="justify-content-center d-flex">
                     <img
                  src={previewUrl}
                  alt="Avatar"
                  className="rounded-circle  "
                  style={{ width: 150, height: 150, objectFit: 'cover' }}
                />

                </div>
               
                <div className="mt-3">
                  <label className="btn btn-secondary fs-5">
                    Chọn ảnh mới
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      hidden
                    />
                  </label>
                </div>
              </div>

              <div className="row g-3">
                <div className="col-md-6 fs-4">
                  <label htmlFor="email" className="form-label">Họ và tên</label>
                  <input 
                    id="email"
                    type="text"
                    className="form-control fs-5"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  />
                </div>

                <div className="col-md-6 fs-4">
                  <label htmlFor="major" className="form-label">Chuyên ngành</label>
                  <input  id="major"
                    type="text"
                    className="form-control fs-5"
                    value={formData.major}
                    onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                  />
                </div>

                <div className="col-md-6 fs-4">
                  <label  htmlFor="gpa" className="form-label">GPA</label>
                  <input
                  id = "gpa"
                    type="number"
                    step="0.1"
                    min="0"
                    max="4"
                    className="form-control fs-5"
                    value={formData.gpa}
                    onChange={(e) => setFormData({ ...formData, gpa: e.target.value })}
                  />
                </div>

                <div className="col-md-6 fs-4">
                  <label htmlFor="phone" className="form-label">Số điện thoại</label>
                  <input
                  id="phone"
                    type="text"
                    className="form-control fs-5"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div className="col-12 fs-4">
                  <label htmlFor="address" className="form-label">Địa chỉ</label>
                  <input
                  id="address"
                    type="text"
                    className="form-control fs-5"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>

                <div className="col-12 fs-4">
                  <label htmlFor="info" className="form-label">Giới thiệu bản thân</label>
                  <textarea
                  id="info"
                    className="form-control fs-5"
                    rows={5}
                    value={formData.summary}
                    onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  />
                </div>

                <div className="col-12 fs-4">
                  <label htmlFor="link" className="form-label">Portfolio (link)</label>
                  <input
                  id="link"
                    type="url"
                    className="form-control fs-5"
                    value={formData.portfolio_url}
                    onChange={(e) => setFormData({ ...formData, portfolio_url: e.target.value })}
                  />
                </div>

                <div className="col-12 text-center mt-4">
                  <button
                    type="submit"
                    className="btn btn-danger px-8 py-3 fs-4"
                    disabled={saving}
                  >
                    {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                  </button>
                  <Link href="/profile" className="btn btn-secondary ms-3 px-6 py-3 fs-4">
                    Hủy
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}