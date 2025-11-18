import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    
    const major = searchParams.get('major')
    const graduation_year = searchParams.get('graduation_year')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = (page - 1) * limit

    // Step 1: Get Students
    let studentQuery = supabase
      .from('Student')
      .select('*', { count: 'exact' })
      .order('graduation_year', { ascending: true })
      .range(offset, offset + limit - 1)

    if (major) {
      studentQuery = studentQuery.ilike('major', `%${major}%`)
    }

    if (graduation_year) {
      studentQuery = studentQuery.eq('graduation_year', parseInt(graduation_year))
    }

    const { data: students, error: studentsError, count } = await studentQuery

    if (studentsError) {
      console.error('Error getting students:', studentsError)
      return NextResponse.json(
        { success: false, error: studentsError.message },
        { status: 500 }
      )
    }

    if (!students || students.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'Không tìm thấy sinh viên nào',
        data: [],
        meta: {
          pagination: {
            page,
            limit,
            total: 0,
            totalPages: 0
          }
        }
      })
    }

    // Step 2: Get User info for each student
    const userIds = students.map(s => s.user_id)

    const { data: users, error: usersError } = await supabase
      .from('User')
      .select('id, email, avatar_url, is_active')
      .in('id', userIds)

    if (usersError) {
      console.error('Error getting users:', usersError)
    }

    // Step 3: Get Skills for each student
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

    if (skillsError) {
      console.error('Error getting skills:', skillsError)
    }

    // Step 4: Combine data
    const result = students.map(student => {
      const user = users?.find(u => u.id === student.user_id)
      const studentSkills = skills?.filter(s => s.student_id === student.user_id) || []

      return {
        ...student,
        user: user || null,
        skills: studentSkills
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Tìm kiếm thành công',
      data: result,
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
    console.error('Unexpected error:', error)
    const message = error instanceof Error ? error.message : 'Lỗi server'
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}