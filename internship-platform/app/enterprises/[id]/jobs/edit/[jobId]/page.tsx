import { notFound, redirect } from 'next/navigation';
import PostJobForm from './PostJobForm'; // Form chung (sẽ tái sử dụng)

async function fetchJobForEdit(id: string, jobId: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/enterprises/${id}/jobs/${jobId}`, {
    cache: 'no-store',
  });

  if (!res.ok) throw new Error('Không thể tải dữ liệu công việc');

  const result = await res.json();
  if (!result.success) throw new Error(result.error);

  return result.data;
}

export default async function EditJobPage({
  params,
}: {
  params: Promise<{ id: string; jobId: string }>;
}) {
  const { id, jobId } = await params;

  let job = null;
  let error = null;

  try {
    job = await fetchJobForEdit(id, jobId);
  } catch (err) {
    error = err instanceof Error ? err.message : 'Lỗi tải dữ liệu';
  }

  if (!job) {
    notFound();
  }

  return (
    <>
      <div className="inner-heading">
        <div className="container">
          <h3>Chỉnh sửa công việc</h3>
        </div>
      </div>

      <div className="inner-content loginWrp">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="login p-8 bg-white rounded shadow-sm">
                {error && <p className="text-red-600 text-center">{error}</p>}
                {!error && job && (
                  <PostJobForm initialData={job} enterpriseId={id} isEdit={true} jobId={jobId} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}