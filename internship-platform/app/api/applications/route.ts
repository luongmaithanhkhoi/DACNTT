import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const ANON   = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const SVC    = process.env.SUPABASE_SERVICE_ROLE_KEY!

type Body = {
  job_id: string
  note?: string
  cover_letter?: string
  cv_url?: string
  cv_document_id?: string
  portfolio_urls?: string[]
  answers?: Record<string, unknown> | Array<unknown>
  contact_email?: string
  contact_phone?: string
  preferred_start_date?: string   // 'YYYY-MM-DD'
  availability_note?: string
  expected_allowance?: number
}

function getBearer(req: Request) {
  const h = req.headers.get('authorization') || req.headers.get('Authorization') || ''
  const [t, token] = h.split(' ')
  return t?.toLowerCase() === 'bearer' ? token : null
}

export async function POST(req: Request) {
  try {
    const token = getBearer(req)
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = (await req.json()) as Body
    if (!body?.job_id) {
      return NextResponse.json({ error: 'job_id is required' }, { status: 400 })
    }

    // map token -> app user
    const authSb = createClient(SB_URL, ANON, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { headers: { Authorization: `Bearer ${token}` } }
    })
    const { data: u, error: uErr } = await authSb.auth.getUser()
    if (uErr || !u?.user) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })

    const admin = createClient(SB_URL, SVC, { auth: { persistSession: false } })
    const { data: appUser, error: appErr } = await admin
      .from('User')
      .select('id, role, is_active, email')
      .eq('provider_uid', u.user.id)
      .single()
    if (appErr || !appUser || appUser.role !== 'STUDENT' || !appUser.is_active) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // job còn mở?
    const { data: job, error: jobErr } = await admin
      .from('JobPosting')
      .select('id, is_open, application_deadline')
      .eq('id', body.job_id)
      .single()
    if (jobErr || !job) return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    if (!job.is_open) return NextResponse.json({ error: 'Job is closed' }, { status: 400 })
    if (job.application_deadline && new Date(job.application_deadline) < new Date()) {
      return NextResponse.json({ error: 'Deadline passed' }, { status: 400 })
    }

    // build profile snapshot từ bảng Student + Skill (tối thiểu)
    const { data: student, error: stuErr } = await admin
      .from('Student')
      .select('full_name, major, gpa, summary, location, portfolio_url, socials, languages, cv_url')
      .eq('user_id', appUser.id)
      .single()
    if (stuErr) {
      // không cứng lỗi — vẫn cho apply nhưng snapshot rỗng
      // return NextResponse.json({ error: 'Student profile not found' }, { status: 400 })
    }

    // (optional) lấy skills
    const { data: skills } = await admin
      .from('StudentSkill')
      .select('level, Skill:Skill(name)')
      .eq('student_id', appUser.id)

    const profile_snapshot = {
      user_email: appUser.email,
      ...(student ?? {}),
      skills: (skills ?? []).map(s => ({ name: s.Skill?.name, level: s.level })),
      // nếu body.cv_url có cung cấp (upload bản mới), snapshot nên ưu tiên bản gửi kèm
      cv_url_at_apply: body.cv_url ?? student?.cv_url ?? null
    }

    // chuẩn hoá input optional
    const insertRow: any = {
      job_id: body.job_id,
      student_id: appUser.id,
      status: 'PENDING',
      note: body.note ?? null,
      cover_letter: body.cover_letter ?? null,
      cv_url: body.cv_url ?? null,
      cv_document_id: body.cv_document_id ?? null,
      portfolio_urls: Array.isArray(body.portfolio_urls) ? body.portfolio_urls : null,
      answers: body.answers ?? null,
      contact_email: body.contact_email ?? appUser.email ?? null,
      contact_phone: body.contact_phone ?? null,
      preferred_start_date: body.preferred_start_date ?? null,
      availability_note: body.availability_note ?? null,
      expected_allowance: body.expected_allowance ?? null,
      profile_snapshot
    }

    const { data: created, error: insErr } = await admin
      .from('Application')
      .insert(insertRow)
      .select('id, status, created_at')
      .single()

    // unique (student_id, job_id) → 409 khi nộp trùng
    // @ts-ignore
    if (insErr?.code === '23505') {
      return NextResponse.json({ error: 'Already applied' }, { status: 409 })
    }
    if (insErr) return NextResponse.json({ error: insErr.message }, { status: 400 })

    return NextResponse.json({
      ok: true,
      id: created!.id,
      status: created!.status,
      created_at: created!.created_at
    })
  } catch (e) {
    console.error('POST /applications', e)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
