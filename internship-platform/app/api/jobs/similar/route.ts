import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const url  = process.env.NEXT_PUBLIC_SUPABASE_URL!
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const clean = (s: string | null) => {
  if (!s) return null
  const t = s.trim()
  return t === '' || t === 'undefined' || t === 'null' ? null : t
}
const toInt = (v: string | null, d=10) => {
  const n = Number(v ?? '')
  return !Number.isFinite(n) || n <= 0 ? d : Math.floor(n)
}
const toArr = (s: string | null) =>
  clean(s)?.split(',').map(x => x.trim()).filter(Boolean) ?? []

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const skills = toArr(searchParams.get('skills'))        // CSV skill UUIDs
    const industry = clean(searchParams.get('industry'))    // ví dụ "Software"
    const q        = clean(searchParams.get('q'))           // keyword
    const location = clean(searchParams.get('location'))
    const workMode = clean(searchParams.get('work_mode'))   // ONSITE|HYBRID|REMOTE
    const empType  = clean(searchParams.get('employment_type'))
    const limit    = toInt(searchParams.get('limit'), 10)
    const offset   = Math.max(0, Number(searchParams.get('offset') ?? 0) || 0)

    const sb = createClient(url, anon, { auth: { persistSession: false, autoRefreshToken: false } })

    // Base select (embed Enterprise + JobSkill)
    let select = `
      id, title, description, location, is_open, application_deadline,
      allowance_min, allowance_max, work_mode, employment_type, tags,
      Enterprise:Enterprise(id, name, industry, location, image_url),
      JobSkill:JobSkill(${skills.length ? '!inner' : ''} skill_id, required_level, Skill:Skill(id,name))
    `

    let qy = sb.from('JobPosting')
      .select(select)
      .eq('is_open', true)

    if (industry) qy = qy.eq('Enterprise.industry', industry)
    if (location) qy = qy.ilike('location', `%${location}%`)
    if (workMode) qy = qy.eq('work_mode', workMode)
    if (empType)  qy = qy.eq('employment_type', empType)
    if (skills.length) qy = qy.in('JobSkill.skill_id', skills)
    if (q) {
      // match trên title + description
      qy = qy.or(`title.ilike.%${q}%,description.ilike.%${q}%`)
    }

    // Lấy nhiều hơn 1 chút để chấm điểm rồi cắt trang
    const { data, error } = await qy.limit(offset + limit + 50)
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })

    // Scoring thô
    const skillsSet = new Set(skills)
    const kw = (q ?? '').toLowerCase()
    const scored = (data ?? []).map((j: any) => {
      const jobSkills = new Set<string>((j.JobSkill ?? []).map((x: any) => x.skill_id))
      let skillOverlap = 0
      for (const s of jobSkills) if (skillsSet.has(s)) skillOverlap++

      const kwHit = kw
        ? ((j.title ?? '').toLowerCase().includes(kw) || (j.description ?? '').toLowerCase().includes(kw)) ? 1 : 0
        : 0
      const indHit = industry && j.Enterprise?.industry === industry ? 1 : 0
      const locHit = location && j.location?.toLowerCase().includes(location.toLowerCase()) ? 1 : 0

      const tags = new Set<string>(Array.isArray(j.tags) ? j.tags : [])
      let tagOverlap = 0
      if (kw) for (const t of tags) if (t.toLowerCase().includes(kw)) tagOverlap++

      const score = skillOverlap * 2.5 + indHit * 1.5 + kwHit * 1.2 + locHit * 1 + tagOverlap * 0.5
      return { score, ...j, _skillOverlap: skillOverlap }
    }).sort((a, b) => b.score - a.score)

    const items = scored.slice(offset, offset + limit)
    return NextResponse.json({ total: scored.length, items, page: { limit, offset } })
  } catch (e) {
    console.error('GET /api/jobs/similar error', e)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
