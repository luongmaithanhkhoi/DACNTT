// app/register-enterprise/page.tsx

"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterEnterprisePage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    enterprise_name: '',
    industry: '',
    description: '',
    website: '',
    contact_email: '',
    location: '',
    address: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    // Validate cơ bản
    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      setLoading(false);
      return;
    }

    if (!formData.email || !formData.password || !formData.enterprise_name) {
      setError('Vui lòng điền đầy đủ các trường bắt buộc');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/register-enterprise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
          enterprise_name: formData.enterprise_name,
          industry: formData.industry || null,
          description: formData.description || null,
          website: formData.website || null,
          contact_email: formData.contact_email || null,
          location: formData.location || null,
          address: formData.address || null,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'Đăng ký thất bại');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/login?message=register_success');
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi đăng ký');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="inner-content loginWrp py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-9 col-xl-8">
            <div className="text-center mb-5">
              <h1 className="fs-1 fw-bold">Đăng ký tài khoản Doanh nghiệp</h1>
              <p className="fs-4 text-muted mt-3">
                Đăng tin tuyển dụng và tìm kiếm ứng viên phù hợp
              </p>
            </div>

            {error && (
              <div className="alert alert-danger text-center fs-5 mb-4">
                {error}
              </div>
            )}

            {success && (
              <div className="alert alert-success text-center fs-5 mb-4">
                Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.<br />
                Đang chuyển về trang đăng nhập...
              </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white rounded shadow p-5">
              <div className="row g-4">
                {/* Email & Mật khẩu */}
                <div className="col-md-6">
                  <label className="form-label fs-5 fw-bold">
                    Email doanh nghiệp <span className="text-danger">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    className="form-control fs-4"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fs-5 fw-bold">
                    Mật khẩu <span className="text-danger">*</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    className="form-control fs-4"
                    required
                    minLength={6}
                    value={formData.password}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fs-5 fw-bold">
                    Xác nhận mật khẩu <span className="text-danger">*</span>
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    className="form-control fs-4"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>

                {/* Tên doanh nghiệp */}
                <div className="col-md-6">
                  <label className="form-label fs-5 fw-bold">
                    Tên doanh nghiệp <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="enterprise_name"
                    className="form-control fs-4"
                    required
                    value={formData.enterprise_name}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>

                {/* Ngành nghề & Mô tả */}
                <div className="col-md-6">
                  <label className="form-label fs-5 fw-bold">Ngành nghề</label>
                  <input
                    type="text"
                    name="industry"
                    className="form-control fs-4"
                    value={formData.industry}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>

                <div className="col-12">
                  <label className="form-label fs-5 fw-bold">Mô tả doanh nghiệp</label>
                  <textarea
                    name="description"
                    className="form-control fs-4"
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>

                {/* Website & Email liên hệ */}
                <div className="col-md-6">
                  <label className="form-label fs-5 fw-bold">Website</label>
                  <input
                    type="url"
                    name="website"
                    className="form-control fs-4"
                    value={formData.website}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fs-5 fw-bold">Email liên hệ</label>
                  <input
                    type="email"
                    name="contact_email"
                    className="form-control fs-4"
                    value={formData.contact_email}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>

                {/* Địa điểm & Địa chỉ */}
                <div className="col-md-6">
                  <label className="form-label fs-5 fw-bold">Địa điểm chính</label>
                  <input
                    type="text"
                    name="location"
                    className="form-control fs-4"
                    value={formData.location}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fs-5 fw-bold">Địa chỉ công ty</label>
                  <input
                    type="text"
                    name="address"
                    className="form-control fs-4"
                    value={formData.address}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>

                {/* Nút submit */}
                <div className="col-12 text-center mt-5">
                  <button
                    type="submit"
                    className="btn btn-danger px-8 py-3 fs-4 me-4"
                    disabled={loading}
                  >
                    {loading ? 'Đang tạo tài khoản...' : 'Tạo tài khoản doanh nghiệp'}
                  </button>

                  <Link href="/login" className="btn btn-outline-secondary px-6 py-3 fs-4">
                    Quay về đăng nhập
                  </Link>
                </div>

                <div className="col-12 text-center mt-4">
                  <p className="text-muted">
                    Bạn là sinh viên?{' '}
                    <Link href="/register" className="text-primary fw-bold">
                      Đăng ký tài khoản sinh viên
                    </Link>
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}