// app/admin/create-user/page.tsx

"use client";

import { useState } from 'react';

export default function AdminCreateUserPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'STUDENT',
    full_name: '',
    major: '',
    enterprise_name: '',
    industry: '',
    description: '',
    website: '',
    contact_email: '',
    location: '',
    address: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const token = localStorage.getItem('auth_token'); // giả sử bạn lưu token
      if (!token) throw new Error('Chưa đăng nhập');

      const res = await fetch('/api/admin/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.error || 'Tạo tài khoản thất bại');

      setSuccess(true);
      // Reset form
      setFormData({
        email: '',
        password: '',
        role: 'STUDENT',
        full_name: '',
        major: '',
        enterprise_name: '',
        industry: '',
        description: '',
        website: '',
        contact_email: '',
        location: '',
        address: '',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi tạo tài khoản');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="inner-content py-5">
      <div className="container">
        <h2 className="text-center mb-5">Admin - Tạo tài khoản mới</h2>

        {error && <div className="alert alert-danger text-center">{error}</div>}
        {success && <div className="alert alert-success text-center">Tạo tài khoản thành công!</div>}

        <form onSubmit={handleSubmit} className="bg-white rounded shadow p-5">
          <div className="row g-4">
            <div className="col-md-6">
              <label>Email <span className="text-danger">*</span></label>
              <input type="email" name="email" className="form-control" required value={formData.email} onChange={handleChange} disabled={loading} />
            </div>

            <div className="col-md-6">
              <label>Mật khẩu <span className="text-danger">*</span></label>
              <input type="password" name="password" className="form-control" required minLength={6} value={formData.password} onChange={handleChange} disabled={loading} />
            </div>

            <div className="col-md-6">
              <label>Loại tài khoản <span className="text-danger">*</span></label>
              <select name="role" className="form-control" value={formData.role} onChange={handleChange} disabled={loading}>
                <option value="STUDENT">Sinh viên</option>
                <option value="ENTERPRISE">Doanh nghiệp</option>
              </select>
            </div>

            {/* Nếu là Student */}
            {formData.role === 'STUDENT' && (
              <>
                <div className="col-md-6">
                  <label>Họ và tên</label>
                  <input type="text" name="full_name" className="form-control" value={formData.full_name} onChange={handleChange} disabled={loading} />
                </div>
                <div className="col-md-6">
                  <label>Chuyên ngành</label>
                  <input type="text" name="major" className="form-control" value={formData.major} onChange={handleChange} disabled={loading} />
                </div>
              </>
            )}

            {/* Nếu là Enterprise */}
            {formData.role === 'ENTERPRISE' && (
              <>
                <div className="col-md-6">
                  <label>Tên doanh nghiệp <span className="text-danger">*</span></label>
                  <input type="text" name="enterprise_name" className="form-control" required value={formData.enterprise_name} onChange={handleChange} disabled={loading} />
                </div>
                <div className="col-md-6">
                  <label>Ngành nghề</label>
                  <input type="text" name="industry" className="form-control" value={formData.industry} onChange={handleChange} disabled={loading} />
                </div>
                <div className="col-12">
                  <label>Mô tả doanh nghiệp</label>
                  <textarea name="description" className="form-control" rows={3} value={formData.description} onChange={handleChange} disabled={loading} />
                </div>
                <div className="col-md-6">
                  <label>Website</label>
                  <input type="url" name="website" className="form-control" value={formData.website} onChange={handleChange} disabled={loading} />
                </div>
                <div className="col-md-6">
                  <label>Email liên hệ</label>
                  <input type="email" name="contact_email" className="form-control" value={formData.contact_email} onChange={handleChange} disabled={loading} />
                </div>
                <div className="col-md-6">
                  <label>Địa điểm</label>
                  <input type="text" name="location" className="form-control" value={formData.location} onChange={handleChange} disabled={loading} />
                </div>
                <div className="col-md-6">
                  <label>Địa chỉ</label>
                  <input type="text" name="address" className="form-control" value={formData.address} onChange={handleChange} disabled={loading} />
                </div>
              </>
            )}

            <div className="col-12 text-center mt-4">
              <button type="submit" className="btn btn-success px-8 py-3 fs-4" disabled={loading}>
                {loading ? 'Đang tạo...' : 'Tạo tài khoản'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}