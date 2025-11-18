import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
import { createClient } from '@supabase/supabase-js'
const url  = process.env.NEXT_PUBLIC_SUPABASE_URL!
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// helper parse int/bool safely
const toInt = (v: string | null, def = 10) => {
  const n = Number(v ?? '')
  return Number.isFinite(n) && n >= 0 ? n : def
}
const toBool = (v: string | null) => (v === 'true' ? true : v === 'false' ? false : null)

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const q            = searchParams.get('q')?.trim() || null
    const location     = searchParams.get('location')?.trim() || null
    const industry     = searchParams.get('industry')?.trim() || null
    const skillId      = searchParams.get('skill_id')?.trim() || null
    const minAllowance = searchParams.get('min_allowance')?.trim() || null
    const workMode     = searchParams.get('work_mode')?.trim() || null   // ONSITE|HYBRID|REMOTE
    const empType      = searchParams.get('employment_type')?.trim() || null // INTERN|...
    const isOpen       = toBool(searchParams.get('is_open'))
    const limit        = toInt(searchParams.get('limit'), 10)
    const offset       = toInt(searchParams.get('offset'), 0)
    const orderBy      = searchParams.get('order_by') || 'application_deadline'  // hoặc created_at
    const orderDir     = (searchParams.get('order_dir') || 'desc').toLowerCase() === 'asc' ? 'asc' : 'desc'

    // Client “ẩn danh” là đủ vì đây là endpoint public để SV duyệt job
    const sb = createClient(url, anon, { auth: { persistSession: false, autoRefreshToken: false } })

    // Chọn cột + embed liên quan
    // Lưu ý: dùng !inner cho JobSkill khi lọc theo skill để ép inner join
    const baseSelect = `
      id, title, description, location, internship_period, require_gpa_min, is_open,
      application_deadline, allowance_min, allowance_max, work_mode, employment_type, tags, created_at,
      Enterprise:Enterprise(id, name, industry, location, image_url),
      JobSkill:JobSkill(${skillId ? '!inner' : ''}skill_id, required_level, Skill:Skill(id, name))
    `

    let query = sb
      .from('JobPosting')
      .select(baseSelect, { count: 'exact' })
      .range(offset, offset + limit - 1)
      .order(orderBy as string, { ascending: orderDir === 'asc' })

    if (q) {
      // ưu tiên FTS nếu bạn đã tạo idx (đã có idx_jobposting_fts)
      query = query.textSearch('title', q, { type: 'plain' }) // đơn giản; có thể mở rộng: or(title,description)
    }
    if (location) query = query.ilike('location', `%${location}%`)
    if (isOpen !== null) query = query.eq('is_open', isOpen)
    if (minAllowance) query = query.gte('allowance_min', Number(minAllowance))

    if (workMode) query = query.eq('work_mode', workMode)
    if (empType)  query = query.eq('employment_type', empType)

    if (industry) {
      // lọc bằng industry của Enterprise (filter trên embed)
      query = query.eq('Enterprise.industry', industry)
    }

    if (skillId) {
      // lọc job yêu cầu skill nhất định (inner join ở select đã đảm bảo chỉ lấy job match)
      query = query.eq('JobSkill.skill_id', skillId)
    }

    const { data, error, count } = await query
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({
      total: count ?? 0,
      items: data ?? [],
      page: { limit, offset, order_by: orderBy, order_dir: orderDir }
    })
  } catch (e: unknown) {
    console.error('GET /api/jobs error', e)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}


// // GET /api/enterprises/:id/jobs - Lấy danh sách job
// export async function GET_a(
//   request: NextRequest,
//   context: { params: { id: string } }
// ) {
//   try {
//     const { id } = await context.params
//     const searchParams = request.nextUrl.searchParams
//     const isOpen = searchParams.get('is_open')
//     const keyword = searchParams.get('keyword')
//     let query = supabase
//       .from('JobPosting')
//       .select(`
//         *,
//         skills:JobSkill(
//           required_level,
//           skill:Skill(id, name)
//         ),
//         applications:Application(count)
//       `)
//       .eq('enterprise_id', id)
//       .order('created_at', { ascending: false })

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

// // POST /api/enterprises/:id/jobs - Tạo job mới
// export async function POST(
//   request: NextRequest,
//   context: { params: { id: string } }
// ) {
//   try {
//     const { id } = await context.params
//     const body = await request.json()
//     const {
//       title,
//       description,
//       location,
//       internship_period,
//       require_gpa_min,
//       application_deadline,
//       skills // Array of { skill_id, required_level }
//     } = body

//     // Validate
//     if (!title) {
//       return NextResponse.json(
//         { success: false, error: 'Thiếu tiêu đề công việc' },
//         { status: 400 }
//       )
//     }

//     // Tạo job posting
//     const { data: job, error: jobError } = await supabase
//       .from('JobPosting')
//       .insert({
//         enterprise_id: id,
//         title,
//         description,
//         location,
//         internship_period,
//         require_gpa_min,
//         application_deadline,
//         is_open: true
//       })
//       .select()
//       .single()

//     if (jobError) throw jobError

//     // Thêm skills nếu có
//     if (skills && skills.length > 0) {
//       const jobSkills = skills.map((skill: { skill_id: string; required_level: number }) => ({
//         job_id: job.id,
//         skill_id: skill.skill_id,
//         required_level: skill.required_level
//       }))

//       const { error: skillsError } = await supabase
//         .from('JobSkill')
//         .insert(jobSkills)

//       if (skillsError) throw skillsError
//     }

//     return NextResponse.json(
//       { success: true, data: job },
//       { status: 201 }
//     )
//   } catch (error) {
//     const message = error instanceof Error ? error.message : 'Lỗi server'
//     return NextResponse.json(
//       { success: false, error: message },
//       { status: 500 }
//     )
//   }
// }

// // PUT /api/enterprises/:id/jobs - Update jobs
// export async function PUT(
//   request: NextRequest,
//   context: { params: { id: string } }
// ) {
//   try {
//     const { id } = await context.params
//     const body = await request.json()
//     const {
//       job_id,
//       title,
//       description,
//       location,
//       internship_period,
//       require_gpa_min,
//       application_deadline,
//       is_open,
//       skills
//     } = body

//     const { data: updatedJob, error: updateError } = await supabase
//       .from('JobPosting')
//       .update({
//         title,
//         description,
//         location,
//         internship_period,
//         require_gpa_min,
//         application_deadline,
//         is_open
//       })
//       .eq('id', job_id)
//       .eq('enterprise_id', id)
//       .select()
//       .single()

//     if (updateError) throw updateError

//     if (skills && skills.length > 0) {
//       const { error: deleteError } = await supabase
//         .from('JobSkill')
//         .delete()
//         .eq('job_id', job_id)
//       if (deleteError) throw deleteError

//       if (skills.length > 0) {
//         const jobSkills = skills.map(
//           (skill: { skill_id: string; required_level: number }) => ({
//             job_id,
//             skill_id: skill.skill_id,
//             required_level: skill.required_level
//           })
//         )

//         const { error: insertError } = await supabase
//           .from('JobSkill')
//           .insert(jobSkills)
//         if (insertError) throw insertError
//       }
//     }

//     return NextResponse.json({
//       success: true,
//       message: 'Cập nhật công việc thành công',
//       data: updatedJob
//     })
//   } catch (error) {
//     const message = error instanceof Error ? error.message : 'Lỗi server'
//     return NextResponse.json(
//       { success: false, error: message },
//       { status: 500 }
//     )
//   }
// }

// // DELETE /api/enterprises/:id/jobs - Delete jobs

// export async function DELETE(
//     request: NextRequest,
//     context: { params: { id: string } }
// ) {
//   try {
//     const { id } = await context.params
//     const body = await request.json()
//     const { job_id } = body

//     const { error: deleteSkillsError } = await supabase
//       .from('JobSkill')
//       .delete()
//       .eq('job_id', job_id)
//     if (deleteSkillsError) throw deleteSkillsError

//     const { error: deleteJobError } = await supabase
//       .from('JobPosting')
//       .delete()
//       .eq('id', job_id)
//       .eq('enterprise_id', id)

//     if (deleteJobError) throw deleteJobError

//     return NextResponse.json({
//       success: true,
//       message: 'Đã xóa công việc'
//     })
//   } catch (error) {
//     const message = error instanceof Error ? error.message : 'Lỗi server'
//     return NextResponse.json(
//       { success: false, error: message },
//       { status: 500 }
//     )
//   }
// }