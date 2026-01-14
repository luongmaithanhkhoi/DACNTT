// app/api/students/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } 
) {
  const { id } = await params;

  try {
    if (!id) {
      return NextResponse.json({ success: false, error: 'Thiếu ID sinh viên' }, { status: 400 });
    }

    // 1. Lấy thông tin Student
    const { data: student, error: studentError } = await supabase
      .from('Student')
      .select('*')
      .eq('user_id', id)
      .single();

    if (studentError || !student) {
      console.error('Error getting student:', studentError);
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy sinh viên' },
        { status: 404 }
      );
    }

    // Lấy thông tin User (email, avatar, v.v.)
    const { data: user, error: userError } = await supabase
      .from('User')
      .select('email, avatar_url, is_active')
      .eq('id', id)
      .single();

    if (userError) console.error('Error getting user:', userError);

    // Lấy kỹ năng
    const { data: rawSkills, error: skillsError } = await supabase
      .from('StudentSkill')
      .select('level, Skill(id, name)')
      .eq('student_id', id);

    if (skillsError) console.error('Error getting skills:', skillsError);

    const skills = (rawSkills || []).map((s: any) => ({
      id: s.Skill.id,
      name: s.Skill.name,
      level: s.level,
    }));

    // Lấy applications + job title + enterprise name
    const { data: applications, error: appsError } = await supabase
      .from('Application')
      .select('id, status, created_at, job_id')
      .eq('student_id', id)
      .order('created_at', { ascending: false });

    if (appsError) console.error('Error getting applications:', appsError);

    let applicationsWithJobs: { id: any; status: any; createdAt: any; job: { id: any; title: any; enterpriseName: any; } | null; }[] = [];

    if (applications && applications.length > 0) {
      const jobIds = applications.map(a => a.job_id);

      const { data: jobs } = await supabase
        .from('JobPosting')
        .select('id, title, enterprise_id')
        .in('id', jobIds);

      const enterpriseIds = jobs ? [...new Set(jobs.map(j => j.enterprise_id))] : [];

      const { data: enterprises } = await supabase
        .from('Enterprise')
        .select('id, name')
        .in('id', enterpriseIds);

      const enterpriseMap = Object.fromEntries(
        (enterprises || []).map(e => [e.id, e.name])
      );

      applicationsWithJobs = applications.map(app => {
        const job = jobs?.find(j => j.id === app.job_id);
        return {
          id: app.id,
          status: app.status,
          createdAt: app.created_at,
          job: job ? {
            id: job.id,
            title: job.title,
            enterpriseName: enterpriseMap[job.enterprise_id] || 'Doanh nghiệp không xác định',
          } : null,
        };
      });
    }

    // Trả về data sạch
    const result = {
      student: {
        ...student,
        email: user?.email || null,
        avatar_url: user?.avatar_url || null,
        is_active: user?.is_active ?? true,
      },
      skills,
      applications: applicationsWithJobs,
    };

    return NextResponse.json({
      success: true,
      message: 'Lấy thông tin sinh viên thành công',
      data: result,
    });
  } catch (err) {
    console.error('Unexpected error:', err);
    return NextResponse.json(
      { success: false, error: 'Lỗi server nội bộ' },
      { status: 500 }
    );
  }
}