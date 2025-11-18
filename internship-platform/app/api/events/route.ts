import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const ANON   = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const toInt = (v: string | null, d=10) => {
  const n = Number(v ?? '')
  return !Number.isFinite(n) || n <= 0 ? d : Math.floor(n)
}
const clean = (s: string | null) => {
  if (!s) return null
  const t = s.trim()
  return t === '' || t === 'undefined' || t === 'null' ? null : t
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new globalThis.URL(req.url)
    const q        = clean(searchParams.get('q'))                 // search title/desc
    const status   = clean(searchParams.get('status'))            // PUBLISHED|CLOSED|DRAFT
    const type     = clean(searchParams.get('type'))              // WORKSHOP|SEMINAR|CAREER_DAY|OTHER
    const location = clean(searchParams.get('location'))
    const from     = clean(searchParams.get('from'))              // ISO date
    const to       = clean(searchParams.get('to'))                // ISO date
    const tag      = clean(searchParams.get('tag'))               // filter by Tag.name (optional)
    const limit    = toInt(searchParams.get('limit'), 10)
    const offset   = Math.max(0, Number(searchParams.get('offset') ?? 0) || 0)
    const orderBy  = clean(searchParams.get('order_by')) || 'start_date'
    const orderDir = (clean(searchParams.get('order_dir')) || 'asc').toLowerCase() === 'desc' ? 'desc' : 'asc'

    const sb = createClient(SB_URL, ANON, { auth: { persistSession: false, autoRefreshToken: false } })

    // base select (không join Tag ở đây để tránh lỗi alias; nếu filter tag sẽ làm 2 bước)
    let query = sb
      .from('Event')
      .select(`
        id, title, description, start_date, end_date, event_type, status,
        positions_available, max_participants, location, required_skills, created_at, updated_at,
        creator_id
      `, { count: 'exact' })
      .order(orderBy as any, { ascending: orderDir === 'asc' })
      .range(offset, offset + limit - 1)

    if (status) query = query.eq('status', status)
    if (type)   query = query.eq('event_type', type)
    if (location) query = query.ilike('location', `%${location}%`)

    if (q) {
      // search đơn giản trên title + description
      query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%`)
    }
    if (from) query = query.gte('start_date', from)
    if (to)   query = query.lte('end_date', to)

    const { data: baseEvents, error: baseErr, count } = await query
    if (baseErr) return NextResponse.json({ error: baseErr.message }, { status: 400 })

    // Nếu không filter tag -> trả luôn
    if (!tag) {
      return NextResponse.json({ total: count ?? 0, items: baseEvents ?? [], page: { limit, offset, order_by: orderBy, order_dir: orderDir } })
    }

    // Filter theo Tag.name: lấy id các event có tag này rồi lọc lại
    const { data: tagRows, error: tagErr } = await sb
      .from('Tag')
      .select('id')
      .eq('name', tag)
      .limit(1)
    if (tagErr) return NextResponse.json({ error: tagErr.message }, { status: 400 })
    const tagId = tagRows?.[0]?.id
    if (!tagId) {
      return NextResponse.json({ total: 0, items: [], page: { limit, offset } })
    }

    const eventIds = (baseEvents ?? []).map(e => e.id)
    if (eventIds.length === 0) {
      return NextResponse.json({ total: 0, items: [], page: { limit, offset } })
    }

    const { data: eventTag, error: etErr } = await sb
      .from('EventTag')
      .select('event_id')
      .eq('tag_id', tagId)
      .in('event_id', eventIds)

    if (etErr) return NextResponse.json({ error: etErr.message }, { status: 400 })

    const allowed = new Set((eventTag ?? []).map(x => x.event_id))
    const filtered = (baseEvents ?? []).filter(e => allowed.has(e.id))

    return NextResponse.json({
      total: filtered.length, // nếu cần count chính xác với tag, bạn có thể query lại count riêng
      items: filtered,
      page: { limit, offset, order_by: orderBy, order_dir: orderDir }
    })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Internal Server Error' }, { status: 500 })
  }
}
