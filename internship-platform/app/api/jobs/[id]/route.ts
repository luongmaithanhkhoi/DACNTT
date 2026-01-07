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
        category:JobCategory(id, name),
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

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("Server error:", err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}