import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

// GET /api/students/:id
export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = await context.params

    
    const { data: student, error: studentError } = await supabase
      .from('Student')
      .select('*')
      .eq('user_id', id)
      .single()

    if (studentError) {
      console.error('Error getting student:', studentError)
      return NextResponse.json(
        { success: false, error: studentError.message },
        { status: 500 }
      )
    }

    if (!student) {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy sinh viên' },
        { status: 404 }
      )
    }


    const { data: user, error: userError } = await supabase
      .from('User')
      .select('id, email, avatar_url, is_active')
      .eq('id', id)
      .single()

    if (userError) {
      console.error('Error getting user:', userError)
    }

    const { data: skills, error: skillsError } = await supabase
      .from('StudentSkill')
      .select(`
        level,
        Skill (
          id,
          name
        )
      `)
      .eq('student_id', id)

    if (skillsError) {
      console.error('Error getting skills:', skillsError)
    }

    const { data: applications, error: appsError } = await supabase
      .from('Application')
      .select(`
        id,
        status,
        created_at,
        job_id
      `)
      .eq('student_id', id)
      .order('created_at', { ascending: false })

    if (appsError) {
      console.error('Error getting applications:', appsError)
    }

    let applicationsWithJobs = applications || []
    if (applications && applications.length > 0) {
      const jobIds = applications.map(app => app.job_id)
      
      const { data: jobs, error: jobsError } = await supabase
        .from('JobPosting')
        .select(`
          id,
          title,
          enterprise_id
        `)
        .in('id', jobIds)

      if (jobsError) {
        console.error('Error getting jobs:', jobsError)
      }

      if (jobs && jobs.length > 0) {
        const enterpriseIds = [...new Set(jobs.map(j => j.enterprise_id))]
        
        const { data: enterprises, error: entError } = await supabase
          .from('Enterprise')
          .select('id, name')
          .in('id', enterpriseIds)

        if (entError) {
          console.error('Error getting enterprises:', entError)
        }

        applicationsWithJobs = applications.map(app => {
          const job = jobs.find(j => j.id === app.job_id)
          const enterprise = enterprises?.find(e => e.id === job?.enterprise_id)
          
          return {
            ...app,
            job: job ? {
              id: job.id,
              title: job.title,
              enterprise: enterprise ? {
                name: enterprise.name
              } : null
            } : null
          }
        })
      }
    }

    const result = {
      ...student,
      user: user || null,
      skills: skills || [],
      applications: applicationsWithJobs
    }

    return NextResponse.json({
      success: true,
      message: 'Lấy thông tin thành công',
      data: result
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