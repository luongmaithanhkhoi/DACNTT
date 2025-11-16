// app/api/jobs/[id]/applications/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = await context.params
    const searchParams = request.nextUrl.searchParams
    
    const status = searchParams.get('status')
    const major = searchParams.get('major')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = (page - 1) * limit

    // Step 1: Get Applications
    let appQuery = supabase
      .from('Application')
      .select('*', { count: 'exact' })
      .eq('job_id', id)
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

    //Get User info
    const userIds = applications.map(app => app.student_id)
    
    const { data: users, error: usersError } = await supabase
      .from('User')
      .select('id, email, avatar_url')
      .in('id', userIds)

    if (usersError) throw usersError

    // Get Student info
    const { data: students, error: studentsError } = await supabase
      .from('Student')
      .select('user_id, full_name, major, graduation_year, enrollment_year')
      .in('user_id', userIds)

    if (studentsError) throw studentsError

    // Get Skills
    const { data: skills, error: skillsError } = await supabase
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

    //Combine all data
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
    console.error('Error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Lỗi không xác định'
      },
      { status: 500 }
    )
  }
}