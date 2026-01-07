import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Khởi tạo Supabase client
const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(url, anon);

// GET /api/faculty/job-posts - Lấy danh sách tất cả các job
export async function GET(request: NextRequest) {
  try {
    // Lấy các tham số từ request
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const isOpen = searchParams.get('is_open');
    const keyword = searchParams.get('keyword');

    const offset = (page - 1) * limit;

    // Cập nhật query để lấy tất cả công việc mà không theo enterprise_id
    let query = supabase
      .from('JobPosting')
      .select(` 
        id,
        title,
        created_at,
        status,
        is_open,
        job_type,
        work_mode,
        category:JobCategory(id, name),
        location:Location(id, name),
        enterprise:Enterprise (
          id,
          name,
          description,
          industry,
          location,
          website,
          image_url,
          contact_email
        ),
        applications:Application(count)
      `, { count: 'exact' }) 
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1); // Phân trang

    // Nếu có bộ lọc trạng thái công việc
    if (isOpen !== null) {
      query = query.eq('is_open', isOpen === 'true');
    }

    // Nếu có bộ lọc tìm kiếm theo từ khóa
    if (keyword) {
      query = query.or(`title.ilike.%${keyword}%,description.ilike.%${keyword}%`);
    }

    // Thực thi truy vấn
    const { data, error, count } = await query;
    if (error) throw error;

    // Tính toán số trang
    const totalPages = count ? Math.ceil(count / limit) : 1;

    return NextResponse.json({
      success: true,
      data,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: count || 0,
        limit,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Lỗi server';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
