// app/api/enterprises/[id]/jobs/[jobId]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; jobId: string }> } // ← params là Promise
) {
  // BƯỚC QUAN TRỌNG: Await params trước khi dùng
  const { id: enterpriseId, jobId } = await params;

  console.log("Params sau khi await:", { enterpriseId, jobId }); // Debug

  try {
    if (!enterpriseId || !jobId) {
      return NextResponse.json(
        { success: false, error: 'Thiếu enterpriseId hoặc jobId' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('JobPosting')
      .select(`
        id,
        title,
        description,
        internship_period,
        require_gpa_min,
        is_open,
        application_deadline,
        allowance_min,
        allowance_max,
        work_mode,
        job_type,               
        tags,
        created_at,
        updated_at,
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
        location:Location (
          id,
          name
        ),
        category:JobCategory(id, name),
        job_skills:JobSkill (
          skill_id,
          required_level,
          skill:Skill (
            id,
            name
          )
        )
      `)
      .eq('id', jobId)
      .eq('enterprise_id', enterpriseId)
      .single();

    if (error) {
      console.error("Lỗi Supabase:", error);
      return NextResponse.json(
        { success: false, error: error.message || 'Lỗi truy vấn dữ liệu' },
        { status: 500 }
      );
    }

    if (!data) {
      console.log("Ngu 2");
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy công việc này' },
        { status: 404 }
      );
    }
    

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("Lỗi không mong muốn:", err);
    return NextResponse.json(
      { success: false, error: 'Lỗi server nội bộ' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; jobId: string }> }
) {
  const { id: enterpriseId, jobId } = await params;

  try {
    const body = await request.json();

    const { data, error } = await supabase
      .from('JobPosting')
      .update({
        title: body.title,
        description: body.description,
        category_id: body.category_id,
        job_type: body.job_type,
        work_mode: body.work_mode,
        location_id: body.location_id,
        internship_period: body.internship_period || null,
        require_gpa_min: body.require_gpa_min || null,
        application_deadline: body.application_deadline || null,
        is_open: body.is_open, // Cho phép đóng/mở lại
      })
      .eq('id', jobId)
      .eq('enterprise_id', enterpriseId)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data, message: 'Cập nhật công việc thành công' });
  } catch (err) {
    console.error('Lỗi update job:', err);
    return NextResponse.json(
      { success: false, error: 'Không thể cập nhật công việc' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; jobId: string }> }
) {
  const { id: enterpriseId, jobId } = await params;

  try {
    // Soft delete: chỉ cập nhật is_open = false
    const { data, error } = await supabase
      .from('JobPosting')
      .update({ is_open: false, closed_at: new Date().toISOString() }) // optional: thêm thời gian đóng
      .eq('id', jobId)
      .eq('enterprise_id', enterpriseId)
      .select()
      .single();

    if (error) {
      console.error("Lỗi đóng job:", error);
      return NextResponse.json(
        { success: false, error: error.message || 'Không thể đóng công việc' },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy công việc để đóng' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Đã đóng công việc thành công',
      data,
    });
  } catch (err) {
    console.error("Lỗi server khi đóng job:", err);
    return NextResponse.json(
      { success: false, error: 'Lỗi server nội bộ' },
      { status: 500 }
    );
  }
}