import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

// GET /api/enterprises/:id/jobs - Lấy danh sách job
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } =  await params;
    const searchParams = request.nextUrl.searchParams;

    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const isOpen = searchParams.get('is_open');
    const keyword = searchParams.get('keyword');

    const offset = (page - 1) * limit;

    let query = supabase
      .from('JobPosting')
      .select(`
        id,
        title,
        created_at,
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
      .eq('enterprise_id', id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1); // Phân trang

    if (isOpen !== null) {
      query = query.eq('is_open', isOpen === 'true');
    }
    if (keyword) {
      query = query.or(`title.ilike.%${keyword}%,description.ilike.%${keyword}%`);
    }

    const { data, error, count } = await query;

    if (error) throw error;

    const totalPages = count ? Math.ceil(count / limit) : 1;
    console.log("Ngu 1");

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


// export async function GET(
//   request: NextRequest,
//   context: { params: { id: string } }
// ) {
//   try {
//     const { id } = await context.params
//     const searchParams = request.nextUrl.searchParams
//     const isOpen = searchParams.get('is_open')
//     const keyword = searchParams.get('keyword')
//     // let query = supabase
//     //   .from('JobPosting')
//     //   .select(`
//     //     *,
//     //     skills:JobSkill(
//     //       required_level,
//     //       skill:Skill(id, name)
//     //     ),
//     //     applications:Application(count)
//     //   `)
//     //   .eq('enterprise_id', id)
//     //   .order('created_at', { ascending: false })


//     let query = supabase
//       .from('JobPosting')
//       .select(`
//         id,
//         title,
//         description,
//         created_at,
//         is_open,
//         job_type,
//         work_mode,
//         category:JobCategory(id, name),
//         location:Location(id, name)
//       `)
//       .eq('enterprise_id', id)
//       .order('created_at', { ascending: false });
      
//     if (isOpen !== null) {
//       query = query.eq('is_open', isOpen === 'true')
//     }
//     if (keyword) {
//       query = query.or(`title.ilike.%${keyword}%,description.ilike.%${keyword}%`)
//     }

//     const { data, error } = await query

//     if (error) throw error

//     return NextResponse.json({ success: true, data })
//   } catch (error) {
//     const message = error instanceof Error ? error.message : 'Lỗi server'
//     return NextResponse.json(
//       { success: false, error: message },
//       { status: 500 }
//     )
//   }
// }

// POST /api/enterprises/:id/jobs - Tạo job mới
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const {
      title,
      description,
      category_id,
      job_type,
      salary_min,
      salary_max,
      allowance_min,
      allowance_max,
      location_id,
      work_mode,
      experience_level,
      internship_period,
      require_gpa_min,
      application_deadline,
      skills = [],
      tags = [],
    } = body;

    // Validate bắt buộc
    if (!title || !category_id) {
      return NextResponse.json(
        { success: false, error: 'Thiếu tiêu đề hoặc danh mục công việc' },
        { status: 400 }
      );
    }

    // Insert job
    const { data: job, error: insertError } = await supabase
      .from('JobPosting')
      .insert({
        enterprise_id: id,
        title,
        description,
        category_id,
        job_type,
        salary_min: salary_min ?? null,
        salary_max: salary_max ?? null,
        allowance_min: allowance_min ?? null,
        allowance_max: allowance_max ?? null,
        location_id: location_id ?? null,
        work_mode,
        experience_level,
        internship_period: internship_period ?? null,
        require_gpa_min: require_gpa_min ?? null,
        application_deadline: application_deadline ?? null,
        tags: tags.length > 0 ? tags : null,
        is_open: true,
      })
      .select()
      .single();

    // Nếu insert lỗi → return ngay, không chạy tiếp
    if (insertError) {
      console.error('Supabase insert error:', insertError);
      return NextResponse.json(
        { success: false, error: insertError.message },
        { status: 500 }
      );
    }

    // Nếu có skills → insert riêng, nhưng KHÔNG throw nếu lỗi (tùy chọn)
    if (skills.length > 0) {
      const jobSkills = skills.map((s: any) => ({
        job_id: job.id,
        skill_id: s.skill_id,
        required_level: s.required_level || 3,
      }));

      const { error: skillsError } = await supabase
        .from('JobSkill')
        .insert(jobSkills);

      if (skillsError) {
        console.error('Lỗi insert skills (không ảnh hưởng job chính):', skillsError);
        // Không return error ở đây → vẫn coi là thành công
      }
    }

    // Thành công → return 201
    return NextResponse.json(
      { success: true, message: 'Đăng tin thành công', data: job },
      { status: 201 }
    );

  } catch (error) {
    console.error('Lỗi không mong muốn trong POST /jobs:', error);
    return NextResponse.json(
      { success: false, error: 'Lỗi server nội bộ' },
      { status: 500 }
    );
  }
}

// PUT /api/enterprises/:id/jobs - Update jobs
export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = await context.params
    const body = await request.json()
    const {
      job_id,
      title,
      description,
      location,
      internship_period,
      require_gpa_min,
      application_deadline,
      is_open,
      skills
    } = body

    const { data: updatedJob, error: updateError } = await supabase
      .from('JobPosting')
      .update({
        title,
        description,
        location,
        internship_period,
        require_gpa_min,
        application_deadline,
        is_open
      })
      .eq('id', job_id)
      .eq('enterprise_id', id)
      .select()
      .single()

    if (updateError) throw updateError

    if (skills && skills.length > 0) {
      const { error: deleteError } = await supabase
        .from('JobSkill')
        .delete()
        .eq('job_id', job_id)
      if (deleteError) throw deleteError

      if (skills.length > 0) {
        const jobSkills = skills.map(
          (skill: { skill_id: string; required_level: number }) => ({
            job_id,
            skill_id: skill.skill_id,
            required_level: skill.required_level
          })
        )

        const { error: insertError } = await supabase
          .from('JobSkill')
          .insert(jobSkills)
        if (insertError) throw insertError
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Cập nhật công việc thành công',
      data: updatedJob
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Lỗi server'
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}

// DELETE /api/enterprises/:id/jobs - Delete jobs

export async function DELETE(
    request: NextRequest,
    context: { params: { id: string } }
) {
  try {
    const { id } = await context.params
    const body = await request.json()
    const { job_id } = body

    const { error: deleteSkillsError } = await supabase
      .from('JobSkill')
      .delete()
      .eq('job_id', job_id)
    if (deleteSkillsError) throw deleteSkillsError

    const { error: deleteJobError } = await supabase
      .from('JobPosting')
      .delete()
      .eq('id', job_id)
      .eq('enterprise_id', id)

    if (deleteJobError) throw deleteJobError

    return NextResponse.json({
      success: true,
      message: 'Đã xóa công việc'
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Lỗi server'
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}