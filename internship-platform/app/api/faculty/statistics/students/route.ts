import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SVC = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SVC);

export async function GET(req: Request) {
  try {
    // Lấy thống kê sinh viên theo trạng thái
    const statuses = ['Đang ứng tuyển', 'Đang thực tập', 'Hoàn thành'];
    const studentCounts = await Promise.all(
      statuses.map(async (status) => {
        const { count } = await supabaseAdmin
          .from('Student')
          .select('user_id', { count: 'exact' })
          .eq('status', status);

        return count || 0;
      })
    );

    // Trả về kết quả thống kê
    return NextResponse.json({
      success: true,
      data: {
        totalStudents: studentCounts.reduce((acc, count) => acc + count, 0),
        studentsPending: studentCounts[0], // Đang ứng tuyển
        studentsInProgress: studentCounts[1], // Đang thực tập
        studentsCompleted: studentCounts[2], // Hoàn thành
      },
    });
  } catch (err) {
    console.error('Error during GET request:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
