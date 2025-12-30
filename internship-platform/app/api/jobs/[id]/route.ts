// import { NextResponse } from 'next/server'
// import { createClient } from '@supabase/supabase-js'

// const url  = process.env.NEXT_PUBLIC_SUPABASE_URL!
// const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// function getIdSafely(req: Request, params: { jobId?: string }) {
//   // ưu tiên params từ Next
//   let id = params?.jobId
//   // fallback nếu vì lý do gì đó params rỗng
//   if (!id) {
//     const segs = new URL(req.url).pathname.split('/').filter(Boolean)
//     id = segs[segs.length - 1]
//   }
//   if (!id || id === 'undefined' || id === 'null') return null
//   return id
// }

// export async function GET(req: Request, ctx: { params: { jobId?: string } }) {
//   try {
//     const id = getIdSafely(req, ctx.params)
//     if (!id) return NextResponse.json({ error: 'Invalid job id' }, { status: 400 })

//     const sb = createClient(url, anon, { auth: { persistSession: false, autoRefreshToken: false } })

//     const { data, error } = await sb
//       .from('JobPosting')
//       .select(`
//         id, title, description, location, internship_period, require_gpa_min, is_open,
//         application_deadline, allowance_min, allowance_max, work_mode, employment_type, tags,
//         created_at, updated_at,
//         Enterprise:Enterprise(id, name, description, industry, location, website, image_url, contact_email),
//         JobSkill:JobSkill(skill_id, required_level, Skill:Skill(id, name))
//       `)
//       .eq('id', id)
//       .maybeSingle()        // tránh lỗi khi không có bản ghi

//     if (error) return NextResponse.json({ error: error.message }, { status: 400 })
//     if (!data) return NextResponse.json({ error: 'Job not found' }, { status: 404 })

//     return NextResponse.json({ item: data })
//   } catch (e) {
//     console.error('GET /api/jobs/[jobId] error:', e)
//     return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
//   }
// }


// app/api/jobs/[jobId]/route.ts

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

function getJobIdSafely(req: Request, params: { jobId?: string }): string | null {
  let id = params?.jobId;
  if (!id || id === 'undefined' || id === 'null') {
    const pathname = new URL(req.url).pathname;
    const segments = pathname.split('/').filter(Boolean);
    id = segments[segments.length - 1];
  }
  if (!id || id.length < 8) return null;
  return id;
}

export async function GET(
  request: Request,
  context: { params: { jobId?: string } }
) {
  try {
    const jobId = getJobIdSafely(request, context.params);
    if (!jobId) {
      return NextResponse.json({ success: false, error: 'Invalid job ID' }, { status: 400 });
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { data, error } = await supabase
      .from('JobPosting')
      .select(`
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
        job_skills:JobSkill (
          skill_id,
          required_level,
          skill:Skill (
            id,
            name
          )
        )
      `)
      .eq('id', jobId)
      .single();

    if (error) {
      console.error("Supabase error:", error);
      if (error.code === 'PGRST116') {
        return NextResponse.json({ success: false, error: 'Job not found' }, { status: 404 });
      }
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ success: false, error: 'Job not found' }, { status: 404 });
    }

    // Format response cho frontend
    const job = {
      ...data,
      company: data.enterprise,
      locationName: data.location?.name || null,
      skills: data.job_skills?.map((js: any) => ({
        name: js.skill.name,
        required_level: js.required_level,
      })) || [],
    };

    delete (job as any).enterprise;
    delete (job as any).location;
    delete (job as any).job_skills;

    return NextResponse.json({ success: true, data: job });
  } catch (err) {
    console.error("Server error:", err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}