// app/api/admin/jobs/[jobId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

// ✅ Admin Supabase client (Service Role - server only)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const JOB_SELECT = `
  id,
  title,
  description,
  internship_period,
  require_gpa_min,
  is_open,
  application_deadline,
  allowance_min,
  allowance_max,
  work_mode,
  job_type,
  tags,
  created_at,
  updated_at,

  enterprise_id,
  category_id,
  location_id,

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
  location:Location (
    id,
    name
  ),
  category:JobCategory(
    id,
    name
  ),
  job_skills:JobSkill (
    skill_id,
    required_level,
    skill:Skill (
      id,
      name
    )
  )
`;

// ✅ helper: params có thể là object hoặc Promise (cho chắc)
async function getJobId(params: any): Promise<string> {
  const p = await Promise.resolve(params);
  return p.jobId;
}

// ✅ GET: Admin lấy job theo jobId (không cần enterpriseId)
export async function GET(
  _request: NextRequest,
  { params }: { params: { jobId: string } }
) {
  const jobId = await getJobId(params);

  try {
    const { data, error } = await supabaseAdmin
      .from("JobPosting")
      .select(JOB_SELECT)
      .eq("id", jobId)
      .maybeSingle(); // ✅ 0 rows -> data=null, không nổ PGRST116

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { success: false, error: "Không tìm thấy công việc này" },
        { status: 404 }
      );
    }

    // ✅ Normalize để form dùng dễ:
    // - skills: [{skill_id, required_level}]
    // - vẫn giữ job_skills nếu bạn cần hiển thị
    const normalized = {
      ...data,
      skills: Array.isArray((data as any).job_skills)
        ? (data as any).job_skills.map((js: any) => ({
            skill_id: js.skill_id,
            required_level: js.required_level,
          }))
        : [],
    };

    return NextResponse.json({ success: true, data: normalized });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "Lỗi server nội bộ" },
      { status: 500 }
    );
  }
}

// ✅ PUT: Admin update job theo jobId (không cần enterpriseId)
export async function PUT(
  request: NextRequest,
  { params }: { params: { jobId: string } }
) {
  const jobId = await getJobId(params);

  try {
    const body = await request.json();

    // Tách skills ra khỏi job fields
    const { skills, ...jobUpdateFields } = body ?? {};

    // ✅ tránh update nhầm các field không nên update
    const {
      id,
      created_at,
      updated_at,
      enterprise,
      location,
      category,
      job_skills,
      ...safeUpdate
    } = jobUpdateFields || {};

    // 1) Update JobPosting
    // ✅ dùng select để biết có update được dòng nào không
    const { data: updatedRow, error: updateJobError } = await supabaseAdmin
      .from("JobPosting")
      .update({
        ...safeUpdate,
        updated_at: new Date().toISOString(),
      })
      .eq("id", jobId)
      .select("id")
      .maybeSingle();

    if (updateJobError) {
      return NextResponse.json(
        {
          success: false,
          error: updateJobError.message || "Không thể cập nhật JobPosting",
        },
        { status: 500 }
      );
    }

    if (!updatedRow) {
      // update 0 rows: có thể jobId sai hoặc bị policy chặn
      return NextResponse.json(
        {
          success: false,
          error: "Không cập nhật được (job không tồn tại hoặc bị chặn quyền)",
        },
        { status: 404 }
      );
    }

    // 2) Update skills: delete old -> insert new
    const { error: deleteSkillsError } = await supabaseAdmin
      .from("JobSkill")
      .delete()
      .eq("job_id", jobId);

    if (deleteSkillsError) {
      console.error("Delete skills error:", deleteSkillsError);
      // không chặn update chính
    }

    if (Array.isArray(skills) && skills.length > 0) {
      const validSkills = skills.filter(
        (s: any) => s?.skill_id && Number(s?.required_level) > 0
      );

      if (validSkills.length > 0) {
        const inserts = validSkills.map((s: any) => ({
          job_id: jobId,
          skill_id: s.skill_id,
          required_level: Number(s.required_level),
        }));

        const { error: insertSkillsError } = await supabaseAdmin
          .from("JobSkill")
          .insert(inserts);

        if (insertSkillsError) {
          console.error("Insert skills error:", insertSkillsError);
          // không return fail để không làm hỏng update chính
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "Admin cập nhật công việc thành công!",
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "Không thể cập nhật công việc" },
      { status: 500 }
    );
  }
}
