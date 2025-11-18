import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const ANON   = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const SVC    = process.env.SUPABASE_SERVICE_ROLE_KEY!

const toInt = (v: string | null, d = 10) => {
  const n = Number(v ?? '')
  return !Number.isFinite(n) || n <= 0 ? d : Math.floor(n)
}
const clean = (s: string | null) => {
  if (!s) return null
  const t = s.trim()
  return t === '' || t === 'undefined' || t === 'null' ? null : t
}
function getBearer(req: Request) {
  const h = req.headers.get('authorization') || ''
  const [t, token] = h.split(' ')
  return t?.toLowerCase() === 'bearer' ? token : null
}

export async function GET(req: Request) {
  try {
    const token = getBearer(req)
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new globalThis.URL(req.url)
    const statusQ = clean(searchParams.get('status'))   // pending|accepted|rejected
    const limit   = toInt(searchParams.get('limit'), 10)
    const offset  = Math.max(0, Number(searchParams.get('offset') ?? 0) || 0)

    // 1) map token -> app user id (SV)
    const authSb = createClient(SB_URL, ANON, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { headers: { Authorization: `Bearer ${token}` } }
    })
    const { data: u, error: uErr } = await authSb.auth.getUser()
    if (uErr || !u?.user) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })

    const admin = createClient(SB_URL, SVC, { auth: { persistSession: false } })
    const { data: appUser, error: appErr } = await admin
      .from('User')
      .select('id, role, is_active')
      .eq('provider_uid', u.user.id)
      .single()
    if (appErr || !appUser || appUser.role !== 'STUDENT' || !appUser.is_active) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // 2) Lấy danh sách application của SV (THÊM các cột mở rộng)
    let appQuery = admin
      .from('Application')
      .select(`
        id, job_id, status, note, created_at, updated_at,
        cover_letter, cv_url, cv_document_id, portfolio_urls, answers,
        contact_email, contact_phone, preferred_start_date, availability_note,
        expected_allowance, profile_snapshot
      `, { count: 'exact' })
      .eq('student_id', appUser.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (statusQ) appQuery = appQuery.eq('status', statusQ.toUpperCase())

    const { data: apps, error: appListErr, count } = await appQuery
    if (appListErr) return NextResponse.json({ error: appListErr.message }, { status: 400 })

    if (!apps || apps.length === 0) {
      return NextResponse.json({ total: count ?? 0, items: [], page: { limit, offset } })
    }

    // 3) Join thủ công JobPosting + Enterprise (như cũ, an toàn)
    const jobIds = [...new Set(apps.map(a => a.job_id))]
    const { data: jobs, error: jobsErr } = await admin
      .from('JobPosting')
      .select('id, title, location, is_open, application_deadline, allowance_min, work_mode, employment_type, enterprise_id, tags')
      .in('id', jobIds)
    if (jobsErr) return NextResponse.json({ error: jobsErr.message }, { status: 400 })

    const entIds = [...new Set((jobs ?? []).map(j => j.enterprise_id).filter(Boolean) as string[])]
    const { data: ents, error: entsErr } = await admin
      .from('Enterprise')
      .select('id, name, industry, location, image_url, website')
      .in('id', entIds.length ? entIds : ['00000000-0000-0000-0000-000000000000'])
    if (entsErr) return NextResponse.json({ error: entsErr.message }, { status: 400 })

    const jobMap = new Map((jobs ?? []).map(j => [j.id, j]))
    const entMap = new Map((ents ?? []).map(e => [e.id, e]))

    const items = apps.map(a => {
      const j = jobMap.get(a.job_id as string)
      const e = j ? entMap.get(j.enterprise_id as string) : null
      return {
        id: a.id,
        status: a.status,
        note: a.note,
        created_at: a.created_at,
        updated_at: a.updated_at,

        // ---- fields mở rộng gửi cho DN lúc apply ----
        cover_letter: a.cover_letter,
        cv_url: a.cv_url,
        cv_document_id: a.cv_document_id,
        portfolio_urls: a.portfolio_urls ?? [],
        answers: a.answers ?? null,
        contact_email: a.contact_email,
        contact_phone: a.contact_phone,
        preferred_start_date: a.preferred_start_date,
        availability_note: a.availability_note,
        expected_allowance: a.expected_allowance,
        profile_snapshot: a.profile_snapshot,   // snapshot hồ sơ tại thời điểm apply

        // ---- thông tin job đi kèm ----
        job: j ? {
          id: j.id,
          title: j.title,
          location: j.location,
          is_open: j.is_open,
          application_deadline: j.application_deadline,
          allowance_min: j.allowance_min,
          work_mode: j.work_mode,
          employment_type: j.employment_type,
          tags: j.tags ?? [],
          enterprise: e ? {
            id: e.id,
            name: e.name,
            industry: e.industry,
            location: e.location,
            image_url: e.image_url,
            website: e.website
          } : null
        } : null
      }
    })

    return NextResponse.json({ total: count ?? 0, items, page: { limit, offset } })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Internal Server Error' }, { status: 500 })
  }
}
