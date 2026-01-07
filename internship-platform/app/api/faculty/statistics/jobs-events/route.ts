import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SVC = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SVC);

export async function GET(req: Request) {
  try {
    // Đếm số bài đăng và sự kiện
    const [jobPostCount, eventCount] = await Promise.all([
      supabaseAdmin.from('JobPosting').select('id', { count: 'exact' }),
      supabaseAdmin.from('Event').select('id', { count: 'exact' }),
    ]);

    const totalJobPosts = jobPostCount.count || 0;
    const totalEvents = eventCount.count || 0;

    // Trả về kết quả thống kê
    return NextResponse.json({
      success: true,
      data: {
        jobPosts: totalJobPosts,
        events: totalEvents,
      },
    });
  } catch (err) {
    console.error('Get jobs and events statistics error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
