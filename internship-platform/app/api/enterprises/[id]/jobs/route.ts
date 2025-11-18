import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

// GET /api/enterprises/:id/jobs - Lấy danh sách job
export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = await context.params
    const searchParams = request.nextUrl.searchParams
    const isOpen = searchParams.get('is_open')
    const keyword = searchParams.get('keyword')
    let query = supabase
      .from('JobPosting')
      .select(`
        *,
        skills:JobSkill(
          required_level,
          skill:Skill(id, name)
        ),
        applications:Application(count)
      `)
      .eq('enterprise_id', id)
      .order('created_at', { ascending: false })

    if (isOpen !== null) {
      query = query.eq('is_open', isOpen === 'true')
    }
    if (keyword) {
      query = query.or(`title.ilike.%${keyword}%,description.ilike.%${keyword}%`)
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Lỗi server'
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}

// POST /api/enterprises/:id/jobs - Tạo job mới
export async function POST(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = await context.params
    const body = await request.json()
    const {
      title,
      description,
      location,
      internship_period,
      require_gpa_min,
      application_deadline,
      skills // Array of { skill_id, required_level }
    } = body

    // Validate
    if (!title) {
      return NextResponse.json(
        { success: false, error: 'Thiếu tiêu đề công việc' },
        { status: 400 }
      )
    }

    // Tạo job posting
    const { data: job, error: jobError } = await supabase
      .from('JobPosting')
      .insert({
        enterprise_id: id,
        title,
        description,
        location,
        internship_period,
        require_gpa_min,
        application_deadline,
        is_open: true
      })
      .select()
      .single()

    if (jobError) throw jobError

    // Thêm skills nếu có
    if (skills && skills.length > 0) {
      const jobSkills = skills.map((skill: { skill_id: string; required_level: number }) => ({
        job_id: job.id,
        skill_id: skill.skill_id,
        required_level: skill.required_level
      }))

      const { error: skillsError } = await supabase
        .from('JobSkill')
        .insert(jobSkills)

      if (skillsError) throw skillsError
    }

    return NextResponse.json(
      { success: true, data: job },
      { status: 201 }
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Lỗi server'
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
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