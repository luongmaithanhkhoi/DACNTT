// app/api/jobs/[id]/applications/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

/* ================== HELPERS ================== */

function getBearerToken(req: Request): string | null {
  const authHeader = req.headers.get('authorization') || req.headers.get('Authorization')
  if (!authHeader) return null
  const [scheme, token] = authHeader.split(' ')
  return scheme?.toLowerCase() === 'bearer' ? token : null
}

function extractJobId(req: Request, params?: { id?: string }): string | null {
  let id = params?.id
  if (!id) {
    const pathname = new URL(req.url).pathname
    const segments = pathname.split('/').filter(Boolean)
    id = segments.at(-2)
  }
  if (!id || id.trim() === '' || id === 'undefined' || id === 'null') return null
  return id.trim()
}

async function getStudentIdFromToken(token: string): Promise<string | null> {
  const authClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: `Bearer ${token}` } },
  })

  const { data: { user }, error: authError } = await authClient.auth.getUser()
  if (authError || !user) {
    console.error("Auth error:", authError?.message)
    return null
  }

  const adminClient = createClient(supabaseUrl, supabaseServiceKey)

  const { data: appUser, error: dbError } = await adminClient
    .from('User')
    .select('id, role')
    .eq('provider_uid', user.id)
    .eq('is_active', true)
    .single()

  if (dbError || !appUser) {
    console.error("User not found:", dbError?.message)
    return null
  }

  return appUser.role === 'STUDENT' ? appUser.id : null
}

async function isJobOpen(jobId: string): Promise<{ isOpen: boolean; reason?: string }> {
  const adminClient = createClient(supabaseUrl, supabaseServiceKey)
  const { data, error } = await adminClient
    .from('JobPosting')
    .select('id, is_open, application_deadline')
    .eq('id', jobId)
    .single()

  if (error || !data) {
    return { isOpen: false, reason: 'Job not found' }
  }

  if (!data.is_open) {
    return { isOpen: false, reason: 'Job is closed' }
  }

  // ✅ CHECK DEADLINE
  if (data.application_deadline) {
    const deadline = new Date(data.application_deadline)
    const now = new Date()
    
    if (now > deadline) {
      return { isOpen: false, reason: 'Application deadline has passed' }
    }
  }

  return { isOpen: true }
}

/* ================== GET ================== */
// ✅ 2 MODES: 
// 1. ?check=me → Check nếu student đã apply (for JobApplyButton)
// 2. No query → List all applicants (for employer)

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id: jobId } = await context.params
    const searchParams = request.nextUrl.searchParams
    const checkMode = searchParams.get('check') // ← NEW: check=me

    const token = getBearerToken(request)

    // ✅ MODE 1: CHECK IF CURRENT STUDENT APPLIED
    if (checkMode === 'me') {
      if (!token) {
        return NextResponse.json({ applied: false }, { status: 200 })
      }

      const studentId = await getStudentIdFromToken(token)
      if (!studentId) {
        return NextResponse.json({ applied: false }, { status: 200 })
      }

      const adminClient = createClient(supabaseUrl, supabaseServiceKey)
      
      const { data, error } = await adminClient
        .from('Application')
        .select('id, status, created_at')
        .eq('student_id', studentId)
        .eq('job_id', jobId)
        .maybeSingle()

      // ✅ ALSO CHECK JOB STATUS & DEADLINE
      const { data: jobData } = await adminClient
        .from('JobPosting')
        .select('is_open, application_deadline')
        .eq('id', jobId)
        .single()

      const isPastDeadline = jobData?.application_deadline 
        ? new Date() > new Date(jobData.application_deadline)
        : false

      console.log('GET Application check:', {
        studentId,
        jobId,
        hasApplication: !!data,
        status: data?.status,
        isJobOpen: jobData?.is_open,
        isPastDeadline,
        error: error?.message
      })

      return NextResponse.json({
        applied: !!data,
        status: data?.status || null,
        appliedAt: data?.created_at || null,
        canApply: jobData?.is_open && !isPastDeadline && !data, // ✅ Can only apply if not applied, job open, and before deadline
        isPastDeadline,
        success: true
      })
    }

    // ✅ MODE 2: LIST ALL APPLICANTS (EMPLOYER VIEW)
    const status = searchParams.get('status')
    const major = searchParams.get('major')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = (page - 1) * limit

    const adminClient = createClient(supabaseUrl, supabaseServiceKey)

    // Get Applications
    let appQuery = adminClient
      .from('Application')
      .select('*', { count: 'exact' })
      .eq('job_id', jobId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (status) {
      appQuery = appQuery.eq('status', status)
    }

    const { data: applications, error: appError, count } = await appQuery

    if (appError) throw appError

    if (!applications || applications.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'Không có ứng viên nào',
        data: [],
        meta: {
          pagination: { page, limit, total: 0, totalPages: 0 }
        }
      })
    }

    // Get User info
    const userIds = applications.map(app => app.student_id)
    
    const { data: users, error: usersError } = await adminClient
      .from('User')
      .select('id, email, avatar_url')
      .in('id', userIds)

    if (usersError) throw usersError

    // Get Student info
    const { data: students, error: studentsError } = await adminClient
      .from('Student')
      .select('user_id, full_name, major, graduation_year, enrollment_year')
      .in('user_id', userIds)

    if (studentsError) throw studentsError

    // Get Skills
    const { data: skills, error: skillsError } = await adminClient
      .from('StudentSkill')
      .select(`
        student_id,
        level,
        Skill (
          id,
          name
        )
      `)
      .in('student_id', userIds)

    if (skillsError) throw skillsError

    // Combine all data
    const result = applications.map(app => {
      const user = users?.find(u => u.id === app.student_id)
      const student = students?.find(s => s.user_id === app.student_id)
      const studentSkills = skills?.filter(sk => sk.student_id === app.student_id) || []

      return {
        ...app,
        student: student ? {
          ...student,
          user: {
            email: user?.email,
            avatar_url: user?.avatar_url
          },
          skills: studentSkills
        } : null
      }
    })

    // Filter by major
    let filteredData = result
    if (major) {
      filteredData = result.filter(app => 
        app.student?.major?.toLowerCase().includes(major.toLowerCase())
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Lấy danh sách thành công',
      data: filteredData,
      meta: {
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit)
        }
      }
    })

  } catch (error) {
    console.error('GET applications error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Lỗi không xác định'
      },
      { status: 500 }
    )
  }
}

/* ================== POST ================== */
// Apply vào job
export async function POST(req: Request, { params }: { params: { id?: string } }) {
  try {
    const token = getBearerToken(req)
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized - Missing token' }, { status: 401 })
    }

    const jobId = extractJobId(req, params)
    if (!jobId) {
      return NextResponse.json({ error: 'Invalid job ID' }, { status: 400 })
    }

    const studentId = await getStudentIdFromToken(token)
    if (!studentId) {
      return NextResponse.json({ error: 'Forbidden - Invalid student' }, { status: 403 })
    }

    // Kiểm tra job có tồn tại và đang mở
    const jobStatus = await isJobOpen(jobId)
    if (!jobStatus.isOpen) {
      return NextResponse.json({ 
        error: jobStatus.reason || 'Cannot apply to this job',
        applied: false
      }, { status: 400 })
    }

    const adminClient = createClient(supabaseUrl, supabaseServiceKey)

    // Kiểm tra đã apply chưa
    const { data: existing } = await adminClient
      .from('Application')
      .select('id')
      .eq('student_id', studentId)
      .eq('job_id', jobId)
      .maybeSingle()

    if (existing) {
      return NextResponse.json({ 
        success: true, 
        applied: true,
        message: 'Already applied' 
      })
    }

    // Apply mới
    const { data: newApp, error: insertError } = await adminClient
      .from('Application')
      .insert({
        student_id: studentId,
        job_id: jobId,
        status: 'PENDING', 
      })
      .select()
      .single()

    if (insertError) {
      console.error("Insert application error:", insertError)
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    console.log('POST Application created:', { studentId, jobId, applicationId: newApp.id })

    return NextResponse.json({ 
      success: true, 
      applied: true,
      message: 'Applied successfully',
      applicationId: newApp.id
    })

  } catch (err) {
    console.error("POST application error:", err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/* ================== DELETE ================== */
// Rút hồ sơ
export async function DELETE(req: Request, { params }: { params: { id?: string } }) {
  try {
    const token = getBearerToken(req)
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const jobId = extractJobId(req, params)
    if (!jobId) {
      return NextResponse.json({ error: 'Invalid job ID' }, { status: 400 })
    }

    const studentId = await getStudentIdFromToken(token)
    if (!studentId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const adminClient = createClient(supabaseUrl, supabaseServiceKey)

    const { error } = await adminClient
      .from('Application')
      .delete()
      .eq('student_id', studentId)
      .eq('job_id', jobId)

    if (error) {
      console.error("Delete application error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log('DELETE Application withdrawn:', { studentId, jobId })

    return NextResponse.json({ 
      success: true, 
      applied: false,
      message: 'Application withdrawn successfully' 
    })

  } catch (err) {
    console.error("DELETE application error:", err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}