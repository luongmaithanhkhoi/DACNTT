// // app/enterprise/edit-profile/page.tsx

// "use client";

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';
// import { createClient } from '@supabase/supabase-js';

// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
// );

// export default function EditEnterpriseProfilePage() {
//   const router = useRouter();

//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState(false);

//   const [formData, setFormData] = useState({
//     name: '',
//     description: '',
//     industry: '',
//     website: '',
//     contact_email: '',
//     location: '',
//     address: '',
//     image_url: '/images/client.jpg',
//   });

//   const [logoFile, setLogoFile] = useState<File | null>(null);
//   const [logoPreview, setLogoPreview] = useState<string>('/images/client.jpg');

//   // Load profile hiện tại
//   useEffect(() => {
//     const loadProfile = async () => {
//       try {
//         const { data: { session } } = await supabase.auth.getSession();
//         if (!session) {
//           router.push('/login');
//           return;
//         }

//         const res = await fetch('/api/enterprises/me', {
//           headers: { Authorization: `Bearer ${session.access_token}` },
//         });

//         if (!res.ok) throw new Error('Không thể tải thông tin doanh nghiệp');

//         const json = await res.json();
//         const enterprise = json.enterprise;

//         const data = {
//           name: enterprise.name || '',
//           description: enterprise.description || '',
//           industry: enterprise.industry || '',
//           website: enterprise.website || '',
//           contact_email: enterprise.contact_email || '',
//           location: enterprise.location || '',
//           address: enterprise.address || '',
//           image_url: enterprise.image_url || '/images/client.jpg',
//         };

//         setFormData(data);
//         setLogoPreview(data.image_url);
//       } catch (err) {
//         setError('Không thể tải thông tin doanh nghiệp');
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadProfile();
//   }, [router]);

//   // Preview logo
//   const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setLogoFile(file);
//       setLogoPreview(URL.createObjectURL(file));
//     }
//   };

//   // Upload logo lên Storage
//   const uploadLogo = async (enterpriseId: string): Promise<string | null> => {
//     if (!logoFile) return null;

//     const fileExt = logoFile.name.split('.').pop();
//     const fileName = `${enterpriseId}/logo.${fileExt}`;

//     const { error } = await supabase.storage
//       .from('enterprise-logos')
//       .upload(fileName, logoFile, { upsert: true });

//     if (error) {
//       console.error('Upload logo error:', error);
//       return null;
//     }

//     const { data: { publicUrl } } = supabase.storage
//       .from('enterprise-logos')
//       .getPublicUrl(fileName);

//     return publicUrl;
//   };

//   // Submit form
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setSaving(true);
//     setError(null);
//     setSuccess(false);

//     try {
//       const { data: { session } } = await supabase.auth.getSession();
//       if (!session) throw new Error('Không có session');

//       // Lấy enterprise_id
//       const meRes = await fetch('/api/enterprises/me', {
//         headers: { Authorization: `Bearer ${session.access_token}` },
//       });
//       const meJson = await meRes.json();
//       const enterpriseId = meJson.enterprise.id;

//       // Upload logo nếu có
//       let newLogoUrl = formData.image_url;
//       if (logoFile) {
//         newLogoUrl = await uploadLogo(enterpriseId) || newLogoUrl;
//       }

//       // Gọi API update
//       const res = await fetch('/api/enterprises/me', {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${session.access_token}`,
//         },
//         body: JSON.stringify({
//           name: formData.name,
//           description: formData.description,
//           industry: formData.industry,
//           website: formData.website,
//           contact_email: formData.contact_email,
//           location: formData.location,
//           address: formData.address,
//           image_url: newLogoUrl,
//         }),
//       });

//       if (!res.ok) {
//         const errJson = await res.json();
//         throw new Error(errJson.error || 'Cập nhật thất bại');
//       }

//       setSuccess(true);
//       setTimeout(() => router.push('/enterprise/profile'), 2000);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Lỗi khi cập nhật');
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (loading) return <div className="text-center py-20 fs-4">Đang tải thông tin doanh nghiệp...</div>;

//   return (
//     <div className="inner-content py-5">
//       <div className="container">
//         <h2 className="text-center mb-5 fs-2 fw-bold">Chỉnh sửa thông tin doanh nghiệp</h2>

//         {error && <div className="alert alert-danger text-center fs-4">{error}</div>}
//         {success && <div className="alert alert-success text-center fs-4">Cập nhật thành công! Đang chuyển về profile...</div>}

//         <form onSubmit={handleSubmit} className="bg-white rounded shadow p-5">
//           {/* Logo */}
//           <div className="text-center mb-5">
//             <div className="d-flex justify-content-center">
//                 <img
//               src={logoPreview}
//               alt="Logo doanh nghiệp"
//               className="rounded mb-4"
//               style={{ width: 200, height: 200, objectFit: 'contain', border: '1px solid #ddd' }}
//             />
//             </div>
//             <div>
//               <label className="btn btn-secondary fs-5 px-6 py-3">
//                 Chọn logo mới
//                 <input type="file" accept="image/*" onChange={handleLogoChange} hidden />
//               </label>
//             </div>
//           </div>

//           <div className="row g-4">
//             <div className="col-12">
//               <label className="form-label fs-4 fw-bold">Tên doanh nghiệp *</label>
//               <input
//                 type="text"
//                 className="form-control fs-5"
//                 required
//                 value={formData.name}
//                 onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//               />
//             </div>

//             <div className="col-12">
//               <label className="form-label fs-4 fw-bold">Mô tả doanh nghiệp</label>
//               <textarea
//                 className="form-control fs-5"
//                 rows={5}
//                 value={formData.description}
//                 onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//               />
//             </div>

//             <div className="col-md-6">
//               <label className="form-label fs-4 fw-bold">Ngành nghề</label>
//               <input
//                 type="text"
//                 className="form-control fs-5"
//                 value={formData.industry}
//                 onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
//               />
//             </div>

//             <div className="col-md-6">
//               <label className="form-label fs-4 fw-bold">Website</label>
//               <input
//                 type="url"
//                 className="form-control fs-5"
//                 value={formData.website}
//                 onChange={(e) => setFormData({ ...formData, website: e.target.value })}
//               />
//             </div>

//             <div className="col-md-6">
//               <label className="form-label fs-4 fw-bold">Email liên hệ</label>
//               <input
//                 type="email"
//                 className="form-control fs-5"
//                 value={formData.contact_email}
//                 onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
//               />
//             </div>

//             <div className="col-md-6">
//               <label className="form-label fs-4 fw-bold">Địa điểm</label>
//               <input
//                 type="text"
//                 className="form-control fs-5"
//                 value={formData.location}
//                 onChange={(e) => setFormData({ ...formData, location: e.target.value })}
//               />
//             </div>

//             <div className="col-12">
//               <label className="form-label fs-4 fw-bold">Địa chỉ</label>
//               <input
//                 type="text"
//                 className="form-control fs-5"
//                 value={formData.address}
//                 onChange={(e) => setFormData({ ...formData, address: e.target.value })}
//               />
//             </div>

//             <div className="col-12 text-center mt-5">
//               <button
//                 type="submit"
//                 className="btn btn-danger px-8 py-4 fs-4 me-4"
//                 disabled={saving}
//               >
//                 {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
//               </button>
//               <Link href="/enterprise/profile" className="btn btn-secondary px-6 py-4 fs-4">
//                 Hủy
//               </Link>
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   );

// }


"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function EditEnterpriseProfilePage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    industry: '',
    website: '',
    contact_email: '',
    location: '',
    address: '',
    image_url: '/images/client.jpg',
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('/images/client.jpg');
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push('/login');
          return;
        }

        const res = await fetch('/api/enterprises/me', {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });

        if (!res.ok) throw new Error('Không thể tải thông tin doanh nghiệp');

        const json = await res.json();
        const enterprise = json.enterprise;

        const data = {
          name: enterprise.name || '',
          description: enterprise.description || '',
          industry: enterprise.industry || '',
          website: enterprise.website || '',
          contact_email: enterprise.contact_email || '',
          location: enterprise.location || '',
          address: enterprise.address || '',
          image_url: enterprise.image_url || '/images/client.jpg',
        };

        setFormData(data);
        setLogoPreview(data.image_url);
      } catch (err) {
        setError('Không thể tải thông tin doanh nghiệp');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [router]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const uploadLogoViaAPI = async (
    file: File, 
    token: string
  ): Promise<string | null> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'logo');

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);
    setUploadProgress(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Không có session');

      let newLogoUrl = formData.image_url;

      if (logoFile) {
        setUploadProgress('Đang tải logo...');
        newLogoUrl = await uploadLogoViaAPI(logoFile, session.access_token) || newLogoUrl;
      }

      setUploadProgress('Đang cập nhật thông tin...');

      const res = await fetch('/api/enterprises/me', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          industry: formData.industry,
          website: formData.website,
          contact_email: formData.contact_email,
          location: formData.location,
          address: formData.address,
          image_url: newLogoUrl,
        }),
      });

      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.error || 'Cập nhật thất bại');
      }

      setSuccess(true);
      setUploadProgress(null);
      setTimeout(() => router.push('/enterprises/dashboard'), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi cập nhật');
      setUploadProgress(null);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-20 fs-4">Đang tải thông tin doanh nghiệp...</div>;

  return (
    <div className="inner-content py-5">
      <div className="container">
        <h2 className="text-center mb-5 fs-2 fw-bold">Chỉnh sửa thông tin doanh nghiệp</h2>

        {error && <div className="alert alert-danger text-center fs-4">{error}</div>}
        {success && <div className="alert alert-success text-center fs-4">Cập nhật thành công! Đang chuyển về profile...</div>}
        {uploadProgress && <div className="alert alert-info text-center fs-4">{uploadProgress}</div>}

        <form onSubmit={handleSubmit} className="bg-white rounded shadow p-5">
          <div className="text-center mb-5">
            <div className="d-flex justify-content-center">
              <img
                src={logoPreview}
                alt="Logo doanh nghiệp"
                className="rounded mb-4"
                style={{ width: 200, height: 200, objectFit: 'contain', border: '1px solid #ddd' }}
              />
            </div>
            <div>
              <label className="btn btn-secondary fs-5 px-6 py-3">
                Chọn logo mới
                <input type="file" accept="image/*" onChange={handleLogoChange} hidden />
              </label>
            </div>
          </div>

          <div className="row g-4">
            <div className="col-12">
              <label className="form-label fs-4 fw-bold">Tên doanh nghiệp *</label>
              <input
                type="text"
                className="form-control fs-5"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="col-12">
              <label className="form-label fs-4 fw-bold">Mô tả doanh nghiệp</label>
              <textarea
                className="form-control fs-5"
                rows={5}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fs-4 fw-bold">Ngành nghề</label>
              <input
                type="text"
                className="form-control fs-5"
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fs-4 fw-bold">Website</label>
              <input
                type="url"
                className="form-control fs-5"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fs-4 fw-bold">Email liên hệ</label>
              <input
                type="email"
                className="form-control fs-5"
                value={formData.contact_email}
                onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fs-4 fw-bold">Địa điểm</label>
              <input
                type="text"
                className="form-control fs-5"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>

            <div className="col-12">
              <label className="form-label fs-4 fw-bold">Địa chỉ</label>
              <input
                type="text"
                className="form-control fs-5"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>

            <div className="col-12 text-center mt-5">
              <button
                type="submit"
                className="btn btn-danger px-8 py-4 fs-4 me-4"
                disabled={saving}
              >
                {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
              </button>
              <Link href="/enterprises/dashboard" className="btn btn-secondary px-6 py-4 fs-4">
                Hủy
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}