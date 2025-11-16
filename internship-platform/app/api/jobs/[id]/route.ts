import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const url  = process.env.NEXT_PUBLIC_SUPABASE_URL!
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

function getIdSafely(req: Request, params: { jobId?: string }) {
  // ưu tiên params từ Next
  let id = params?.jobId
  // fallback nếu vì lý do gì đó params rỗng
  if (!id) {
    const segs = new URL(req.url).pathname.split('/').filter(Boolean)
    id = segs[segs.length - 1]
  }
  if (!id || id === 'undefined' || id === 'null') return null
  return id
}

export async function GET(req: Request, ctx: { params: { jobId?: string } }) {
  try {
    const id = getIdSafely(req, ctx.params)
    if (!id) return NextResponse.json({ error: 'Invalid job id' }, { status: 400 })

    const sb = createClient(url, anon, { auth: { persistSession: false, autoRefreshToken: false } })

    const { data, error } = await sb
      .from('JobPosting')
      .select(`
        id, title, description, location, internship_period, require_gpa_min, is_open,
        application_deadline, allowance_min, allowance_max, work_mode, employment_type, tags,
        created_at, updated_at,
        Enterprise:Enterprise(id, name, description, industry, location, website, image_url, contact_email),
        JobSkill:JobSkill(skill_id, required_level, Skill:Skill(id, name))
      `)
      .eq('id', id)
      .maybeSingle()        // tránh lỗi khi không có bản ghi

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    if (!data) return NextResponse.json({ error: 'Job not found' }, { status: 404 })

    return NextResponse.json({ item: data })
  } catch (e) {
    console.error('GET /api/jobs/[jobId] error:', e)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
