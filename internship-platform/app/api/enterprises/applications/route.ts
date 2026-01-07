// import { NextResponse } from 'next/server';
// import { createClient } from '@supabase/supabase-js';

// const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// const SUPABASE_SVC = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SVC);

// function getBearerToken(req: Request): string | null {
//   const authHeader = req.headers.get('authorization');
//   if (!authHeader) return null;
//   const [scheme, token] = authHeader.split(' ');
//   return scheme?.toLowerCase() === 'bearer' ? token : null;
// }

// async function getEnterpriseId(token: string): Promise<string | null> {
//   const authClient = createClient(SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
//     global: { headers: { Authorization: `Bearer ${token}` } },
//   });

//   const { data: { user } } = await authClient.auth.getUser();
//   if (!user) return null;

//   const { data: appUser } = await supabaseAdmin
//     .from('User')
//     .select('id')
//     .eq('provider_uid', user.id)
//     .single();

//   if (!appUser) return null;

//   const { data: link } = await supabaseAdmin
//     .from('EnterpriseUser')
//     .select('enterprise_id')
//     .eq('user_id', appUser.id)
//     .single();

//   return link?.enterprise_id || null;
// }

// export async function GET(req: Request) {
//   try {

//     const token = getBearerToken(req);
//     if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

//     const enterpriseId = await getEnterpriseId(token);
//     if (!enterpriseId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

//     const { searchParams } = new URL(req.url);
//     const page = parseInt(searchParams.get('page') || '1');
//     const limit = 9;
//     const offset = (page - 1) * limit;

//     // 1. Lấy applications (select phẳng)
//     const statusFilter = searchParams.get('status');
//     const { data: applications, error: appError, count } = await supabaseAdmin
//       .from('Application')
//       .select('id, status, created_at, student_id, job_id', { count: 'exact' })
//       .in('job_id', (
//         await supabaseAdmin
//           .from('JobPosting')
//           .select('id')
//           .eq('enterprise_id', enterpriseId)
//       ).data?.map(j => j.id) || [])
//       .order('created_at', { ascending: false })
//       .range(offset, offset + limit - 1);

//     if (appError) throw appError;
//     if (!applications || applications.length === 0) {
//       return NextResponse.json({
//         success: true,
//         applications: [],
//         pagination: { page, limit, total: 0, totalPages: 0 },
//       });
//     }

//     // 2. Join thủ công Student và JobPosting
//     const studentIds = [...new Set(applications.map(a => a.student_id))];
//     const jobIds = [...new Set(applications.map(a => a.job_id))];

//     const [{ data: students }, { data: jobs }] = await Promise.all([
//       supabaseAdmin
//         .from('Student')
//         .select('user_id, full_name, major, gpa, phone, location')
//         .in('user_id', studentIds),
//       supabaseAdmin
//         .from('JobPosting')
//         .select('id, title')
//         .in('id', jobIds),
//     ]);

//     const studentMap = Object.fromEntries(
//       (students || []).map(s => [s.user_id, {
//         id: s.user_id,
//         fullName: s.full_name || 'Chưa cập nhật',
//         major: s.major || 'Chưa cập nhật',
//         gpa: s.gpa || null,
//         phone: s.phone || 'Chưa cập nhật',
//         location: s.location || 'Chưa cập nhật',
//         avatarUrl: s.avatar_url || '/images/client.jpg',
//       }])
//     );

//     const jobMap = Object.fromEntries(
//       (jobs || []).map(j => [j.id, j.title])
//     );

//     const formattedApplications = applications.map(a => ({
//       id: a.id,
//       status: a.status,
//       created_at: a.created_at,
//       student: studentMap[a.student_id] || null,
//       jobTitle: jobMap[a.job_id] || 'Unknown Job',
//     }));

//     return NextResponse.json({
//       success: true,
//       applications: formattedApplications,
//       pagination: {
//         page,
//         limit,
//         total: count || 0,
//         totalPages: Math.ceil((count || 0) / limit),
//       },
//     });
//   } catch (err) {
//     console.error('Get applications error:', err);
//     return NextResponse.json({ error: 'Server error' }, { status: 500 });
//   }
// }


// app/api/enterprises/applications/route.ts

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

async function getEnterpriseId(token: string): Promise<string | null> {
  const authClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
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

export async function GET(req: Request) {
  try {
    const token = getBearerToken(req);
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const enterpriseId = await getEnterpriseId(token);
    if (!enterpriseId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = 9;
    const offset = (page - 1) * limit;
    const statusFilter = searchParams.get('status'); // ALL, PENDING, ACCEPTED, REJECTED

    // Lấy danh sách job_id của enterprise này
    const { data: jobIdsData } = await supabaseAdmin
      .from('JobPosting')
      .select('id')
      .eq('enterprise_id', enterpriseId);

    const jobIds = jobIdsData?.map(j => j.id) || [];

    if (jobIds.length === 0) {
      return NextResponse.json({
        success: true,
        applications: [],
        pagination: { page, limit, total: 0, totalPages: 0 },
      });
    }

    // Query Application với filter status nếu có
    let query = supabaseAdmin
      .from('Application')
      .select('id, status, created_at, student_id, job_id', { count: 'exact' })
      .in('job_id', jobIds)
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

    // Lấy thông tin Student + User (để lấy avatar_url)
    const studentIds = [...new Set(applications.map(a => a.student_id))];

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

    // Lấy thông tin Job title
    const { data: jobs } = await supabaseAdmin
      .from('JobPosting')
      .select('id, title')
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
      (jobs || []).map(j => [j.id, j.title])
    );

    // Format applications
    const formattedApplications = applications.map(a => ({
      id: a.id,
      status: a.status,
      created_at: a.created_at,
      student: studentMap[a.student_id] || null,
      jobTitle: jobMap[a.job_id] || 'Công việc không xác định',
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
    console.error('Get applications error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Lỗi server nội bộ' },
      { status: 500 }
    );
  }
}