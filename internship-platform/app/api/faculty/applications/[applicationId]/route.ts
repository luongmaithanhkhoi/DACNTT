import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SVC = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SVC);

function getBearerToken(req: Request): string | null {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;
  return authHeader.substring(7);
}

async function getEnterpriseId(token: string): Promise<string | null> {
  const authClient = createClient(SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });

  const { data: { user } } = await authClient.auth.getUser();
  if (!user) return null;

  const { data: appUser } = await supabaseAdmin
    .from('User')
    .select('id')
    .eq('provider_uid', user.id)
    .single();

  if (!appUser) return null;

  const { data: link } = await supabaseAdmin
    .from('EnterpriseUser')
    .select('enterprise_id')
    .eq('user_id', appUser.id)
    .single();

  return link?.enterprise_id || null;
}

export async function PATCH(
  req: Request,
  context: { params: Promise<{ applicationId: string }> }  // ← Chú ý kiểu này
) {
  try {
    const token = getBearerToken(req);
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const enterpriseId = await getEnterpriseId(token);
    if (!enterpriseId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const params = await context.params;
    const applicationId = params.applicationId;

    const { status } = await req.json();

    if (!['ACCEPTED', 'REJECTED'].includes(status)) {
      return NextResponse.json({ error: 'Trạng thái không hợp lệ' }, { status: 400 });
    }

    // Kiểm tra application tồn tại
    const { data: application, error: fetchError } = await supabaseAdmin
      .from('Application')
      .select('job_id')
      .eq('id', applicationId)
      .single();

    if (fetchError || !application) {
      return NextResponse.json({ error: 'Không tìm thấy hồ sơ ứng tuyển' }, { status: 404 });
    }

    const { data: job } = await supabaseAdmin
      .from('JobPosting')
      .select('enterprise_id')
      .eq('id', application.job_id)
      .single();

    if (!job || job.enterprise_id !== enterpriseId) {
      return NextResponse.json({ error: 'Không có quyền' }, { status: 403 });
    }

    // Cập nhật trạng thái
    const { error: updateError } = await supabaseAdmin
      .from('Application')
      .update({ status })
      .eq('id', applicationId);

    if (updateError) throw updateError;

    return NextResponse.json({
      success: true,
      message: status === 'ACCEPTED' ? 'Đã chấp nhận ứng viên' : 'Đã từ chối ứng viên',
    });
  } catch (err) {
    console.error('PATCH application error:', err);
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  }
}