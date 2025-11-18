import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const ANON   = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const goodId = (id?: string) => {
  if (!id) return null
  const t = id.trim()
  return t === '' || t === 'undefined' || t === 'null' ? null : t
}

// export async function GET(_req: Request, ctx: { params: { id?: string } }) {
//   try {
//     const id = goodId(ctx.params?.id)
//     if (!id) return NextResponse.json({ error: 'Invalid event id' }, { status: 400 })

//     const sb = createClient(SB_URL, ANON, { auth: { persistSession: false, autoRefreshToken: false } })

//     // lấy event
//     const { data: ev, error: evErr } = await sb
//       .from('Event')
//       .select('*')
//       .eq('id', id)
//       .maybeSingle()
//     if (evErr) return NextResponse.json({ error: evErr.message }, { status: 400 })
//     if (!ev)  return NextResponse.json({ error: 'Not found' }, { status: 404 })

//     // lấy tags
//     const { data: et, error: etErr } = await sb
//       .from('EventTag')
//       .select('tag_id')
//       .eq('event_id', id)
//     if (etErr) return NextResponse.json({ error: etErr.message }, { status: 400 })

//     const tagIds = (et ?? []).map(x => x.tag_id)
//     let tags: any[] = []
//     if (tagIds.length) {
//       const { data: tagRows, error: tagErr } = await sb
//         .from('Tag')
//         .select('id, name')
//         .in('id', tagIds)
//       if (tagErr) return NextResponse.json({ error: tagErr.message }, { status: 400 })
//       tags = tagRows ?? []
//     }

//     return NextResponse.json({ item: { ...ev, tags } })
//   } catch (e: any) {
//     return NextResponse.json({ error: e?.message || 'Internal Server Error' }, { status: 500 })
//   }
// }
export async function GET(_req: Request, { params }: { params: Promise<{ id?: string }> }) {
  const { id: rawId } = await params
  const id = goodId(rawId)
  if (!id) return NextResponse.json({ error: 'Invalid event id' }, { status: 400 })

  const sb = createClient(SB_URL, ANON, {
    auth: { persistSession: false, autoRefreshToken: false }
  })

  // lấy event
  const { data: ev, error: evErr } = await sb
    .from('Event')
    .select('*')
    .eq('id', id)
    .maybeSingle()
  if (evErr) return NextResponse.json({ error: evErr.message }, { status: 400 })
  if (!ev) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // lấy tags
  const { data: et, error: etErr } = await sb
    .from('EventTag')
    .select('tag_id')
    .eq('event_id', id)
  if (etErr) return NextResponse.json({ error: etErr.message }, { status: 400 })

  const tagIds = (et ?? []).map(x => x.tag_id)
  let tags: any[] = []

  if (tagIds.length) {
    const { data: tagRows, error: tagErr } = await sb
      .from('Tag')
      .select('id, name')
      .in('id', tagIds)

    if (tagErr) return NextResponse.json({ error: tagErr.message }, { status: 400 })
    tags = tagRows ?? []
  }

  return NextResponse.json({ item: { ...ev, tags } })
}