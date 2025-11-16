import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = await context.params

    const { data: applications, error: appError } = await supabase
      .from('Application')
      .select('*')
      .eq('job_id', id)

    if (appError) {
      console.error('Error getting applications:', appError)
      return NextResponse.json(
        { success: false, error: appError.message },
        { status: 500 }
      )
    }

    if (!applications || applications.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'Không có ứng viên nào',
        data: []
      })
    }

    const userIds = applications.map(app => app.student_id)
    
    const { data: users, error: usersError } = await supabase
      .from('User')
      .select('id, email, avatar_url')
      .in('id', userIds)

    if (usersError) {
      console.error('Error getting users:', usersError)
    }

    
    const { data: students, error: studentsError } = await supabase
      .from('Student')
      .select('user_id, full_name, major, graduation_year')
      .in('user_id', userIds)

    if (studentsError) {
      console.error('Error getting students:', studentsError)
    }

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

    const rankedApplications = applications.map(app => {
      let score = 0

      const user = users?.find(u => u.id === app.student_id)
      const student = students?.find(s => s.user_id === app.student_id)
      const studentSkills = skills?.filter(s => s.student_id === app.student_id) || []

      if (studentSkills.length > 0) {
        const avgSkillLevel = studentSkills.reduce((sum, s) => sum + s.level, 0) / studentSkills.length
        score += (avgSkillLevel / 5) * 60
      }

      const daysAgo = Math.floor((Date.now() - new Date(app.created_at).getTime()) / (1000 * 60 * 60 * 24))
      score += Math.max(0, (30 - daysAgo) / 30) * 40

      return {
        ...app,
        student: student ? {
          ...student,
          user: {
            email: user?.email,
            avatar_url: user?.avatar_url
          },
          skills: studentSkills
        } : null,
        ai_score: Math.round(score)
      }
    })

    rankedApplications.sort((a, b) => b.ai_score - a.ai_score)

    return NextResponse.json({
      success: true,
      message: 'Xếp hạng ứng viên thành công',
      data: rankedApplications
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