import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Khởi tạo Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  try {
    const { userId, cvData, cvFile } = await request.json();

    // if (!userId) {
    //   return NextResponse.json(
    //     { error: 'User ID is required' },
    //     { status: 400 }
    //   );
    // }

    // 1. Cập nhật thông tin Student
    const { data: studentData, error: studentError } = await supabase
      .from('Student')
      .upsert({
        user_id: userId,
        full_name: cvData.full_name,
        phone: cvData.phone,
        major: cvData.major,
        graduation_year: cvData.graduation_year,
        enrollment_year: cvData.enrollment_year,
        gpa: cvData.gpa,
        summary: cvData.summary,
        bio: cvData.bio,
        location: cvData.location,
        portfolio_url: cvData.portfolio_url,
        linkedin_url: cvData.linkedin_url,
        github_url: cvData.github_url,
        socials: cvData.socials,
        languages: cvData.languages,
        cv_parsed: cvData, // Lưu toàn bộ dữ liệu parsed
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (studentError) {
      throw new Error(`Error updating Student: ${studentError.message}`);
    }

    // 2. Xử lý Skills
    if (cvData.skills && cvData.skills.length > 0) {
      // Xóa các skill cũ
      await supabase
        .from('StudentSkill')
        .delete()
        .eq('student_id', userId);

      // Thêm/cập nhật skills mới
      for (const skill of cvData.skills) {
        // Kiểm tra xem skill đã tồn tại trong bảng Skill chưa
        let { data: existingSkill, error: skillError } = await supabase
          .from('Skill')
          .select('id')
          .eq('name', skill.name)
          .single();

        let skillId;

        if (!existingSkill) {
          // Tạo skill mới nếu chưa tồn tại
          const { data: newSkill, error: createSkillError } = await supabase
            .from('Skill')
            .insert({ name: skill.name })
            .select('id')
            .single();

          if (createSkillError) {
            console.error('Error creating skill:', createSkillError);
            continue;
          }

          skillId = newSkill.id;
        } else {
          skillId = existingSkill.id;
        }

        // Thêm vào StudentSkill
        await supabase
          .from('StudentSkill')
          .insert({
            student_id: userId,
            skill_id: skillId,
            level: skill.level || 3 // Default level 3 nếu không có
          });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'CV đã được lưu thành công',
      data: studentData
    });

  } catch (error) {
    console.error('Error saving CV:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}