import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SVC = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SVC);

function getBearerToken(req: Request): string | null {
  const authHeader = req.headers.get('authorization');
  if (!authHeader) return null;
  const [scheme, token] = authHeader.split(' ');
  return scheme?.toLowerCase() === 'bearer' ? token : null;
}

export async function GET(req: Request) {
  try {
    const token = getBearerToken(req);
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = 10; // Số lượng items mỗi trang
    const offset = (page - 1) * limit;

    // Lấy danh sách applications
    const { data: applications, error: appError, count } = await supabaseAdmin
      .from('Application')
      .select('id, status, created_at, student_id, job_id', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (appError) throw appError;

    if (!applications || applications.length === 0) {
      return NextResponse.json({
        success: true,
        applications: [],
        pagination: { page, limit, total: 0, totalPages: 0 },
      });
    }

    // Lấy thông tin của student và job cho từng application
    const studentIds = [...new Set(applications.map((a) => a.student_id))];
    const jobIds = [...new Set(applications.map((a) => a.job_id))];

    const [{ data: students }, { data: jobs }] = await Promise.all([
      supabaseAdmin
        .from('Student')
        .select('user_id, full_name, major, gpa, phone, location')
        .in('user_id', studentIds),
      supabaseAdmin.from('JobPosting').select('id, title').in('id', jobIds),
    ]);

    const studentMap = Object.fromEntries(
      (students || []).map((s) => [
        s.user_id,
        {
          id: s.user_id,
          fullName: s.full_name || 'Chưa cập nhật',
          major: s.major || 'Chưa cập nhật',
          gpa: s.gpa || null,
          phone: s.phone || 'Chưa cập nhật',
          location: s.location || 'Chưa cập nhật',
        },
      ])
    );

    const jobMap = Object.fromEntries((jobs || []).map((j) => [j.id, j.title]));

    const formattedApplications = applications.map((a) => ({
      id: a.id,
      status: a.status,
      created_at: a.created_at,
      student: studentMap[a.student_id] || null,
      jobTitle: jobMap[a.job_id] || 'Unknown Job',
    }));

    return NextResponse.json({
      success: true,
      applications: formattedApplications,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (err) {
    console.error('Get applications error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
