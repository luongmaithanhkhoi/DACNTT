"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Skill {
  id: string;
  name: string;
}

interface StudentSkill {
  skill_id: string;
  level: number;
}

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
    avatar_url: '/images/client.jpg',
    cv_url: '',
  });

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('/images/client.jpg');
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);

  // Kỹ năng
  const [allSkills, setAllSkills] = useState<Skill[]>([]);
  const [studentSkills, setStudentSkills] = useState<StudentSkill[]>([]);
  const [selectedSkillId, setSelectedSkillId] = useState<string>('');

  // Load profile + skills
  useEffect(() => {
    const loadData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push('/login');
          return;
        }

        // Load profile
        const profileRes = await fetch('/api/students/me', {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        if (!profileRes.ok) throw new Error('Không thể tải profile');

        const profileJson = await profileRes.json();
        const profile = profileJson.profile;

        setFormData({
          full_name: profile.full_name || '',
          major: profile.major || '',
          gpa: profile.gpa?.toString() || '',
          summary: profile.summary || '',
          phone: profile.phone || '',
          location: profile.location || '',
          portfolio_url: profile.portfolio_url || '',
          avatar_url: profile.avatar_url || '/images/client.jpg',
          cv_url: profile.cv_url || '',
        });
        setAvatarPreview(profile.avatar_url || '/images/client.jpg');

        // Load tất cả skills
        const skillsRes = await fetch('/api/skills');
        if (skillsRes.ok) {
          const skillsJson = await skillsRes.json();
          setAllSkills(skillsJson.data || skillsJson || []);
        }

        // Load kỹ năng hiện tại của student
        if (profileJson.skills && Array.isArray(profileJson.skills)) {
          setStudentSkills(profileJson.skills.map((s: any) => ({
            skill_id: s.id || s.skill_id,
            level: s.level || 1,
          })));
        }
      } catch (err) {
        setError('Không thể tải thông tin profile');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [router]);

  // Preview avatar
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  // Chọn CV
  const handleCvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setCvFile(file);
    } else {
      alert('Vui lòng chọn file PDF');
    }
  };

  // ✅ Upload qua API (thay thế uploadFile cũ)
  const uploadFileViaAPI = async (
    file: File, 
    type: 'avatar' | 'cv', 
    token: string
  ): Promise<string | null> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!res.ok) {
      const error = await res.json();
      console.error('Upload error:', error);
      return null;
    }

    const result = await res.json();
    return result.url;
  };

  // Thêm kỹ năng
  const addSkill = () => {
    if (!selectedSkillId) return;

    const existing = studentSkills.find(s => s.skill_id === selectedSkillId);
    if (existing) {
      setStudentSkills(prev => prev.map(s => 
        s.skill_id === selectedSkillId ? { ...s, level: 3 } : s
      ));
    } else {
      setStudentSkills(prev => [...prev, { skill_id: selectedSkillId, level: 3 }]);
    }
    setSelectedSkillId('');
  };

  // Cập nhật level hoặc xóa
  const updateSkillLevel = (skillId: string, level: number) => {
    if (level === 0) {
      setStudentSkills(prev => prev.filter(s => s.skill_id !== skillId));
    } else {
      setStudentSkills(prev => prev.map(s => 
        s.skill_id === skillId ? { ...s, level } : s
      ));
    }
  };

  // ✅ Submit với API upload mới
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);
    setUploadProgress(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Không có session');

      let newAvatarUrl = formData.avatar_url;
      let newCvUrl = formData.cv_url;

      // Upload avatar qua API
      if (avatarFile) {
        setUploadProgress('Đang tải ảnh đại diện...');
        newAvatarUrl = await uploadFileViaAPI(avatarFile, 'avatar', session.access_token) || newAvatarUrl;
      }

      // Upload CV qua API
      if (cvFile) {
        setUploadProgress('Đang tải CV...');
        newCvUrl = await uploadFileViaAPI(cvFile, 'cv', session.access_token) || newCvUrl;
      }

      setUploadProgress('Đang cập nhật thông tin...');

      // Update profile
      const profileRes = await fetch('/api/students/me', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          full_name: formData.full_name,
          major: formData.major,
          gpa: formData.gpa,
          summary: formData.summary,
          phone: formData.phone,
          location: formData.location,
          portfolio_url: formData.portfolio_url,
          avatar_url: newAvatarUrl,
          cv_url: newCvUrl,
        }),
      });

      if (!profileRes.ok) {
        const err = await profileRes.json();
        throw new Error(err.error || 'Cập nhật profile thất bại');
      }

      // Update skills
      const skillsRes = await fetch('/api/students/me/skills', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ skills: studentSkills }),
      });

      if (!skillsRes.ok) {
        const err = await skillsRes.json();
        throw new Error(err.error || 'Cập nhật kỹ năng thất bại');
      }

      setSuccess(true);
      setUploadProgress(null);
      setTimeout(() => router.push('/profile'), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi cập nhật');
      setUploadProgress(null);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-center py-10 fs-4">Đang tải...</p>;

  return (
    <div className="inner-content loginWrp py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <h2 className="text-center mb-5 fs-2 fw-bold">Chỉnh sửa Profile</h2>

            {error && <div className="alert alert-danger text-center fs-4">{error}</div>}
            {success && <div className="alert alert-success text-center fs-4">Cập nhật thành công! Đang chuyển về profile...</div>}
            {uploadProgress && <div className="alert alert-info text-center fs-4">{uploadProgress}</div>}

            <form onSubmit={handleSubmit}>
              {/* Avatar */}
              <div className="text-center mb-5">
                 <div className="d-flex justify-content-center">
                    <img
                  src={avatarPreview}
                  alt="Avatar"
                  className="rounded-circle mb-4"
                  style={{ width: 180, height: 180, objectFit: 'cover' }}
                />
                 </div>
               
                <div>
                  <label className="btn btn-secondary fs-5 px-6 py-3">
                    Chọn ảnh đại diện
                    <input type="file" accept="image/*" onChange={handleAvatarChange} hidden />
                  </label>
                </div>
              </div>

              {/* Upload CV */}
              <div className="mb-5">
                <label className="form-label fs-4 fw-bold">Tải lên CV mới (PDF)</label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleCvChange}
                  className="form-control fs-5"
                />
                {formData.cv_url && (
                  <div className="mt-3">
                    <a href={formData.cv_url} target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary fs-5">
                      📄 Xem CV hiện tại
                    </a>
                  </div>
                )}
              </div>

              {/* Các field profile */}
              <div className="row g-4 mb-5">
                <div className="col-md-6">
                  <label className="form-label fs-4">Họ và tên</label>
                  <input
                    type="text"
                    className="form-control fs-5"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fs-4">Chuyên ngành</label>
                  <input
                    type="text"
                    className="form-control fs-5"
                    value={formData.major}
                    onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fs-4">GPA</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="4"
                    className="form-control fs-5"
                    value={formData.gpa}
                    onChange={(e) => setFormData({ ...formData, gpa: e.target.value })}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fs-4">Số điện thoại</label>
                  <input
                    type="text"
                    className="form-control fs-5"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div className="col-12">
                  <label className="form-label fs-4">Địa chỉ</label>
                  <input
                    type="text"
                    className="form-control fs-5"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>

                <div className="col-12">
                  <label className="form-label fs-4">Giới thiệu bản thân</label>
                  <textarea
                    className="form-control fs-5"
                    rows={5}
                    value={formData.summary}
                    onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  />
                </div>

                <div className="col-12">
                  <label className="form-label fs-4">Portfolio (link)</label>
                  <input
                    type="url"
                    className="form-control fs-5"
                    value={formData.portfolio_url}
                    onChange={(e) => setFormData({ ...formData, portfolio_url: e.target.value })}
                  />
                </div>
              </div>

              {/* PHẦN KỸ NĂNG */}
              <div className="mb-5">
                <h3 className="fs-3 fw-bold mb-4">Kỹ năng của bạn</h3>

                {/* Thêm kỹ năng mới */}
                <div className="input-group mb-4">
                  <select
                    className="form-control fs-5"
                    value={selectedSkillId}
                    onChange={(e) => setSelectedSkillId(e.target.value)}
                  >
                    <option value="">-- Chọn kỹ năng để thêm --</option>
                    {allSkills
                      .filter(skill => !studentSkills.some(s => s.skill_id === skill.id))
                      .map(skill => (
                        <option key={skill.id} value={skill.id}>
                          {skill.name}
                        </option>
                      ))}
                  </select>
                  <button
                    type="button"
                    className="btn btn-primary fs-5 px-5"
                    onClick={addSkill}
                  >
                    Thêm
                  </button>
                </div>

                {/* Danh sách kỹ năng hiện tại */}
                {studentSkills.length === 0 ? (
                  <p className="text-muted fs-5">Chưa có kỹ năng nào. Hãy thêm kỹ năng để doanh nghiệp dễ tìm thấy bạn!</p>
                ) : (
                  <div className="row g-4">
                    {studentSkills.map(s => {
                      const skill = allSkills.find(sk => sk.id === s.skill_id);
                      if (!skill) return null;

                      return (
                        <div key={s.skill_id} className="col-md-6 col-lg-4">
                          <div className="bg-light rounded shadow-sm p-4 d-flex justify-content-between align-items-center">
                            <div>
                              <h5 className="mb-1">{skill.name}</h5>
                              <small className="text-muted">Level {s.level}/3</small>
                            </div>
                            <select
                              className="form-select form-select-sm w-auto"
                              value={s.level}
                              onChange={(e) => updateSkillLevel(s.skill_id, parseInt(e.target.value))}
                            >
                              <option value={1}>1 - Cơ bản</option>
                              <option value={2}>2 - Biết sử dụng</option>
                              <option value={3}>3 - Thành thạo</option>
                              <option value={0}>Xóa</option>
                            </select>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Nút submit */}
              <div className="text-center mt-5">
                <button
                  type="submit"
                  className="btn btn-danger px-8 py-4 fs-4 me-4"
                  disabled={saving}
                >
                  {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
                <Link href="/profile" className="btn btn-secondary px-6 py-4 fs-4">
                  Hủy
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}