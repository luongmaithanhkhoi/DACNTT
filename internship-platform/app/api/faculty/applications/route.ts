// app/api/faculty/applications/route.ts

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SVC = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SVC);

function getBearerToken(req: Request): string | null {
  const authHeader = req.headers.get('authorization');
  if (!authHeader) return null;
  const [scheme, token] = authHeader.split(' ');
  return scheme?.toLowerCase() === 'bearer' ? token : null;
}

// Kiểm tra role
async function getUserRole(token: string): Promise<string | null> {
  const authClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });

  const { data: { user } } = await authClient.auth.getUser();
  if (!user) return null;

  const { data: appUser } = await supabaseAdmin
    .from('User')
    .select('role')
    .eq('provider_uid', user.id)
    .single();

  return appUser?.role || null;
}

export async function GET(req: Request) {
  try {
    const token = getBearerToken(req);
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const role = await getUserRole(token);
    if (role !== 'ADMIN' && role !== 'FACULTY') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = 9;
    const offset = (page - 1) * limit;
    const statusFilter = searchParams.get('status'); 

   
    let query = supabaseAdmin
      .from('Application')
      .select('id, status, created_at, student_id, job_id', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (statusFilter && statusFilter !== 'ALL') {
      query = query.eq('status', statusFilter);
    }

    const { data: applications, error: appError, count } = await query;

    if (appError) {
      console.error('Query applications error:', appError);
      throw appError;
    }

    if (!applications || applications.length === 0) {
      return NextResponse.json({
        success: true,
        applications: [],
        pagination: { page, limit, total: count || 0, totalPages: Math.ceil((count || 0) / limit) },
      });
    }

    const studentIds = [...new Set(applications.map(a => a.student_id))];
    const jobIds = [...new Set(applications.map(a => a.job_id))];

    const { data: students } = await supabaseAdmin
      .from('Student')
      .select(`
        user_id,
        full_name,
        major,
        gpa,
        phone,
        location,
        cv_url,
        user:User (
          avatar_url
        )
      `)
      .in('user_id', studentIds);

    const { data: jobs } = await supabaseAdmin
      .from('JobPosting')
      .select(`
        id,
        title,
        enterprise:Enterprise (
          id,
          name
        )
      `)
      .in('id', jobIds);

    // Map dữ liệu
    const studentMap = Object.fromEntries(
      (students || []).map(s => [
        s.user_id,
        {
          id: s.user_id,
          fullName: s.full_name || 'Chưa cập nhật',
          major: s.major || 'Chưa cập nhật',
          gpa: s.gpa || null,
          phone: s.phone || 'Chưa cập nhật',
          location: s.location || 'Chưa cập nhật',
          cv_url: s.cv_url || null,
          avatarUrl: s.user?.avatar_url || '/images/client.jpg',
        }
      ])
    );

    const jobMap = Object.fromEntries(
      (jobs || []).map(j => [
        j.id,
        {
          title: j.title,
          enterpriseName: j.enterprise?.name || 'Doanh nghiệp không xác định',
        }
      ])
    );

    // Format applications
    const formattedApplications = applications.map(a => ({
      id: a.id,
      status: a.status,
      created_at: a.created_at,
      student: studentMap[a.student_id] || null,
      job: jobMap[a.job_id] || { title: 'Công việc không xác định', enterpriseName: 'Unknown' },
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
  } catch (err: any) {
    console.error('Get faculty applications error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Lỗi server nội bộ' },
      { status: 500 }
    );
  }
}